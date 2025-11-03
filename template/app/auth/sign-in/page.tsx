import { LoginForm } from '@/components/auth/sign-in/login-form';
import type { Metadata } from 'next';

// Static Site Generation - Auth pages can be pre-rendered
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Sign In - {{APP_NAME}}',
  description: 'Sign in to your {{APP_NAME}} account to access your dashboard, manage conversations, and chat with 15+ AI models.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/auth/sign-in',
  },
};

export default function SignInPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
