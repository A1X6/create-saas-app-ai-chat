'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { logActivity } from '@/lib/db/queries';
import { ActivityType } from '@/lib/db/schema';

/**
 * Sign In Actions
 *
 * Handles user sign in and sign out operations
 */

type ActionState = {
  error?: string;
} | null;

/**
 * Sign in user with email and password
 */
export async function signInAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await logActivity(user.id, ActivityType.SIGN_IN);
  }

  redirect('/dashboard');
}

/**
 * Sign out current user
 */
export async function signOutAction() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await logActivity(user.id, ActivityType.SIGN_OUT);
  }

  await supabase.auth.signOut();
  redirect('/auth/sign-in');
}
