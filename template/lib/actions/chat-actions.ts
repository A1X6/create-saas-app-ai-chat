'use server';

import { sendChatMessage, ChatMessage } from '@/lib/ai/openrouter';
import { getUser, deductAICredits, deductFreeTokens, createConversation, saveMessage, updateConversationTitle, logTokenUsage } from '@/lib/db/queries';
import { getModelById, isModelFree } from '@/lib/ai/models';
import { manageContext } from '@/lib/ai/context-manager';
import { getFirstPrompt } from '@/lib/prompts';
import { z } from 'zod';

const chatMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(2000, 'Message too long'),
  conversationId: z.string().nullable().optional(),
  model: z.string().nullable().optional(),
  conversationHistory: z.array(
    z.object({
      role: z.enum(['system', 'user', 'assistant']),
      content: z.string(),
    })
  ).optional(),
});

export async function sendChatAction(formData: FormData) {
  try {
    // Get current user
    const user = await getUser();
    if (!user) {
      return {
        success: false,
        message: 'You must be logged in to use the chatbot',
      };
    }

    // Check subscription and trial status
    const isTrialing = user.subscriptionStatus === 'trialing';
    const hasActiveSubscription = user.subscriptionStatus === 'active';
    const hasCredits = user.aiCreditsBalance > 0;
    const isUnsubscribed = !isTrialing && !hasActiveSubscription;
    const hasFreeTokens = user.freeTokensUsed < user.freeTokensLimit;

    // Parse and validate input
    const message = formData.get('message') as string;
    const conversationId = formData.get('conversationId') as string | null;
    const model = formData.get('model') as string | null;
    const historyJson = formData.get('history') as string;

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
        role: 'system',
        content: getFirstPrompt(),
      },
      ...conversationHistory,
      {
        role: 'user',
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
    const modelToUse = validatedData.model || 'meta-llama/llama-4-maverick:free';
    const modelConfig = getModelById(modelToUse);
    const modelIsFree = isModelFree(modelToUse);

    // Use model's maxTokens if found, otherwise default to 128000
    const modelMaxTokens = modelConfig?.maxTokens || 128000;

    // Enforce access restrictions based on subscription status
    if (isUnsubscribed) {
      // UNSUBSCRIBED USERS (no trial, no subscription)
      if (!modelIsFree) {
        // Cannot use paid models at all
        return {
          success: false,
          message: 'Subscribe to access paid AI models. Free users can only use free models.',
        };
      }
      // Using free model - check free token limit
      if (!hasFreeTokens) {
        return {
          success: false,
          message: `You have used all ${user.freeTokensLimit} free tokens. Subscribe to get unlimited access to free models and credits for paid models.`,
        };
      }
    } else if (isTrialing) {
      // TRIAL USERS
      if (!modelIsFree) {
        return {
          success: false,
          message: 'You are on a trial period and can only use free models. Upgrade to access paid models.',
        };
      }
      // Trial users can use free models unlimited
    } else if (hasActiveSubscription) {
      // ACTIVE PAID SUBSCRIPTION
      if (!modelIsFree) {
        // Paid model - check credits
        if (!hasCredits) {
          return {
            success: false,
            message: 'You have no credits remaining. You can still use free models unlimited or upgrade your plan to add more credits.',
          };
        }
      }
      // Free model with active subscription - unlimited access
    }

    // Apply smart context management (summarize if conversation is too long)
    const { optimizedMessages, wasSummarized, tokensReduced } = await manageContext(
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

    // Deduct credits/tokens based on model type and user subscription
    if (!modelIsFree && response.costInDollars > 0) {
      // PAID MODEL - deduct from subscription credits
      const newBalance = user.aiCreditsBalance - response.costInDollars;
      if (newBalance < 0) {
        return {
          success: false,
          message: `This request costs $${response.costInDollars.toFixed(4)} but you only have $${user.aiCreditsBalance.toFixed(2)} remaining. Please upgrade your plan.`,
        };
      }

      // Deduct actual API cost from user credits
      await deductAICredits(user.id, response.costInDollars);
    } else if (modelIsFree && isUnsubscribed) {
      // FREE MODEL + UNSUBSCRIBED USER - deduct from free token limit
      const success = await deductFreeTokens(user.id, response.tokensUsed);
      if (!success) {
        return {
          success: false,
          message: `You don't have enough free tokens. You used ${user.freeTokensUsed} out of ${user.freeTokensLimit} tokens. Subscribe to get unlimited access.`,
        };
      }
    }
    // FREE MODEL + SUBSCRIBED/TRIAL USER - no deduction (unlimited)

    // Only save messages AFTER AI responds successfully
    // This prevents orphaned user messages if AI fails

    // Save user message to database
    await saveMessage(
      currentConversationId,
      'user',
      validatedData.message
    );

    // Update conversation title with first few words of first message
    if (isNewConversation) {
      const words = validatedData.message.trim().split(/\s+/);
      const title = words.slice(0, 6).join(' ');
      const finalTitle = title.length < validatedData.message.length ? `${title}...` : title;
      await updateConversationTitle(currentConversationId, finalTitle);
    }

    // Save assistant response to database
    await saveMessage(
      currentConversationId,
      'assistant',
      response.message,
      modelToUse,
      response.tokensUsed,
      response.costInDollars
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

    // Calculate remaining credits (only deducted for paid models)
    const creditsRemaining = modelIsFree
      ? user.aiCreditsBalance
      : user.aiCreditsBalance - response.costInDollars;

    return {
      success: true,
      message: response.message,
      tokensUsed: response.tokensUsed,
      costInDollars: response.costInDollars,
      creditsRemaining: creditsRemaining,
      conversationId: currentConversationId,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      };
    }

    console.error('Chat action error:', error);
    return {
      success: false,
      message: 'Failed to send message. Please try again.',
    };
  }
}
