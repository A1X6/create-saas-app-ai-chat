/**
 * Artifact Detection Configuration
 *
 * Artifacts are AI responses displayed in split-view (desktop) or drawer (mobile).
 *
 * CUSTOMIZE THIS FUNCTION to detect specific patterns in your AI's output.
 * This example detects markdown code blocks - modify for your use case.
 *
 * @param message - The AI assistant's response
 * @returns Object with title and content if artifact detected, null otherwise
 */

export interface ArtifactDetectionResult {
  title: string;
  content: string;
}

/**
 * Detect if AI response should be displayed as an artifact
 *
 * EXAMPLE: Detects responses containing code blocks
 * CUSTOMIZE: Change pattern to match your AI's special outputs
 *
 * Common patterns to detect:
 * - Code generation: Triple backticks with language
 * - Structured documents: Specific headings/markers
 * - JSON/XML: Structured data formats
 * - Custom markers: Keywords you define in system prompt
 */
export function detectArtifact(
  message: string
): ArtifactDetectionResult | null {
  // Example: Detect code blocks (at least 5 lines)
  const codeBlockMatch = message.match(/```(\w+)?\s*\n([\s\S]+?)\n```/);

  if (codeBlockMatch && codeBlockMatch[2].split("\n").length >= 5) {
    const language = codeBlockMatch[1] || "code";
    const title = `Generated ${language.charAt(0).toUpperCase() + language.slice(1)} Code`;

    return {
      title,
      content: message,
    };
  }

  // Add more detection patterns here
  // Example: Detect specific heading
  // if (message.toLowerCase().includes('## generated document')) {
  //   return { title: 'Generated Document', content: message };
  // }

  return null; // No artifact detected
}
