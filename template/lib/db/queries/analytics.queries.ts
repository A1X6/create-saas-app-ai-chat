/**
 * Analytics Queries
 * Queries for dashboard charts and analytics
 */

import { db } from '@/lib/db';
import { tokenUsageLogs, userProfiles } from '@/lib/db/schema';
import { eq, sql, and, gte } from 'drizzle-orm';
import { cache } from 'react';

/**
 * Get weekly token usage percentage grouped by day
 * Returns the last 7 days of token usage as percentage of total monthly limit
 */
export const getWeeklyTokenUsage = cache(async (userId: string) => {
  try {
    // Get user's token limit and current usage
    const user = await db
      .select({
        limit: userProfiles.freeTokensLimit,
        used: userProfiles.freeTokensUsed,
      })
      .from(userProfiles)
      .where(eq(userProfiles.id, userId))
      .limit(1);

    if (!user.length || !user[0].limit) {
      return [];
    }

    const tokenLimit = Number(user[0].limit);
    const totalUsed = Number(user[0].used);

    // Get data for the last 7 days from permanent token usage logs
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await db
      .select({
        date: sql<string>`DATE(${tokenUsageLogs.timestamp})`,
        tokens: sql<number>`COALESCE(SUM(CAST(${tokenUsageLogs.totalTokens} AS INTEGER)), 0)`,
      })
      .from(tokenUsageLogs)
      .where(
        and(
          eq(tokenUsageLogs.userId, userId),
          gte(tokenUsageLogs.timestamp, sevenDaysAgo)
        )
      )
      .groupBy(sql`DATE(${tokenUsageLogs.timestamp})`)
      .orderBy(sql`DATE(${tokenUsageLogs.timestamp})`);

    // Create a map of the last 7 days with 0 usage as default
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        day: daysOfWeek[date.getDay()],
        date: date.toISOString().split('T')[0],
        usage: 0,
      };
    });

    // Merge actual data with the template and calculate percentages based on TOTAL monthly limit
    const dataMap = new Map(result.map(r => [r.date, Number(r.tokens)]));

    return last7Days.map(day => {
      const tokensUsed = dataMap.get(day.date) || 0;
      const usagePercentage = tokenLimit > 0 ? Math.min((tokensUsed / tokenLimit) * 100, 100) : 0;

      return {
        day: day.day,
        usage: Number(usagePercentage.toFixed(2)), // Keep 2 decimal places for accuracy
      };
    });
  } catch (error) {
    console.error('Error fetching weekly token usage:', error);
    // Return empty data on error
    return Array.from({ length: 7 }, (_, i) => ({
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][(new Date().getDay() - 6 + i + 7) % 7],
      usage: 0,
    }));
  }
});

/**
 * Get monthly credits usage percentage
 * Returns the last 6 months of credit usage as percentage
 */
export const getMonthlyCreditsUsage = cache(async (userId: string) => {
  try {
    // Get current user's allocated credits
    const user = await db
      .select({
        allocated: userProfiles.aiCreditsAllocated,
      })
      .from(userProfiles)
      .where(eq(userProfiles.id, userId))
      .limit(1);

    if (!user.length) {
      return [];
    }

    const allocated = Number(user[0].allocated);

    // If no credits allocated, return empty data
    if (allocated === 0) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        return {
          month: monthNames[date.getMonth()],
          usage: 0,
        };
      });
    }

    // Get data for the last 6 months from permanent token usage logs
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const result = await db
      .select({
        month: sql<string>`TO_CHAR(${tokenUsageLogs.timestamp}, 'Mon')`,
        monthNum: sql<number>`EXTRACT(MONTH FROM ${tokenUsageLogs.timestamp})::integer`,
        yearNum: sql<number>`EXTRACT(YEAR FROM ${tokenUsageLogs.timestamp})::integer`,
        totalCost: sql<number>`COALESCE(SUM(${tokenUsageLogs.totalCost}), 0)::numeric`,
      })
      .from(tokenUsageLogs)
      .where(
        and(
          eq(tokenUsageLogs.userId, userId),
          gte(tokenUsageLogs.timestamp, sixMonthsAgo)
        )
      )
      .groupBy(
        sql`TO_CHAR(${tokenUsageLogs.timestamp}, 'Mon')`,
        sql`EXTRACT(MONTH FROM ${tokenUsageLogs.timestamp})`,
        sql`EXTRACT(YEAR FROM ${tokenUsageLogs.timestamp})`
      )
      .orderBy(
        sql`EXTRACT(YEAR FROM ${tokenUsageLogs.timestamp})`,
        sql`EXTRACT(MONTH FROM ${tokenUsageLogs.timestamp})`
      );

    // Create a map of the last 6 months
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return {
        month: monthNames[date.getMonth()],
        monthNum: date.getMonth() + 1,
        yearNum: date.getFullYear(),
        usage: 0,
      };
    });

    // Merge actual data with the template
    const dataMap = new Map(
      result.map(r => [
        `${r.yearNum}-${r.monthNum}`,
        Number(r.totalCost),
      ])
    );

    // Calculate cumulative usage percentage over time
    let cumulativeUsed = 0;
    return last6Months.map(month => {
      const key = `${month.yearNum}-${month.monthNum}`;
      const monthCost = dataMap.get(key) || 0;
      cumulativeUsed += monthCost;

      const usagePercentage = allocated > 0 ? Math.min((cumulativeUsed / allocated) * 100, 100) : 0;

      return {
        month: month.month,
        usage: Math.round(usagePercentage),
      };
    });
  } catch (error) {
    console.error('Error fetching monthly credits usage:', error);
    // Return empty data on error
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return {
        month: monthNames[date.getMonth()],
        usage: 0,
      };
    });
  }
});
