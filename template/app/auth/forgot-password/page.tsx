'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { GalleryVerticalEnd } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { forgotPasswordAction } from '@/lib/actions/auth-actions';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    } else if (state?.success) {
      toast.success(state.success);
    }
  }, [state]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn('flex flex-col gap-6')}>
          <form action={formAction}>
            <FieldGroup>
              {/* Header */}
              <div className="flex flex-col items-center gap-2 text-center">
                <Link href="/" className="flex flex-col items-center gap-2 font-medium">
                  <div className="flex size-8 items-center justify-center rounded-md">
                    <GalleryVerticalEnd className="size-6" />
                  </div>
                  <span className="sr-only">SaaS App</span>
                </Link>
                <h1 className="text-xl font-bold">Reset Password</h1>
                <FieldDescription>
                  Enter your email address and we&apos;ll send you a password reset link
                </FieldDescription>
              </div>

              {/* Email Field */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>

              {/* Submit Button */}
              <Field>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </Field>
            </FieldGroup>
          </form>

          {/* Back to Sign In */}
          <FieldDescription className="px-6 text-center">
            <Link href="/auth/sign-in" className="underline underline-offset-4">
              Back to sign in
            </Link>
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}
