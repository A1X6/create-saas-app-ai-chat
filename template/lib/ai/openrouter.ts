import OpenAI from "openai";

// Initialize OpenAI client with OpenRouter configuration
const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_BASE_URL,
    "X-Title": "YourApp",
  },
});

// Default AI parameters (can be overridden via environment variables)
const DEFAULT_TEMPERATURE = parseFloat(process.env.AI_TEMPERATURE || "0.7");

// Estimate tokens using character count (approximation)
// GPT models: ~4 characters = 1 token on average
// This is a simplified approach that doesn't require tiktoken WASM files
const estimateTokens = (text: string): number => {
  // Average: 1 token ≈ 4 characters (English text)
  // For safety, we use 3.5 characters per token (slightly overestimate)
  return Math.ceil(text.length / 3.5);
};

// Count tokens in messages using estimation
const countMessageTokens = (messages: ChatMessage[]): number => {
  let totalTokens = 0;
  for (const message of messages) {
    // Each message has overhead: role, content separators, etc.
    totalTokens += 4; // Overhead per message
    totalTokens += estimateTokens(message.role);
    totalTokens += estimateTokens(message.content);
  }

  totalTokens += 2; // Overhead for assistant response
  return totalTokens;
};

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  message: string;
  // Separate token counts for accurate cost tracking
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  // Separate costs (input and output have different rates)
  inputCost: number;
  outputCost: number;
  totalCost: number;
  // Legacy field for backward compatibility
  tokensUsed: number;
  costInDollars: number;
}

// ...existing code...
export async function sendChatMessage(
  messages: ChatMessage[],
  model: string = "meta-llama/llama-4-maverick:free",
  modelMaxTokens: number = 128000, // Model's total context window
  temperature: number = DEFAULT_TEMPERATURE
): Promise<ChatResponse> {
  try {
    console.log("sendChatMessage:start", {
      model,
      modelMaxTokens,
      temperature,
      messagesLength: messages?.length ?? 0,
    });

    // Count input tokens (all messages) using character-based estimation
    const estimatedInputTokens = countMessageTokens(messages);
    console.log("sendChatMessage:estimatedInputTokens", { estimatedInputTokens });

    // Calculate available output tokens
    // Reserve 20% buffer for safety and message overhead
    const bufferPercentage = 0.8;
    const availableOutputTokens = Math.floor(
      (modelMaxTokens - estimatedInputTokens) * bufferPercentage
    );
    console.log("sendChatMessage:availableOutputTokens", {
      availableOutputTokens,
      bufferPercentage,
      modelMaxTokens,
      estimatedInputTokens,
    });

    // Ensure we have at least 100 tokens for output
    const maxOutputTokens = Math.max(
      100,
      Math.min(availableOutputTokens, modelMaxTokens)
    );
    console.log("sendChatMessage:maxOutputTokens", { maxOutputTokens });

    // Log a small preview of messages to avoid huge logs
    const messagesPreview = messages.map((m) => ({
      role: m.role,
      contentPreview: (m.content || "").slice(0, 200),
    }));
    console.log("sendChatMessage:requestPayload", {
      model,
      temperature,
      max_tokens: maxOutputTokens,
      messagesPreview,
    });

    const completion = await openrouter.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxOutputTokens, // Dynamic based on input length
    });

    console.log("sendChatMessage:completionRaw", {
      choicesLength: completion?.choices?.length ?? 0,
      usage: completion?.usage,
    });

    const message = completion.choices[0]?.message?.content || "";
    console.log("sendChatMessage:message", { length: message.length });

    // Extract separate input/output token counts from OpenRouter response
    const inputTokens = completion.usage?.prompt_tokens || 0;
    const outputTokens = completion.usage?.completion_tokens || 0;
    const totalTokens = completion.usage?.total_tokens || 0;
    console.log("sendChatMessage:tokens", { inputTokens, outputTokens, totalTokens });

    // OpenRouter returns cost in the response - it may be total or separate
    // @ts-expect-error - OpenRouter may include custom fields
    const totalCost = parseFloat(completion.usage?.cost || "0") || 0;
    console.log("sendChatMessage:totalCostParsed", { totalCost });

    // Calculate separate input/output costs
    let inputCost = 0;
    let outputCost = 0;

    if (totalTokens > 0 && totalCost > 0) {
      const inputWeight = inputTokens * 0.4;
      const outputWeight = outputTokens * 1.0;
      const totalWeight = inputWeight + outputWeight;

      if (totalWeight > 0) {
        inputCost = (totalCost * inputWeight) / totalWeight;
        outputCost = (totalCost * outputWeight) / totalWeight;
      }
    }
    console.log("sendChatMessage:costsCalculated", { inputCost, outputCost });

    return {
      message,
      // Separate token counts
      inputTokens,
      outputTokens,
      totalTokens,
      // Separate costs
      inputCost,
      outputCost,
      totalCost,
      // Legacy fields for backward compatibility
      tokensUsed: totalTokens,
      costInDollars: totalCost,
    };
  } catch (error) {
    console.error("OpenRouter API error in sendChatMessage:", error, {
      model,
      messagesLength: messages?.length ?? 0,
    });
    throw new Error("Failed to get response from AI");
  }
}
// ...existing code...
