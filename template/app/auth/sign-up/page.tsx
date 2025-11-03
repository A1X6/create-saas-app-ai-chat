import { SignupForm } from '@/components/auth/sign-up/signup-form';
import type { Metadata } from 'next';

// Static Site Generation - Auth pages can be pre-rendered
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Sign Up - {{APP_NAME}}',
  description: 'Create your {{APP_NAME}} account and get instant access to 15+ AI models. Start with 1M free tokens per month. No credit card required.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/auth/sign-up',
  },
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}
