"use server";

import { sendChatMessage, ChatMessage } from "@/lib/ai/openrouter";
import {
  getUser,
  deductAICredits,
  createConversation,
  saveMessage,
  updateConversationTitle,
  logTokenUsage,
} from "@/lib/db/queries";
import { getModelById } from "@/lib/ai/models";
import { manageContext } from "@/lib/ai/context-manager";
import { getFirstPrompt } from "@/lib/prompts";
import { detectArtifact } from "@/lib/ai/artifact-detector";
import { acquireLock, releaseLock } from "@/lib/utils/request-lock";
import { z } from "zod";
import actionMessages from "./messages.json";

const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(2000, "Message too long"),
  conversationId: z.string().nullable().optional(),
  model: z.string().nullable().optional(),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(["system", "user", "assistant"]),
        content: z.string(),
      })
    )
    .optional(),
});

export async function sendChatAction(formData: FormData) {
  try {
    // Get current user
    const user = await getUser();
    if (!user) {
      return {
        success: false,
        message: actionMessages.chat.send.errors.notLoggedIn,
      };
    }

    // Acquire lock to prevent concurrent requests from the same user
    // This prevents race conditions in credit deduction
    const lockAcquired = acquireLock(user.id);
    if (!lockAcquired) {
      return {
        success: false,
        message: "Please wait for your current request to complete before sending another message.",
      };
    }

    // Check subscription and trial status
    const isTrialing = user.subscriptionStatus === "trialing";
    const hasActiveSubscription = user.subscriptionStatus === "active";
    const hasCredits = user.aiCreditsBalance > 0;
    const isUnsubscribed = !isTrialing && !hasActiveSubscription;
    const creditsBalance = user.aiCreditsBalance;
    const isLowCredit =
      isTrialing && creditsBalance > 0 && creditsBalance < 0.25;

    // Parse and validate input
    const message = formData.get("message") as string;
    const conversationId = formData.get("conversationId") as string | null;
    const model = formData.get("model") as string | null;
    const historyJson = formData.get("history") as string;

    let conversationHistory: ChatMessage[] = [];
    if (historyJson) {
      try {
        conversationHistory = JSON.parse(historyJson);
      } catch {
        conversationHistory = [];
      }
    }

    const validatedData = chatMessageSchema.parse({
      message,
      conversationId,
      model,
      conversationHistory,
    });

    // Build messages array
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: getFirstPrompt(),
      },
      ...conversationHistory,
      {
        role: "user",
        content: validatedData.message,
      },
    ];

    // Create or get conversation ID
    let currentConversationId = validatedData.conversationId;
    let isNewConversation = false;
    if (!currentConversationId) {
      // Create new conversation
      currentConversationId = await createConversation(user.id);
      isNewConversation = true;
    }

    // Get model configuration
    const modelToUse = validatedData.model || "anthropic/claude-sonnet-4.5";
    const modelConfig = getModelById(modelToUse);

    // Use model's maxTokens if found, otherwise default to 128000
    const modelMaxTokens = modelConfig?.maxTokens || 128000;

    // Enforce access restrictions based on subscription status
    if (isUnsubscribed) {
      // UNSUBSCRIBED USERS (no subscription at all)
      releaseLock(user.id);
      return {
        success: false,
        message: actionMessages.chat.send.errors.noSubscription,
      };
    } else if (isTrialing) {
      // TRIAL USERS - check credits
      if (!hasCredits) {
        releaseLock(user.id);
        return {
          success: false,
          message: actionMessages.chat.send.errors.trialDepleted,
          isTrialDepleted: true,
        };
      }
      // Low credit warning (will be shown in UI)
      if (isLowCredit) {
        // Allow the message to go through, but flag low credits
        // The UI will show a warning banner
      }
    } else if (hasActiveSubscription) {
      // ACTIVE PAID SUBSCRIPTION - check credits
      if (!hasCredits) {
        releaseLock(user.id);
        return {
          success: false,
          message: actionMessages.chat.send.errors.noCredits,
        };
      }
    }

    // Apply smart context management (summarize if conversation is too long)
    const { optimizedMessages } = await manageContext(
      messages,
      modelMaxTokens,
      modelToUse // Pass the model ID for consistent summarization
    );

    // Send to AI first (before saving anything to database)
    const response = await sendChatMessage(
      optimizedMessages,
      modelToUse,
      modelMaxTokens
    );

    // Deduct credits for all users (trial and paid)
    // This is done atomically at the database level to prevent race conditions
    if (response.costInDollars > 0) {
      // Attempt atomic deduction - will fail if insufficient credits
      const deductionSuccessful = await deductAICredits(
        user.id,
        response.costInDollars
      );

      if (!deductionSuccessful) {
        // Deduction failed - insufficient credits
        // This shouldn't happen since we checked before, but could occur
        // if credits were consumed by another process (though lock prevents this)
        releaseLock(user.id);
        return {
          success: false,
          message: actionMessages.chat.send.errors.insufficientCredits
            .replace("{{cost}}", response.costInDollars.toFixed(4))
            .replace("{{balance}}", creditsBalance.toFixed(2)),
        };
      }
    }

    // Only save messages AFTER AI responds successfully
    // This prevents orphaned user messages if AI fails

    // Save user message to database
    await saveMessage(currentConversationId, "user", validatedData.message);

    // Update conversation title with first few words of first message
    if (isNewConversation) {
      const words = validatedData.message.trim().split(/\s+/);
      const title = words.slice(0, 6).join(" ");
      const finalTitle =
        title.length < validatedData.message.length ? `${title}...` : title;
      await updateConversationTitle(currentConversationId, finalTitle);
    }

    // Detect if AI response should be displayed as artifact
    const artifactData = detectArtifact(response.message);

    // Save assistant response to database
    const assistantMessageId = await saveMessage(
      currentConversationId,
      "assistant",
      response.message,
      modelToUse,
      response.tokensUsed,
      response.costInDollars,
      !!artifactData
    );

    // Log token usage to permanent table with separate input/output tracking
    await logTokenUsage(
      user.id,
      response.inputTokens,
      response.outputTokens,
      response.totalTokens,
      response.inputCost,
      response.outputCost,
      response.totalCost,
      modelToUse
    );

    // Get fresh credit balance after deduction to return accurate value
    const updatedUser = await getUser();
    const creditsRemaining = updatedUser?.aiCreditsBalance || 0;

    // Release lock before returning
    releaseLock(user.id);

    // Return response with artifact detection info
    return {
      success: true,
      message: response.message,
      messageId: assistantMessageId,
      tokensUsed: response.tokensUsed,
      costInDollars: response.costInDollars,
      creditsRemaining: creditsRemaining,
      conversationId: currentConversationId,
      isArtifact: !!artifactData,
      artifactTitle: artifactData?.title,
      lowCreditWarning: isLowCredit,
      isNewConversation,
    };
  } catch (error) {
    // IMPORTANT: Release lock even on error
    // Get user ID from the current scope (user might be undefined if auth failed)
    const user = await getUser();
    if (user) {
      releaseLock(user.id);
    }

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      };
    }

    console.error("Chat action error:", error);
    return {
      success: false,
      message: actionMessages.chat.send.errors.failed,
    };
  }
}
