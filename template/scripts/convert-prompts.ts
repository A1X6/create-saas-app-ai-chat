/**
 * Convert Markdown Prompts to JSON Script
 *
 * This script converts all markdown prompt files to JSON format
 * and generates an index.ts file for static imports.
 *
 * Usage:
 *   pnpm prompts:convert
 *
 * What it does:
 *   1. Reads all .md files from prompts/markdown/
 *   2. Converts each to JSON format with {content: "..."}
 *   3. Writes JSON files to prompts/json/
 *   4. Auto-generates prompts/json/index.ts with exports
 *
 * Prerequisites:
 *   - Markdown files must exist in prompts/markdown/
 */

import { readdirSync, existsSync, writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join, extname, basename } from 'path';

const MARKDOWN_DIR = join(process.cwd(), 'prompts', 'markdown');
const JSON_DIR = join(process.cwd(), 'prompts', 'json');
const INDEX_FILE = join(JSON_DIR, 'index.ts');

/**
 * Convert a single markdown file to JSON
 */
function convertMarkdownToJson(markdownPath: string, jsonPath: string): void {
  const content = readFileSync(markdownPath, 'utf-8');
  const jsonContent = {
    content: content,
  };
  writeFileSync(jsonPath, JSON.stringify(jsonContent, null, 2), 'utf-8');
}

/**
 * Generate the index.ts file with all prompts
 */
function generateIndexFile(jsonFiles: string[]): void {
  // Generate import statements
  const imports = jsonFiles
    .map((file) => {
      const name = basename(file, '.json');
      const camelCaseName = name.replace(/-./g, (x) => x[1].toUpperCase());
      return `import ${camelCaseName} from './${file}';`;
    })
    .join('\n');

  // Generate array items
  const arrayItems = jsonFiles
    .map((file) => {
      const name = basename(file, '.json');
      const camelCaseName = name.replace(/-./g, (x) => x[1].toUpperCase());
      return `  ${camelCaseName},`;
    })
    .join('\n');

  // Generate individual exports
  const individualExports = jsonFiles
    .map((file) => {
      const name = basename(file, '.json');
      const camelCaseName = name.replace(/-./g, (x) => x[1].toUpperCase());
      return camelCaseName;
    })
    .join(', ');

  const indexContent = `// Auto-generated file - Do not edit manually
// This file is automatically updated when converting prompts

${imports}

// Export all prompts as an array
export const allPrompts = [
${arrayItems}
];

// Export individual prompts
export { ${individualExports} };
`;

  writeFileSync(INDEX_FILE, indexContent, 'utf-8');
}

/**
 * Main conversion logic
 */
async function main() {
  console.log('🚀 Starting prompt conversion...\n');

  try {
    // Check if markdown directory exists
    if (!existsSync(MARKDOWN_DIR)) {
      console.error('❌ Error: Markdown directory not found');
      console.error(`   Expected path: ${MARKDOWN_DIR}`);
      console.error('\n💡 Create the directory and add .md files, then run this script again.');
      process.exit(1);
    }

    // Ensure JSON directory exists
    if (!existsSync(JSON_DIR)) {
      console.log('📁 Creating JSON directory...');
      mkdirSync(JSON_DIR, { recursive: true });
      console.log('✓ JSON directory created\n');
    }

    // Get all markdown files
    const markdownFiles = readdirSync(MARKDOWN_DIR).filter(
      (file) => extname(file) === '.md'
    );

    if (markdownFiles.length === 0) {
      console.error('❌ Error: No markdown files found');
      console.error(`   Directory: ${MARKDOWN_DIR}`);
      console.error('\n💡 Add .md files to the markdown directory, then run this script again.');
      process.exit(1);
    }

    console.log(`📄 Found ${markdownFiles.length} markdown file(s):\n`);
    markdownFiles.forEach((file) => console.log(`   • ${file}`));
    console.log('');

    // Convert each markdown file to JSON
    let convertedCount = 0;
    const failedFiles: string[] = [];

    console.log('🔄 Converting to JSON...\n');

    for (const mdFile of markdownFiles) {
      const mdPath = join(MARKDOWN_DIR, mdFile);
      const jsonFileName = basename(mdFile, '.md') + '.json';
      const jsonPath = join(JSON_DIR, jsonFileName);

      try {
        convertMarkdownToJson(mdPath, jsonPath);
        console.log(`   ✓ ${mdFile} → ${jsonFileName}`);
        convertedCount++;
      } catch (error) {
        console.error(`   ✗ Failed: ${mdFile}`);
        console.error(`     Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        failedFiles.push(mdFile);
      }
    }

    console.log('');

    // Get all JSON files (including newly converted ones)
    const jsonFiles = readdirSync(JSON_DIR)
      .filter((file) => extname(file) === '.json')
      .sort(); // Sort alphabetically for consistent ordering

    // Generate index.ts file with all prompts
    console.log('📦 Generating index.ts file...\n');

    try {
      generateIndexFile(jsonFiles);
      console.log(`   ✓ Created index.ts with ${jsonFiles.length} prompt(s)`);
    } catch (error) {
      console.error(`   ✗ Failed to generate index.ts`);
      console.error(`     Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ Conversion complete!\n');
    console.log(`   Converted: ${convertedCount}/${markdownFiles.length} file(s)`);
    if (failedFiles.length > 0) {
      console.log(`   Failed: ${failedFiles.length} file(s)`);
      console.log('\n   Failed files:');
      failedFiles.forEach((file) => console.log(`   • ${file}`));
    }
    console.log(`\n   Output directory: ${JSON_DIR}`);
    console.log('='.repeat(50));

    if (failedFiles.length > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Run script
main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
