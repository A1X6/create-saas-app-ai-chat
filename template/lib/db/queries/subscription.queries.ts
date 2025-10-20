import { eq } from 'drizzle-orm';
import { db } from '../index';
import { userProfiles } from '../schema';

/**
 * Subscription Queries
 *
 * Handles all subscription-related database operations including:
 * - Updating subscription status
 * - Linking Stripe customer IDs
 * - Managing subscription data
 */

/**
 * Update user subscription information
 * Called from Stripe webhooks when subscription changes
 */
export async function updateUserSubscription(
  userId: string,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  await db
    .update(userProfiles)
    .set({
      ...subscriptionData,
      updatedAt: new Date(),
    })
    .where(eq(userProfiles.id, userId));
}

/**
 * Update user's Stripe customer ID
 * Called after successful checkout to link user with Stripe customer
 */
export async function updateUserStripeCustomerId(userId: string, customerId: string) {
  await db
    .update(userProfiles)
    .set({
      stripeCustomerId: customerId,
      updatedAt: new Date(),
    })
    .where(eq(userProfiles.id, userId));
}
