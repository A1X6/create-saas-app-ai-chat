'use server';

import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { exec } from 'child_process';
import { promisify } from 'util';
import messages from './messages.json';

const execAsync = promisify(exec);

// Test database connection
export async function testDatabaseConnection(): Promise<{
  success: boolean;
  message: string;
  latency?: number;
}> {
  try {
    const startTime = Date.now();

    // Simple query to test connection
    await db.execute(sql`SELECT 1`);

    const latency = Date.now() - startTime;

    return {
      success: true,
      message: messages.database.connection.success,
      latency,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to connect to database',
    };
  }
}

// Check if tables exist
export async function checkTablesExist(): Promise<{
  success: boolean;
  tables: string[];
  message: string;
}> {
  try {
    const result = await db.execute(sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('user_profiles', 'activity_logs', 'chat_conversations', 'chat_messages')
      ORDER BY table_name
    `);

    const tables = result.rows.map((row) => (row as { table_name: string }).table_name);
    const expectedTables = ['user_profiles', 'activity_logs', 'chat_conversations', 'chat_messages'];
    const allTablesExist = expectedTables.every(table => tables.includes(table));

    return {
      success: allTablesExist,
      tables,
      message: allTablesExist
        ? messages.database.tables.check.success
        : messages.database.tables.check.errors.missingTables.replace(
            '{{tables}}',
            expectedTables.filter(t => !tables.includes(t)).join(', ')
          ),
    };
  } catch (error) {
    return {
      success: false,
      tables: [],
      message: error instanceof Error ? error.message : 'Failed to check tables',
    };
  }
}

// Get table row counts
export async function getTableCounts(): Promise<{
  success: boolean;
  counts: Record<string, number>;
  message: string;
}> {
  try {
    const tables = ['user_profiles', 'activity_logs', 'chat_conversations', 'chat_messages'];
    const counts: Record<string, number> = {};

    for (const table of tables) {
      try {
        const result = await db.execute(sql.raw(`SELECT COUNT(*) as count FROM ${table}`));
        counts[table] = Number(result.rows[0]?.count || 0);
      } catch {
        counts[table] = 0;
      }
    }

    return {
      success: true,
      counts,
      message: messages.database.counts.success,
    };
  } catch (error) {
    return {
      success: false,
      counts: {},
      message: error instanceof Error ? error.message : 'Failed to get table counts',
    };
  }
}

// Push schema to database using drizzle-kit
export async function pushSchema(): Promise<{
  success: boolean;
  message: string;
  output?: string;
}> {
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      return {
        success: false,
        message: messages.database.schema.push.errors.noDatabaseUrl,
      };
    }

    // Run drizzle-kit push command
    const { stdout, stderr } = await execAsync('pnpm db:push', {
      cwd: process.cwd(),
      env: process.env,
    });

    const output = stdout + stderr;

    // Check if push was successful
    if (stderr && stderr.toLowerCase().includes('error')) {
      return {
        success: false,
        message: messages.database.schema.push.errors.failed,
        output,
      };
    }

    return {
      success: true,
      message: messages.database.schema.push.success,
      output,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : messages.database.schema.push.errors.failed,
      output: error instanceof Error ? error.message : undefined,
    };
  }
}

// Verify schema integrity
export async function verifySchema(): Promise<{
  success: boolean;
  issues: string[];
  message: string;
}> {
  const issues: string[] = [];

  try {
    // Check if all tables exist
    const tablesCheck = await checkTablesExist();
    if (!tablesCheck.success) {
      issues.push(tablesCheck.message);
    }

    // Check if user_profiles has required columns
    const userProfilesColumns = await db.execute(sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'user_profiles'
    `);

    const requiredColumns = [
      'id', 'name', 'created_at', 'updated_at',
      'stripe_customer_id', 'stripe_subscription_id', 'stripe_product_id',
      'plan_name', 'subscription_status',
      'ai_credits_balance', 'ai_credits_allocated', 'ai_credits_used'
    ];

    const existingColumns = userProfilesColumns.rows.map((row) => (row as { column_name: string }).column_name);
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));

    if (missingColumns.length > 0) {
      issues.push(
        messages.database.schema.verify.errors.missingColumns.replace(
          '{{columns}}',
          missingColumns.join(', ')
        )
      );
    }

    return {
      success: issues.length === 0,
      issues,
      message: issues.length === 0
        ? messages.database.schema.verify.success
        : messages.database.schema.verify.errors.issuesFound.replace(
            '{{count}}',
            issues.length.toString()
          ),
    };
  } catch (error) {
    return {
      success: false,
      issues: [error instanceof Error ? error.message : messages.database.schema.verify.errors.failed],
      message: messages.database.schema.verify.errors.failed,
    };
  }
}
