import { eq, sql } from "drizzle-orm";
import { db } from "../index";
import { userProfiles } from "../schema";

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
 *
 * Uses atomic SQL operations to prevent race conditions when multiple
 * requests try to deduct credits concurrently for the same user.
 *
 * Returns true if deduction was successful, false if insufficient credits.
 */
export async function deductAICredits(
  userId: string,
  costInDollars: number
): Promise<boolean> {
  // Use atomic database-level arithmetic with WHERE clause to prevent negative balance
  // This ensures credits are deducted correctly even with concurrent requests
  const result = await db
    .update(userProfiles)
    .set({
      aiCreditsBalance: sql`${userProfiles.aiCreditsBalance} - ${costInDollars}`,
      aiCreditsUsed: sql`${userProfiles.aiCreditsUsed} + ${costInDollars}`,
      updatedAt: new Date(),
    })
    .where(
      sql`${userProfiles.id} = ${userId} AND ${userProfiles.aiCreditsBalance} >= ${costInDollars}`
    )
    .returning();

  // If no rows were updated, it means insufficient credits
  return result.length > 0;
}

/**
 * Set AI credits for a user
 * Called on subscription activation/renewal
 */
export async function setAICredits(userId: string, creditsAmount: number) {
  await db
    .update(userProfiles)
    .set({
      aiCreditsBalance: creditsAmount.toFixed(6),
      aiCreditsAllocated: creditsAmount.toFixed(6),
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

  const allocated =
    creditsAmount !== undefined
      ? creditsAmount
      : parseFloat(profile.aiCreditsAllocated || "0");

  await db
    .update(userProfiles)
    .set({
      aiCreditsBalance: allocated.toFixed(6),
      aiCreditsAllocated: allocated.toFixed(6),
      aiCreditsUsed: "0.000000", // Reset usage counter on new billing cycle
      updatedAt: new Date(),
    })
    .where(eq(userProfiles.id, userId));
}
