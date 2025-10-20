import { SignupForm } from '@/components/signup-form';
import type { Metadata } from 'next';

// Static Site Generation - Auth pages can be pre-rendered
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your account and start building with our SaaS platform. Get started in minutes.',
  robots: {
    index: false,
    follow: true,
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
