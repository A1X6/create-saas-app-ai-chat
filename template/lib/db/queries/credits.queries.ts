import { eq } from 'drizzle-orm';
import { db } from '../index';
import { userProfiles } from '../schema';

/**
 * AI Credits Queries
 *
 * Handles all AI credits related database operations including:
 * - Deducting credits after AI API calls
 * - Setting initial credit amounts
 * - Resetting credits on billing cycles
 * - Credit balance management
 */

/**
 * Deduct AI credits after API usage
 * Called after each paid AI model request with actual cost
 */
export async function deductAICredits(userId: string, costInDollars: number) {
  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.id, userId))
    .limit(1);

  if (!profile) return;

  const currentBalance = parseFloat(profile.aiCreditsBalance || '0');
  const currentUsed = parseFloat(profile.aiCreditsUsed || '0');

  await db
    .update(userProfiles)
    .set({
      aiCreditsBalance: (currentBalance - costInDollars).toFixed(2),
      aiCreditsUsed: (currentUsed + costInDollars).toFixed(2),
      updatedAt: new Date(),
    })
    .where(eq(userProfiles.id, userId));
}

/**
 * Set AI credits for a user
 * Called on subscription activation/renewal
 */
export async function setAICredits(userId: string, creditsAmount: number) {
  await db
    .update(userProfiles)
    .set({
      aiCreditsBalance: creditsAmount.toFixed(2),
      aiCreditsAllocated: creditsAmount.toFixed(2),
      updatedAt: new Date(),
    })
    .where(eq(userProfiles.id, userId));
}

/**
 * Reset AI credits to allocated amount
 * Called on monthly billing cycle or when upgrading plan
 * If creditsAmount is provided, updates the allocated amount
 */
export async function resetAICredits(userId: string, creditsAmount?: number) {
  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.id, userId))
    .limit(1);

  if (!profile) return;

  const allocated = creditsAmount !== undefined
    ? creditsAmount
    : parseFloat(profile.aiCreditsAllocated || '0');

  await db
    .update(userProfiles)
    .set({
      aiCreditsBalance: allocated.toFixed(2),
      aiCreditsAllocated: allocated.toFixed(2),
      aiCreditsUsed: '0.00', // Reset usage counter on new billing cycle
      updatedAt: new Date(),
    })
    .where(eq(userProfiles.id, userId));
}

/**
 * Deduct free tokens after free model usage (for unsubscribed users only)
 * Returns true if deduction was successful, false if not enough tokens
 */
export async function deductFreeTokens(userId: string, tokensUsed: number): Promise<boolean> {
  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.id, userId))
    .limit(1);

  if (!profile) return false;

  const currentUsed = profile.freeTokensUsed || 0;
  const limit = profile.freeTokensLimit || 1000000;

  // Check if user has enough free tokens
  if (currentUsed + tokensUsed > limit) {
    return false; // Not enough tokens
  }

  // Deduct tokens
  await db
    .update(userProfiles)
    .set({
      freeTokensUsed: currentUsed + tokensUsed,
      updatedAt: new Date(),
    })
    .where(eq(userProfiles.id, userId));

  return true;
}

/**
 * Reset free tokens to 0 (monthly reset or on subscription)
 */
export async function resetFreeTokens(userId: string) {
  await db
    .update(userProfiles)
    .set({
      freeTokensUsed: 0,
      updatedAt: new Date(),
    })
    .where(eq(userProfiles.id, userId));
}
