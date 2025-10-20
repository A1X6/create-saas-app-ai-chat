import { eq, desc } from 'drizzle-orm';
import { cache } from 'react';
import { db } from '../index';
import {
  chatConversations,
  chatMessages,
  type NewChatConversation,
  type NewChatMessage,
} from '../schema';
import { getUser } from './user.queries';

/**
 * Chat Queries
 *
 * Handles all chat-related database operations including:
 * - Creating conversations
 * - Saving messages
 * - Retrieving conversation history
 * - Managing conversation metadata
 */

/**
 * Create new chat conversation
 * Returns the conversation ID
 */
export async function createConversation(userId: string, title?: string): Promise<string> {
  const newConversation: NewChatConversation = {
    userId,
    title: title || 'New Conversation',
  };

  const [conversation] = await db
    .insert(chatConversations)
    .values(newConversation)
    .returning();

  return conversation.id;
}

/**
 * Get all conversations for current user
 * Ordered by most recently updated first
 */
export const getUserConversations = cache(async () => {
  const user = await getUser();
  if (!user) return [];

  const conversations = await db
    .select()
    .from(chatConversations)
    .where(eq(chatConversations.userId, user.id))
    .orderBy(desc(chatConversations.updatedAt));

  return conversations;
});

/**
 * Get conversation with all its messages
 * Returns null if conversation doesn't exist or doesn't belong to user
 */
export const getConversationWithMessages = cache(async (conversationId: string) => {
  const user = await getUser();
  if (!user) return null;

  // Get conversation
  const [conversation] = await db
    .select()
    .from(chatConversations)
    .where(eq(chatConversations.id, conversationId))
    .limit(1);

  if (!conversation || conversation.userId !== user.id) {
    return null;
  }

  // Get messages
  const messages = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.conversationId, conversationId))
    .orderBy(chatMessages.createdAt);

  return {
    conversation,
    messages,
  };
});

/**
 * Save message to conversation
 * Automatically updates conversation's updatedAt timestamp
 *
 * Note: Token usage is now tracked separately in token_usage_logs table
 * The tokensUsed and costInDollars parameters are kept for backward compatibility
 * but are no longer the primary source of truth for analytics
 */
export async function saveMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
  model?: string,
  tokensUsed?: number,
  costInDollars?: number
) {
  const newMessage: NewChatMessage = {
    conversationId,
    role,
    content,
    model: model || null,
    tokensUsed: tokensUsed || 0,
    costInDollars: costInDollars ? costInDollars.toFixed(4) : '0.0000',
  };

  await db.insert(chatMessages).values(newMessage);

  // Update conversation's updatedAt timestamp
  await db
    .update(chatConversations)
    .set({ updatedAt: new Date() })
    .where(eq(chatConversations.id, conversationId));
}

/**
 * Update conversation title
 */
export async function updateConversationTitle(conversationId: string, title: string) {
  await db
    .update(chatConversations)
    .set({ title, updatedAt: new Date() })
    .where(eq(chatConversations.id, conversationId));
}

/**
 * Delete conversation and all its messages
 * Verifies ownership before deletion
 */
export async function deleteConversation(conversationId: string, userId: string) {
  // Verify ownership
  const [conversation] = await db
    .select()
    .from(chatConversations)
    .where(eq(chatConversations.id, conversationId))
    .limit(1);

  if (!conversation || conversation.userId !== userId) {
    throw new Error('Unauthorized or conversation not found');
  }

  // Delete messages first
  await db.delete(chatMessages).where(eq(chatMessages.conversationId, conversationId));

  // Delete conversation
  await db.delete(chatConversations).where(eq(chatConversations.id, conversationId));
}
