'use server';

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Complete setup by updating environment configuration
export async function completeSetup(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Update .env.local with SETUP_COMPLETE flag
    const envPath = join(process.cwd(), '.env.local');
    if (existsSync(envPath)) {
      let envContent = await readFile(envPath, 'utf8');

      // Check if SETUP_COMPLETE already exists
      if (envContent.includes('SETUP_COMPLETE=')) {
        // Replace existing value
        envContent = envContent.replace(/SETUP_COMPLETE=.*/g, 'SETUP_COMPLETE=true');
      } else {
        // Add SETUP_COMPLETE flag at the end
        envContent += '\n\n# Setup Wizard\nSETUP_COMPLETE=true\n';
      }

      await writeFile(envPath, envContent, 'utf8');
    }

    return {
      success: true,
      message: 'Setup completed successfully! You can now start building your application.',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to complete setup',
    };
  }
}
