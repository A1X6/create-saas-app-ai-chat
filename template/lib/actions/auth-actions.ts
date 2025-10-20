/**
 * Authentication Actions - Main Export File
 *
 * This file re-exports all authentication actions for backward compatibility
 * and convenient importing throughout the application.
 *
 * Module Organization:
 * - sign-in.actions.ts: Sign in and sign out
 * - sign-up.actions.ts: User registration
 * - password.actions.ts: Password management (reset, update, change)
 * - profile.actions.ts: Profile updates
 *
 * Usage:
 *   import { signInAction, signUpAction, changePasswordAction } from '@/lib/actions/auth-actions';
 */

// Sign in/out actions
export { signInAction, signOutAction } from './auth/sign-in.actions';

// Sign up actions
export { signUpAction } from './auth/sign-up.actions';

// Password management actions
export {
  forgotPasswordAction,
  updatePasswordAction,
  changePasswordAction,
} from './auth/password.actions';

// Profile management actions
export { updateProfileAction } from './auth/profile.actions';
