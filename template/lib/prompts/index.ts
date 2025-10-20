// Import all prompts statically (works on Vercel/serverless)
import { allPrompts } from '@/prompts/json';

/**
 * Get the first prompt from the imported prompts array
 * Uses static imports - works reliably on Vercel and serverless platforms
 *
 * @returns The first prompt content as a string
 *
 * @example
 * const systemPrompt = getFirstPrompt();
 */
export function getFirstPrompt(): string {
  if (!allPrompts || allPrompts.length === 0) {
    throw new Error('No prompts found in prompts/json directory');
  }

  const firstPrompt = allPrompts[0];

  if (!firstPrompt || !firstPrompt.content) {
    throw new Error('First prompt is missing content property');
  }

  return firstPrompt.content;
}

/**
 * Get all available prompts
 *
 * @returns Array of all prompt objects
 */
export function getAllPrompts() {
  return allPrompts;
}

/**
 * Get a specific prompt by index
 *
 * @param index - The index of the prompt (0-based)
 * @returns The prompt content as a string
 */
export function getPromptByIndex(index: number): string {
  if (!allPrompts || index < 0 || index >= allPrompts.length) {
    throw new Error(`Prompt at index ${index} not found`);
  }

  const prompt = allPrompts[index];

  if (!prompt || !prompt.content) {
    throw new Error(`Prompt at index ${index} is missing content property`);
  }

  return prompt.content;
}
