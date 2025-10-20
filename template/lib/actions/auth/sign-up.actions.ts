'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getOrCreateUserProfile, logActivity } from '@/lib/db/queries';
import { ActivityType } from '@/lib/db/schema';

/**
 * Sign Up Actions
 *
 * Handles user registration
 */

type ActionState = {
  error?: string;
} | null;

/**
 * Register new user with email and password
 * Creates user profile and logs activity
 */
export async function signUpAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();

  // Sign up user with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: 'Failed to create user account' };
  }

  // Create user profile
  await getOrCreateUserProfile(data.user.id, email);

  // Log signup activity
  await logActivity(data.user.id, ActivityType.SIGN_UP);

  redirect('/dashboard');
}
