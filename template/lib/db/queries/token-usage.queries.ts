/**
 * Token Usage Queries
 * Permanent token usage tracking (survives conversation deletion)
 */

import { db } from '@/lib/db';
import { tokenUsageLogs } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { cache } from 'react';

/**
 * Log token usage to permanent table with separate input/output tracking
 * This data persists even when conversations are deleted
 */
export async function logTokenUsage(
  userId: string,
  inputTokens: number,
  outputTokens: number,
  totalTokens: number,
  inputCost: number,
  outputCost: number,
  totalCost: number,
  model?: string
) {
  try {
    await db.insert(tokenUsageLogs).values({
      userId,
      inputTokens,
      outputTokens,
      totalTokens,
      inputCost: inputCost.toString(),
      outputCost: outputCost.toString(),
      totalCost: totalCost.toString(),
      model,
    });
  } catch (error) {
    console.error('Error logging token usage:', error);
    throw error;
  }
}

/**
 * Get total tokens used by user (all time)
 */
export const getTotalTokensUsed = cache(async (userId: string) => {
  try {
    const result = await db
      .select({
        total: sql<number>`COALESCE(SUM(CAST(${tokenUsageLogs.totalTokens} AS INTEGER)), 0)`,
      })
      .from(tokenUsageLogs)
      .where(eq(tokenUsageLogs.userId, userId))
      .limit(1);

    return Number(result[0]?.total ?? 0);
  } catch (error) {
    console.error('Error fetching total tokens used:', error);
    return 0;
  }
});
