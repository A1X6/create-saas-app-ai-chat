import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/index';
import { userProfiles } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

/**
 * Cron job to reset AI credits monthly for yearly subscription users
 * This runs on the 1st of each month to reset credits for yearly subscribers
 *
 * Security: Protected by Vercel Cron Secret or Authorization header
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

    // Reset credits for all users with yearly subscriptions
    // Monthly subscriptions reset automatically via webhook on billing cycle
    const result = await db
      .update(userProfiles)
      .set({
        aiCreditsBalance: sql`${userProfiles.aiCreditsAllocated}`,
        aiCreditsUsed: '0.00',
        updatedAt: new Date(),
      })
      .where(
        sql`${userProfiles.planName} LIKE '%Yearly%' AND ${userProfiles.aiCreditsAllocated} > 0`
      )
      .returning({
        id: userProfiles.id,
        planName: userProfiles.planName,
        credits: userProfiles.aiCreditsAllocated
      });

    console.log(`[Cron] Reset credits for ${result.length} yearly subscribers`);

    return NextResponse.json({
      success: true,
      message: `Reset credits for ${result.length} yearly subscribers`,
      timestamp: new Date().toISOString(),
      usersReset: result.length,
      users: result,
    });
  } catch (error) {
    console.error('[Cron] Error resetting yearly credits:', error);
    return NextResponse.json(
      { error: 'Failed to reset credits', details: error },
      { status: 500 }
    );
  }
}
