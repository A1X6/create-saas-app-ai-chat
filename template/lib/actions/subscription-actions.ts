'use server';

import { getUser } from '@/lib/db/queries';
import { stripe } from '@/lib/payments/stripe';
import messages from './messages.json';

export interface ActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * End trial early and convert to paid subscription
 * Triggers immediate payment and activates full plan credits
 */
export async function endTrialEarlyAction(): Promise<ActionResponse> {
  try {
    // Get current user
    const user = await getUser();

    if (!user) {
      return {
        success: false,
        error: messages.subscription.endTrial.errors.notLoggedIn,
      };
    }

    // Validate user has subscription
    if (!user.stripeSubscriptionId) {
      return {
        success: false,
        error: messages.subscription.endTrial.errors.noSubscription,
      };
    }

    // Validate user is on trial
    if (user.subscriptionStatus !== 'trialing') {
      return {
        success: false,
        error: messages.subscription.endTrial.errors.notOnTrial,
      };
    }

    // End trial immediately via Stripe API
    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      trial_end: 'now', // Ends trial and triggers payment
      proration_behavior: 'always_invoice', // Charge immediately
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error('End trial early error:', error);
    return {
      success: false,
      error: messages.subscription.endTrial.errors.failed,
    };
  }
}
