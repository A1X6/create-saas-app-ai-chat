'use server';

import { createClient } from '@/lib/supabase/server';
import { updateUserProfile, logActivity } from '@/lib/db/queries';
import { ActivityType } from '@/lib/db/schema';
import messages from '../messages.json';

/**
 * Profile Management Actions
 *
 * Handles user profile updates
 */

type ProfileState = {
  error?: string;
  success?: string;
} | null;

/**
 * Update user profile information (name, etc.)
 */
export async function updateProfileAction(
  prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const name = formData.get('name') as string;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: messages.auth.profile.update.errors.notAuthenticated };
  }

  // Update user profile in database
  await updateUserProfile(user.id, { name });
  await logActivity(user.id, ActivityType.UPDATE_ACCOUNT);

  return { success: messages.auth.profile.update.success };
}
