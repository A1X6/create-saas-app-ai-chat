import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/index';
import { userProfiles } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

/**
 * Cron job to reset free tokens monthly for free tier users
 * This runs on the 1st of each month to reset token usage for unsubscribed users
 *
 * Security: Protected by Vercel Cron Secret or Authorization header
 *
 * Free tier users have a monthly limit (default: 1M tokens)
 * This cron resets their usage counter so they can continue using free models
 */
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron or has valid authorization
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Reset free tokens for all users WITHOUT active/trialing subscriptions
    // Users with subscriptions have unlimited free model usage, so they don't need reset
    const result = await db
      .update(userProfiles)
      .set({
        freeTokensUsed: 0,
        updatedAt: new Date(),
      })
      .where(
        sql`(${userProfiles.subscriptionStatus} IS NULL OR ${userProfiles.subscriptionStatus} NOT IN ('active', 'trialing'))`
      )
      .returning({
        id: userProfiles.id,
        email: sql<string>`(SELECT email FROM auth.users WHERE id = ${userProfiles.id})`,
        freeTokensLimit: userProfiles.freeTokensLimit,
        previousUsage: userProfiles.freeTokensUsed,
      });

    console.log(`[Cron] Reset free tokens for ${result.length} free tier users`);

    return NextResponse.json({
      success: true,
      message: `Reset free tokens for ${result.length} free tier users`,
      timestamp: new Date().toISOString(),
      usersReset: result.length,
      users: result.map(u => ({
        id: u.id,
        limit: u.freeTokensLimit,
        previousUsage: u.previousUsage,
      })),
    });
  } catch (error) {
    console.error('[Cron] Error resetting free tokens:', error);
    return NextResponse.json(
      { error: 'Failed to reset free tokens', details: error },
      { status: 500 }
    );
  }
}
