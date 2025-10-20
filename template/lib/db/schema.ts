import { pgTable, uuid, varchar, text, timestamp, integer, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// User Profiles (extends Supabase auth.users)
export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey(), // References auth.users(id)
  name: varchar('name', { length: 100 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),

  // Stripe fields (per-user subscriptions)
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripeProductId: text('stripe_product_id'),
  planName: varchar('plan_name', { length: 50 }),
  subscriptionStatus: varchar('subscription_status', { length: 20 }),

  // AI Credits (monetary balance in USD for paid subscriptions)
  aiCreditsBalance: numeric('ai_credits_balance', { precision: 10, scale: 2 }).notNull().default('0.00'),
  aiCreditsAllocated: numeric('ai_credits_allocated', { precision: 10, scale: 2 }).notNull().default('0.00'),
  aiCreditsUsed: numeric('ai_credits_used', { precision: 10, scale: 2 }).notNull().default('0.00'),

  // Free Tier Tokens (for free models only, used by unsubscribed users)
  freeTokensUsed: integer('free_tokens_used').notNull().default(0),
  freeTokensLimit: integer('free_tokens_limit').notNull().default(1000000), // 1M tokens default for free users
});

// Activity Logs (per-user activity tracking)
export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(), // References auth.users(id)
  action: text('action').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
});

// Chat Conversations (user chat sessions)
export const chatConversations = pgTable('chat_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(), // References auth.users(id)
  title: varchar('title', { length: 255 }).notNull().default('New Conversation'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Chat Messages (individual messages in conversations)
export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull(), // References chat_conversations(id)
  role: varchar('role', { length: 20 }).notNull(), // 'user' or 'assistant'
  content: text('content').notNull(),
  model: varchar('model', { length: 100 }), // AI model used
  // LEGACY: Token tracking moved to token_usage_logs table for data persistence
  // These fields are kept for backward compatibility and display purposes only
  tokensUsed: integer('tokens_used').default(0),
  costInDollars: numeric('cost_in_dollars', { precision: 10, scale: 4 }).default('0.0000'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Token Usage Logs (permanent tracking, survives conversation deletion)
export const tokenUsageLogs = pgTable('token_usage_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(), // References auth.users(id)

  // Token counts (input + output)
  inputTokens: integer('input_tokens').notNull().default(0),
  outputTokens: integer('output_tokens').notNull().default(0),
  totalTokens: integer('total_tokens').notNull(), // Sum of input + output

  // Costs (separate rates for input/output)
  inputCost: numeric('input_cost', { precision: 10, scale: 6 }).notNull().default('0.000000'),
  outputCost: numeric('output_cost', { precision: 10, scale: 6 }).notNull().default('0.000000'),
  totalCost: numeric('total_cost', { precision: 10, scale: 6 }).notNull().default('0.000000'),

  model: varchar('model', { length: 100 }),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
});

// Relations
export const userProfilesRelations = relations(userProfiles, ({ many }) => ({
  activityLogs: many(activityLogs),
  chatConversations: many(chatConversations),
  tokenUsageLogs: many(tokenUsageLogs),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(userProfiles, {
    fields: [activityLogs.userId],
    references: [userProfiles.id],
  }),
}));

export const chatConversationsRelations = relations(chatConversations, ({ one, many }) => ({
  user: one(userProfiles, {
    fields: [chatConversations.userId],
    references: [userProfiles.id],
  }),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  conversation: one(chatConversations, {
    fields: [chatMessages.conversationId],
    references: [chatConversations.id],
  }),
}));

export const tokenUsageLogsRelations = relations(tokenUsageLogs, ({ one }) => ({
  user: one(userProfiles, {
    fields: [tokenUsageLogs.userId],
    references: [userProfiles.id],
  }),
}));

// Types
export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type ChatConversation = typeof chatConversations.$inferSelect;
export type NewChatConversation = typeof chatConversations.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;
export type TokenUsageLog = typeof tokenUsageLogs.$inferSelect;
export type NewTokenUsageLog = typeof tokenUsageLogs.$inferInsert;

// Activity Types Enum
export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  SUBSCRIPTION_CREATED = 'SUBSCRIPTION_CREATED',
  SUBSCRIPTION_UPDATED = 'SUBSCRIPTION_UPDATED',
  SUBSCRIPTION_CANCELED = 'SUBSCRIPTION_CANCELED',
}
