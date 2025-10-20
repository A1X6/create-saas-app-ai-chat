import { eq, desc } from 'drizzle-orm';
import { cache } from 'react';
import { db } from '../index';
import { activityLogs, ActivityType, type NewActivityLog } from '../schema';
import { getUser } from './user.queries';

/**
 * Activity Logging Queries
 *
 * Handles all activity logging operations including:
 * - Logging user actions
 * - Retrieving activity history
 * - Audit trail management
 */

/**
 * Log user activity
 * Used to track all user actions for audit trail and analytics
 */
export async function logActivity(
  userId: string,
  action: ActivityType | string,
  ipAddress?: string
) {
  const newActivity: NewActivityLog = {
    userId,
    action,
    ipAddress: ipAddress || null,
  };

  await db.insert(activityLogs).values(newActivity);
}

/**
 * Get activity logs for current authenticated user
 * Returns last 10 activities, cached for performance
 */
export const getActivityLogs = cache(async () => {
  const user = await getUser();
  if (!user) return [];

  const logs = await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      userId: activityLogs.userId,
    })
    .from(activityLogs)
    .where(eq(activityLogs.userId, user.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);

  return logs;
});
