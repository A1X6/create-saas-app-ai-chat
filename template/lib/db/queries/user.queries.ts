import { eq } from 'drizzle-orm';
import { cache } from 'react';
import { db } from '../index';
import { userProfiles } from '../schema';
import { createClient } from '@/lib/supabase/server';

/**
 * User Profile Queries
 *
 * Handles all user profile related database operations including:
 * - Fetching current authenticated user
 * - Creating user profiles
 * - Updating user profiles
 * - Looking up users by Stripe customer ID
 */

/**
 * Get current authenticated user from Supabase with profile data
 * Uses React cache to prevent duplicate queries in the same request
 */
export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Get user profile from our database
  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.id, user.id))
    .limit(1);

  return {
    id: user.id,
    email: user.email!,
    name: profile?.name || null,
    stripeCustomerId: profile?.stripeCustomerId || null,
    stripeSubscriptionId: profile?.stripeSubscriptionId || null,
    stripeProductId: profile?.stripeProductId || null,
    planName: profile?.planName || null,
    subscriptionStatus: profile?.subscriptionStatus || null,
    aiCreditsBalance: profile?.aiCreditsBalance ? parseFloat(profile.aiCreditsBalance) : 0,
    aiCreditsAllocated: profile?.aiCreditsAllocated ? parseFloat(profile.aiCreditsAllocated) : 0,
    aiCreditsUsed: profile?.aiCreditsUsed ? parseFloat(profile.aiCreditsUsed) : 0,
    freeTokensUsed: profile?.freeTokensUsed || 0,
    freeTokensLimit: profile?.freeTokensLimit || 1000000,
  };
});

/**
 * Get or create user profile
 * Used during sign up to ensure profile exists
 */
export async function getOrCreateUserProfile(userId: string, email: string) {
  const [existingProfile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.id, userId))
    .limit(1);

  if (existingProfile) {
    return existingProfile;
  }

  // Create profile if it doesn't exist
  const [newProfile] = await db
    .insert(userProfiles)
    .values({
      id: userId,
      name: email.split('@')[0], // Default name from email
    })
    .returning();

  return newProfile;
}

/**
 * Get user profile by Stripe customer ID
 * Used in webhook handlers to find user from Stripe events
 */
export async function getUserByStripeCustomerId(customerId: string) {
  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.stripeCustomerId, customerId))
    .limit(1);

  return profile || null;
}

/**
 * Update user profile information (name, etc.)
 */
export async function updateUserProfile(userId: string, data: { name?: string }) {
  await db
    .update(userProfiles)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(userProfiles.id, userId));
}
