/**
 * Stripe Integration - Main Export File
 *
 * This file re-exports all Stripe-related functions for backward compatibility
 * and convenient importing throughout the application.
 *
 * Module Organization:
 * - stripe-client.ts: Stripe client configuration
 * - checkout.ts: Checkout session creation
 * - portal.ts: Customer portal management
 * - webhooks.ts: Webhook event handlers
 * - products.ts: Product and price fetching
 *
 * Usage:
 *   import { stripe, createCheckoutSession, handleSubscriptionChange } from '@/lib/payments/stripe';
 */

// Export Stripe client
export { stripe } from './stripe-client';

// Export checkout functions
export { createCheckoutSession } from './checkout';

// Export portal functions
export { createCustomerPortalSession } from './portal';

// Export webhook handlers
export {
  handleSubscriptionChange,
  handleCheckoutCompleted,
} from './webhooks';

// Export product functions
export {
  getStripePrices,
  getStripeProducts,
} from './products';
