import { redirect } from "next/navigation";
import Stripe from "stripe";
import { stripe } from "./stripe-client";
import { getUser } from "@/lib/db/queries";

/**
 * Checkout Session Management
 *
 * Handles Stripe checkout flow including:
 * - Creating checkout sessions
 * - Trial period management
 * - Redirect logic for existing subscriptions
 */

/**
 * Create Stripe checkout session for subscription
 *
 * Features:
 * - Redirects existing active subscribers to customer portal
 * - Offers trial period for first-time customers (7 days monthly, 14 days yearly)
 * - Tracks trial usage in customer metadata
 */
export async function createCheckoutSession({ priceId }: { priceId: string }) {
  const user = await getUser();

  if (!user) {
    redirect(`/auth/sign-up?redirect=checkout&priceId=${priceId}`);
  }

  // If user has an existing active subscription, redirect to customer portal
  if (user.stripeSubscriptionId && user.stripeCustomerId) {
    const existingSubscription = await stripe.subscriptions.retrieve(
      user.stripeSubscriptionId
    );

    // Only redirect if subscription is active or trialing
    if (
      existingSubscription.status === "active" ||
      existingSubscription.status === "trialing"
    ) {
      console.log(
        `User already has active subscription, redirecting to customer portal`
      );

      // Import dynamically to avoid circular dependency
      const { createCustomerPortalSession } = await import('./portal');
      const portalSession = await createCustomerPortalSession();
      redirect(portalSession.url);
    }
  }

  // Check if customer has already used their trial
  let hadTrial = false;
  let customerId = user.stripeCustomerId;

  if (customerId) {
    try {
      const customer = await stripe.customers.retrieve(customerId);
      if (customer.deleted) {
        console.log("Customer was deleted, will create new customer");
        customerId = null;
      } else {
        hadTrial = customer.metadata?.had_trial === "true";
        console.log(`Customer ${customerId} had_trial: ${hadTrial}`);
      }
    } catch (error) {
      console.error("Error retrieving customer:", error);
      // Continue without trial check
    }
  }

  // Fetch price to determine interval (monthly vs yearly)
  let trialDays = 0;
  if (!hadTrial) {
    try {
      const price = await stripe.prices.retrieve(priceId);
      const interval = price.recurring?.interval;

      if (interval === "month") {
        trialDays = 7; // 7 days for monthly
        console.log("Offering 7-day trial for monthly subscription");
      } else if (interval === "year") {
        trialDays = 14; // 14 days for yearly
        console.log("Offering 14-day trial for yearly subscription");
      }
    } catch (error) {
      console.error("Error fetching price details:", error);
      // Don't default to trial if we can't determine interval
      trialDays = 0;
    }
  } else {
    console.log("Customer already had trial, no trial offered");
  }

  // Determine trial period based on whether customer has had a trial before
  const subscriptionData: Stripe.Checkout.SessionCreateParams.SubscriptionData =
    {};
  if (trialDays > 0) {
    subscriptionData.trial_period_days = trialDays;
  }

  // Create new checkout session (for users without subscription)
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
        adjustable_quantity: {
          enabled: false, // Disable quantity adjustment
        },
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
    customer: customerId || undefined,
    customer_email: !customerId ? user.email : undefined, // Set email for new customers (cannot be changed)
    client_reference_id: user.id.toString(),
    allow_promotion_codes: true,
    subscription_data: subscriptionData,
  });

  redirect(session.url!);
}
