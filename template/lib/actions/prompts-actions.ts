'use server';

import { readdirSync, existsSync, writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join, extname, basename } from 'path';
import messages from './messages.json';

const MARKDOWN_DIR = join(process.cwd(), 'prompts', 'markdown');
const JSON_DIR = join(process.cwd(), 'prompts', 'json');
const INDEX_FILE = join(JSON_DIR, 'index.ts');

// List markdown prompt files
export async function listPromptFiles(): Promise<{
  success: boolean;
  files: string[];
  message: string;
}> {
  try {
    if (!existsSync(MARKDOWN_DIR)) {
      return {
        success: false,
        files: [],
        message: messages.prompts.list.errors.markdownDirNotFound,
      };
    }

    const files = readdirSync(MARKDOWN_DIR).filter(file => extname(file) === '.md');

    return {
      success: true,
      files,
      message: messages.prompts.list.markdown.success.replace('{{count}}', files.length.toString()),
    };
  } catch (error) {
    return {
      success: false,
      files: [],
      message: error instanceof Error ? error.message : 'Failed to list prompt files',
    };
  }
}

// List generated JSON files
export async function listJsonFiles(): Promise<{
  success: boolean;
  files: string[];
  message: string;
}> {
  try {
    if (!existsSync(JSON_DIR)) {
      return {
        success: true,
        files: [],
        message: messages.prompts.list.json.empty,
      };
    }

    const files = readdirSync(JSON_DIR).filter(file => extname(file) === '.json');

    return {
      success: true,
      files,
      message: messages.prompts.list.json.success.replace('{{count}}', files.length.toString()),
    };
  } catch (error) {
    return {
      success: false,
      files: [],
      message: error instanceof Error ? error.message : 'Failed to list JSON files',
    };
  }
}

// Helper function to convert a single markdown file to JSON
function convertMarkdownToJson(markdownPath: string, jsonPath: string): void {
  const content = readFileSync(markdownPath, 'utf-8');
  const jsonContent = {
    content: content,
  };
  writeFileSync(jsonPath, JSON.stringify(jsonContent, null, 2), 'utf-8');
}

// Helper function to generate the index.ts file with all prompts
function generateIndexFile(jsonFiles: string[]): void {
  // Generate import statements
  const imports = jsonFiles.map(file => {
    const name = basename(file, '.json');
    const camelCaseName = name.replace(/-./g, x => x[1].toUpperCase());
    return `import ${camelCaseName} from './${file}';`;
  }).join('\n');

  // Generate array items
  const arrayItems = jsonFiles.map(file => {
    const name = basename(file, '.json');
    const camelCaseName = name.replace(/-./g, x => x[1].toUpperCase());
    return `  ${camelCaseName},`;
  }).join('\n');

  // Generate individual exports
  const individualExports = jsonFiles.map(file => {
    const name = basename(file, '.json');
    const camelCaseName = name.replace(/-./g, x => x[1].toUpperCase());
    return camelCaseName;
  }).join(', ');

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

// Convert markdown prompts to JSON and update index file
export async function convertPromptsToJson(): Promise<{
  success: boolean;
  message: string;
  output?: string;
  convertedCount?: number;
}> {
  try {
    // Check if markdown directory exists
    if (!existsSync(MARKDOWN_DIR)) {
      return {
        success: false,
        message: messages.prompts.convert.errors.markdownDirNotFound,
      };
    }

    // Ensure JSON directory exists
    if (!existsSync(JSON_DIR)) {
      mkdirSync(JSON_DIR, { recursive: true });
    }

    // Get all markdown files
    const markdownFiles = readdirSync(MARKDOWN_DIR).filter(file => extname(file) === '.md');

    if (markdownFiles.length === 0) {
      return {
        success: false,
        message: messages.prompts.convert.errors.noMarkdownFiles,
      };
    }

    let convertedCount = 0;
    const output: string[] = [];

    // Convert each markdown file to JSON
    for (const mdFile of markdownFiles) {
      const mdPath = join(MARKDOWN_DIR, mdFile);
      const jsonFileName = basename(mdFile, '.md') + '.json';
      const jsonPath = join(JSON_DIR, jsonFileName);

      try {
        convertMarkdownToJson(mdPath, jsonPath);
        output.push(
          messages.prompts.convert.output.converted
            .replace('{{mdFile}}', mdFile)
            .replace('{{jsonFile}}', jsonFileName)
        );
        convertedCount++;
      } catch (error) {
        output.push(
          messages.prompts.convert.output.failed
            .replace('{{mdFile}}', mdFile)
            .replace('{{error}}', error instanceof Error ? error.message : 'Unknown error')
        );
      }
    }

    // Get all JSON files (including newly converted ones)
    const jsonFiles = readdirSync(JSON_DIR)
      .filter(file => extname(file) === '.json')
      .sort(); // Sort alphabetically for consistent ordering

    // Generate index.ts file with all prompts
    try {
      generateIndexFile(jsonFiles);
      output.push(
        '\n' + messages.prompts.convert.output.indexUpdated.replace('{{count}}', jsonFiles.length.toString())
      );
    } catch (error) {
      output.push(
        '\n' + messages.prompts.convert.output.indexFailed.replace(
          '{{error}}',
          error instanceof Error ? error.message : 'Unknown error'
        )
      );
    }

    return {
      success: convertedCount > 0,
      message: messages.prompts.convert.success.replace('{{count}}', convertedCount.toString()),
      output: output.join('\n'),
      convertedCount,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to convert prompts',
      output: error instanceof Error ? error.message : undefined,
    };
  }
}

// Upload markdown files
export async function uploadPromptFiles(formData: FormData): Promise<{
  success: boolean;
  message: string;
  filesUploaded?: number;
}> {
  try {
    // Ensure markdown directory exists
    if (!existsSync(MARKDOWN_DIR)) {
      mkdirSync(MARKDOWN_DIR, { recursive: true });
    }

    const files = formData.getAll('files') as File[];

    if (files.length === 0) {
      return {
        success: false,
        message: messages.prompts.upload.errors.noFiles,
      };
    }

    let uploaded = 0;

    for (const file of files) {
      // Validate file type
      if (!file.name.endsWith('.md')) {
        continue;
      }

      // Read file content
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const content = buffer.toString('utf-8');

      // Write to markdown directory
      const filePath = join(MARKDOWN_DIR, file.name);
      writeFileSync(filePath, content, 'utf-8');
      uploaded++;
    }

    if (uploaded === 0) {
      return {
        success: false,
        message: messages.prompts.upload.errors.noValidFiles,
      };
    }

    return {
      success: true,
      message: messages.prompts.upload.success.replace('{{count}}', uploaded.toString()),
      filesUploaded: uploaded,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to upload files',
    };
  }
}

// Check prompts status
export async function checkPromptsStatus(): Promise<{
  success: boolean;
  markdownCount: number;
  jsonCount: number;
  markdownFiles: string[];
  jsonFiles: string[];
  message: string;
}> {
  try {
    const markdownResult = await listPromptFiles();
    const jsonResult = await listJsonFiles();

    return {
      success: true,
      markdownCount: markdownResult.files.length,
      jsonCount: jsonResult.files.length,
      markdownFiles: markdownResult.files,
      jsonFiles: jsonResult.files,
      message: messages.prompts.status.success
        .replace('{{markdownCount}}', markdownResult.files.length.toString())
        .replace('{{jsonCount}}', jsonResult.files.length.toString()),
    };
  } catch (error) {
    return {
      success: false,
      markdownCount: 0,
      jsonCount: 0,
      markdownFiles: [],
      jsonFiles: [],
      message: error instanceof Error ? error.message : 'Failed to check prompts status',
    };
  }
}
