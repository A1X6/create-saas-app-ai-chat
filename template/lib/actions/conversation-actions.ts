'use server';

import { deleteConversation, getUser } from '@/lib/db/queries';
import { revalidatePath } from 'next/cache';

export async function deleteConversationAction(conversationId: string) {
  try {
    const user = await getUser();
    if (!user) {
      return {
        success: false,
        message: 'You must be logged in to delete conversations',
      };
    }

    await deleteConversation(conversationId, user.id);

    // Revalidate the dashboard layout to update the sidebar
    revalidatePath('/dashboard');

    return {
      success: true,
      message: 'Conversation deleted successfully',
    };
  } catch (error) {
    console.error('Delete conversation error:', error);
    return {
      success: false,
      message: 'Failed to delete conversation',
    };
  }
}
