'use server';

import { deleteConversation, getUser } from '@/lib/db/queries';
import { revalidatePath } from 'next/cache';
import messages from './messages.json';

export async function deleteConversationAction(conversationId: string) {
  try {
    const user = await getUser();
    if (!user) {
      return {
        success: false,
        message: messages.conversation.delete.errors.notLoggedIn,
      };
    }

    await deleteConversation(conversationId, user.id);

    // Revalidate the dashboard layout to update the sidebar
    revalidatePath('/dashboard');

    return {
      success: true,
      message: messages.conversation.delete.success,
    };
  } catch (error) {
    console.error('Delete conversation error:', error);
    return {
      success: false,
      message: messages.conversation.delete.errors.failed,
    };
  }
}
