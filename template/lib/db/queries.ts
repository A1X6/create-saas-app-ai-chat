/**
 * Database Queries - Centralized Export
 *
 * This file re-exports all database queries from their respective modules
 * for convenient importing throughout the application.
 *
 * Usage:
 *   import { getUser, logActivity, createConversation } from '@/lib/db/queries';
 *
 * Module Organization:
 * - user.queries.ts: User profile operations
 * - subscription.queries.ts: Subscription management
 * - credits.queries.ts: AI credits operations
 * - activity.queries.ts: Activity logging
 * - chat.queries.ts: Chat conversations & messages
 */

// User queries
export {
  getUser,
  getOrCreateUserProfile,
  getUserByStripeCustomerId,
  updateUserProfile,
} from './queries/user.queries';

// Subscription queries
export {
  updateUserSubscription,
  updateUserStripeCustomerId,
} from './queries/subscription.queries';

// Credits queries
export {
  deductAICredits,
  setAICredits,
  resetAICredits,
  deductFreeTokens,
  resetFreeTokens,
} from './queries/credits.queries';

// Activity queries
export {
  logActivity,
  getActivityLogs,
} from './queries/activity.queries';

// Chat queries
export {
  createConversation,
  getUserConversations,
  getConversationWithMessages,
  saveMessage,
  updateConversationTitle,
  deleteConversation,
} from './queries/chat.queries';

// Analytics queries
export {
  getWeeklyTokenUsage,
  getMonthlyCreditsUsage,
} from './queries/analytics.queries';

// Token usage queries
export {
  logTokenUsage,
  getTotalTokensUsed,
} from './queries/token-usage.queries';
