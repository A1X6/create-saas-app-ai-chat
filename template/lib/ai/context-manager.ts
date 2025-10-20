import { encode } from 'gpt-tokenizer';
import { ChatMessage } from "./openrouter";

/**
 * Advanced Context Manager with Accurate Token Counting
 *
 * Features:
 * - Uses gpt-tokenizer for accurate token counting (not estimates)
 * - Uses the same model for summarization as the user's selected model
 * - Dynamically adjusts max_tokens for summarization based on available context
 * - Smart context window management
 */

// Configuration
const RECENT_MESSAGES_TO_KEEP = 10; // Always keep last 10 messages (5 exchanges)
const TOKEN_THRESHOLD_PERCENTAGE = 0.7; // Summarize if input > 70% of max
const SUMMARY_RESERVE_TOKENS = 500; // Reserve tokens for summary response

/**
 * Accurately count tokens using gpt-tokenizer
 * This uses the same tokenizer as GPT models for precise counting
 */
const countTokens = (messages: ChatMessage[]): number => {
  try {
    let totalTokens = 0;

    for (const message of messages) {
      // Message overhead (role, content markers, etc.)
      totalTokens += 4;

      // Count tokens in role
      totalTokens += encode(message.role).length;

      // Count tokens in content
      totalTokens += encode(message.content).length;
    }

    // Assistant response overhead
    totalTokens += 2;

    return totalTokens;
  } catch (error) {
    console.error("Error counting tokens:", error);
    // Fallback to character-based estimation
    const totalChars = messages.reduce(
      (sum, m) => sum + m.role.length + m.content.length,
      0
    );
    return Math.ceil(totalChars / 3.5);
  }
};

/**
 * Count tokens in a single text string
 */
const countTextTokens = (text: string): number => {
  try {
    return encode(text).length;
  } catch (error) {
    console.error("Error counting text tokens:", error);
    return Math.ceil(text.length / 3.5);
  }
};

/**
 * Summarize old messages using the SAME model the user selected
 * This ensures consistent quality and respects the user's model choice
 *
 * @param messages - Messages to summarize
 * @param modelId - The model ID the user is using (e.g., 'anthropic/claude-3.5-sonnet')
 * @param availableTokens - How many tokens we can use for the summary
 */
async function summarizeMessages(
  messages: ChatMessage[],
  modelId: string,
  availableTokens: number
): Promise<string> {
  try {
    // Create a compact summary of the conversation
    const conversationText = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const summaryPrompt = `Please provide a concise summary of this conversation, capturing the key points, decisions, and context. Keep it under 200 words:

${conversationText}

Summary:`;

    // Count tokens in the prompt
    const promptTokens = countTextTokens(summaryPrompt);

    // Calculate max tokens for response (leave some reserve)
    const maxSummaryTokens = Math.min(
      availableTokens - promptTokens - SUMMARY_RESERVE_TOKENS,
      1000 // Cap at 1000 tokens for summary
    );

    if (maxSummaryTokens < 100) {
      console.warn("[Context Manager] Not enough tokens for AI summary, using fallback");
      // Fallback to simple truncation
      return messages
        .map((m) => `${m.role}: ${m.content.substring(0, 50)}...`)
        .join(" | ");
    }

    // Import sendChatMessage dynamically to avoid circular dependency
    const { sendChatMessage } = await import("./openrouter");

    // Use the SAME model the user selected for summarization
    console.log(
      `[Context Manager] Using model ${modelId} for summarization (max ${maxSummaryTokens} tokens)`
    );

    const response = await sendChatMessage(
      [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes conversations concisely.",
        },
        {
          role: "user",
          content: summaryPrompt,
        },
      ],
      modelId, // Use the SAME model as the user's selection
      maxSummaryTokens, // Dynamic max_tokens based on available context
      0.3 // Lower temperature for consistent summaries
    );

    return response.message;
  } catch (error) {
    console.error("Error summarizing messages:", error);
    // Fallback: Create a simple text summary
    return messages
      .map((m) => `${m.role}: ${m.content.substring(0, 100)}...`)
      .join(" ");
  }
}

/**
 * Smart context management with accurate token counting
 *
 * @param messages - All messages in the conversation
 * @param modelMaxTokens - Maximum tokens the model can handle
 * @param modelId - The model ID being used (for consistent summarization)
 * @returns Optimized messages, summary status, and tokens reduced
 */
export async function manageContext(
  messages: ChatMessage[],
  modelMaxTokens: number,
  modelId: string
): Promise<{
  optimizedMessages: ChatMessage[];
  wasSummarized: boolean;
  tokensReduced: number;
}> {
  const totalTokens = countTokens(messages);
  const threshold = modelMaxTokens * TOKEN_THRESHOLD_PERCENTAGE;

  console.log(
    `[Context Manager] Total tokens: ${totalTokens}, Threshold: ${threshold}, Model: ${modelId}`
  );

  // If under threshold, return as-is
  if (totalTokens < threshold) {
    console.log("[Context Manager] ✓ Under threshold, no optimization needed");
    return {
      optimizedMessages: messages,
      wasSummarized: false,
      tokensReduced: 0,
    };
  }

  console.log("[Context Manager] ⚠️ Over threshold, applying optimization...");

  // Extract system message (always keep)
  const systemMessage = messages.find((m) => m.role === "system");

  // Extract recent messages (always keep)
  const recentMessages = messages.slice(-RECENT_MESSAGES_TO_KEEP);

  // Extract old messages (to be summarized)
  const oldMessagesStartIndex = messages.findIndex((m) => m.role !== "system");
  const oldMessagesEndIndex = messages.length - RECENT_MESSAGES_TO_KEEP;
  const oldMessages = messages.slice(
    oldMessagesStartIndex,
    Math.max(oldMessagesStartIndex, oldMessagesEndIndex)
  );

  // If no old messages to summarize, use sliding window
  if (oldMessages.length === 0) {
    console.log("[Context Manager] No old messages, using sliding window");
    const optimizedMessages = systemMessage
      ? [systemMessage, ...recentMessages]
      : recentMessages;

    return {
      optimizedMessages,
      wasSummarized: false,
      tokensReduced: totalTokens - countTokens(optimizedMessages),
    };
  }

  // Calculate available tokens for summarization
  const systemTokens = systemMessage ? countTokens([systemMessage]) : 0;
  const recentTokens = countTokens(recentMessages);
  const availableTokens = modelMaxTokens - systemTokens - recentTokens;

  // Summarize old messages using the same model
  console.log(
    `[Context Manager] Summarizing ${oldMessages.length} old messages using ${modelId}...`
  );
  const summary = await summarizeMessages(oldMessages, modelId, availableTokens);

  // Build optimized message array
  const optimizedMessages: ChatMessage[] = [];

  // Add system message if exists
  if (systemMessage) {
    optimizedMessages.push(systemMessage);
  }

  // Add summary as a system message
  optimizedMessages.push({
    role: "system",
    content: `[Previous conversation summary]: ${summary}`,
  });

  // Add recent messages
  optimizedMessages.push(...recentMessages);

  const newTokenCount = countTokens(optimizedMessages);
  const tokensReduced = totalTokens - newTokenCount;

  console.log(`[Context Manager] ✓ Optimization complete`);
  console.log(`[Context Manager] Original: ${totalTokens} tokens`);
  console.log(`[Context Manager] Optimized: ${newTokenCount} tokens`);
  console.log(
    `[Context Manager] Reduced: ${tokensReduced} tokens (${Math.round((tokensReduced / totalTokens) * 100)}%)`
  );

  return {
    optimizedMessages,
    wasSummarized: true,
    tokensReduced,
  };
}

/**
 * Fallback: Simple sliding window (keep only recent messages)
 */
export function applySlidingWindow(
  messages: ChatMessage[],
  maxMessages: number = 20
): ChatMessage[] {
  const systemMessage = messages.find((m) => m.role === "system");
  const nonSystemMessages = messages.filter((m) => m.role !== "system");

  const recentMessages = nonSystemMessages.slice(-maxMessages);

  return systemMessage ? [systemMessage, ...recentMessages] : recentMessages;
}

/**
 * Export token counting functions for use in other modules
 */
export { countTokens, countTextTokens };
