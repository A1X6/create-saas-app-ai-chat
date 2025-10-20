'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { logActivity } from '@/lib/db/queries';
import { ActivityType } from '@/lib/db/schema';

/**
 * Password Management Actions
 *
 * Handles password reset, update, and change operations
 */

type ForgotPasswordState = {
  error?: string;
  success?: string;
} | null;

type PasswordState = {
  error?: string;
  success?: string;
} | null;

/**
 * Send password reset email
 */
export async function forgotPasswordAction(
  prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = formData.get('email') as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback?next=/auth/update-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: 'Password reset email sent. Please check your inbox.' };
}

/**
 * Update password (used after password reset)
 */
export async function updatePasswordAction(
  prevState: PasswordState,
  formData: FormData
): Promise<PasswordState> {
  const password = formData.get('password') as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await logActivity(user.id, ActivityType.UPDATE_PASSWORD);
  }

  redirect('/dashboard');
}

/**
 * Change password (requires current password verification)
 */
export async function changePasswordAction(
  prevState: PasswordState,
  formData: FormData
): Promise<PasswordState> {
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'All fields are required' };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'New passwords do not match' };
  }

  if (newPassword.length < 8) {
    return { error: 'Password must be at least 8 characters' };
  }

  const supabase = await createClient();

  // Verify current password by trying to sign in
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: 'Not authenticated' };
  }

  // Verify current password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    return { error: 'Current password is incorrect' };
  }

  // Update to new password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { error: updateError.message };
  }

  await logActivity(user.id, ActivityType.UPDATE_PASSWORD);

  return { success: 'Password updated successfully!' };
}
