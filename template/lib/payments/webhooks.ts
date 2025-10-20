import Stripe from "stripe";
import { stripe } from "./stripe-client";
import {
  getUserByStripeCustomerId,
  updateUserSubscription,
  updateUserStripeCustomerId,
  logActivity,
  resetAICredits,
} from "@/lib/db/queries";
import { ActivityType } from "@/lib/db/schema";

/**
 * Stripe Webhook Handlers
 *
 * Handles Stripe webhook events including:
 * - Subscription lifecycle events
 * - Checkout completion
 * - Trial to paid conversions
 * - Credit allocation
 */

/**
 * Handle subscription change events
 *
 * Events handled:
 * - customer.subscription.created
 * - customer.subscription.updated
 * - customer.subscription.deleted
 *
 * Features:
 * - Updates subscription status in database
 * - Allocates AI credits for active subscriptions
 * - No credits for trial users (free models only)
 * - Logs activity for audit trail
 */
export async function handleSubscriptionChange(
  subscription: Stripe.Subscription,
  eventType?: string
) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const status = subscription.status;

  const userProfile = await getUserByStripeCustomerId(customerId);

  if (!userProfile) {
    console.error("User not found for Stripe customer:", customerId);
    return;
  }

  if (status === "active" || status === "trialing") {
    const price = subscription.items.data[0]?.price;
    const productId =
      typeof price?.product === "string"
        ? price.product
        : price?.product?.id;

    // Get plan name from price nickname (e.g., "Base Monthly", "Plus Yearly")
    const planName = price?.nickname || "Unknown";

    await updateUserSubscription(userProfile.id, {
      stripeSubscriptionId: subscriptionId,
      stripeProductId: productId || null,
      planName: planName,
      subscriptionStatus: status,
    });

    // Get AI credits amount from product metadata
    // Note: Trial users don't get credits - they can only use free models
    // Credits are only allocated when subscription becomes active (first payment)
    if (productId) {
      try {
        const product = await stripe.products.retrieve(productId);
        const creditsAmount = product.metadata?.ai_credits_amount;

        if (creditsAmount) {
          const fullCredits = parseFloat(creditsAmount);
          const isTrialing = status === 'trialing';

          if (status === 'active') {
            // Active subscription: Always allocate full credits
            // This handles both:
            // 1. Trial → Active conversion (first payment made)
            // 2. New active subscription without trial
            // 3. Subscription updates/plan changes
            console.log(
              `Setting AI credits to $${fullCredits} for user ${userProfile.id} (active subscription)`
            );
            await resetAICredits(userProfile.id, fullCredits);
          } else if (isTrialing) {
            // Trial users: No credits allocated
            console.log(
              `User ${userProfile.id} is on trial - no credits allocated (can use free models only)`
            );
          }
        }
      } catch (error) {
        console.error("Error fetching product metadata for credits:", error);
      }
    }

    // Log activity based on event type
    if (eventType === "customer.subscription.created") {
      await logActivity(userProfile.id, ActivityType.SUBSCRIPTION_CREATED);
    } else if (eventType === "customer.subscription.updated") {
      await logActivity(userProfile.id, ActivityType.SUBSCRIPTION_UPDATED);
    }
  } else if (status === "canceled" || status === "unpaid") {
    await updateUserSubscription(userProfile.id, {
      stripeSubscriptionId: null,
      stripeProductId: null,
      planName: null,
      subscriptionStatus: status,
    });

    // Log cancellation
    if (status === "canceled") {
      await logActivity(userProfile.id, ActivityType.SUBSCRIPTION_CANCELED);
    }
  }
}

/**
 * Handle checkout session completed event
 *
 * Features:
 * - Links Stripe customer ID to user
 * - Saves subscription details
 * - Allocates AI credits (only for paid, not trial)
 * - Marks customer as having used trial
 * - Logs activity
 */
export async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
) {
  const userId = session.client_reference_id;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId || !customerId) {
    console.error("Missing userId or customerId in checkout session");
    return;
  }

  // Save the customer ID
  await updateUserStripeCustomerId(userId, customerId);
  console.log(`Linked customer ${customerId} to user ${userId}`);

  // If this checkout created a subscription, fetch and save subscription details
  if (subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const nickname = subscription.items.data[0].price.nickname; // "Base Monthly"
      const productId = subscription.items.data[0].price.product as string;

      await updateUserSubscription(userId, {
        stripeSubscriptionId: subscriptionId,
        stripeProductId: productId,
        planName: nickname,
        subscriptionStatus: subscription.status,
      });

      // Get AI credits amount from product metadata
      // Note: Trial users don't get credits - they can only use free models
      // Credits are only allocated when subscription becomes active (first payment)
      try {
        const product = await stripe.products.retrieve(productId);
        const creditsAmount = product.metadata?.ai_credits_amount;

        if (creditsAmount) {
          const fullCredits = parseFloat(creditsAmount);
          const isTrialing = subscription.status === 'trialing';

          if (isTrialing) {
            // Trial users: No credits allocated, can only use free models
            console.log(
              `User ${userId} is on trial - no credits allocated (can use free models only)`
            );
          } else {
            // Paid subscription: Allocate full credits
            console.log(
              `Setting AI credits to $${fullCredits} for user ${userId} (paid subscription)`
            );
            await resetAICredits(userId, fullCredits);
          }
        }
      } catch (error) {
        console.error("Error fetching product metadata for credits:", error);
      }

      // If subscription has a trial, mark customer as having used their trial
      if (
        subscription.trial_end &&
        subscription.trial_end > Math.floor(Date.now() / 1000)
      ) {
        try {
          await stripe.customers.update(customerId, {
            metadata: {
              had_trial: "true",
            },
          });
          console.log(`Marked customer ${customerId} as having used trial`);
        } catch (error) {
          console.error("Error updating customer trial metadata:", error);
        }
      }

      await logActivity(userId, ActivityType.SUBSCRIPTION_CREATED);
      console.log(
        `Created subscription ${subscriptionId} for user ${userId} with plan ${nickname}`
      );
    } catch (error) {
      console.error("Error fetching subscription details:", error);
    }
  }
}
