import { LoginForm } from '@/components/login-form';
import type { Metadata } from 'next';

// Static Site Generation - Auth pages can be pre-rendered
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account to access your dashboard and start using the platform',
  robots: {
    index: false,
    follow: true,
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
