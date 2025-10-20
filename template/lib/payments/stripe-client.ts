import Stripe from "stripe";

/**
 * Stripe Client Configuration
 *
 * Centralized Stripe client instance used throughout the application
 */

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});
