'use client';

import { useActionState, useEffect, useState, startTransition } from 'react';
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
import { signUpAction } from '@/lib/actions/auth-actions';
import { toast } from 'sonner';
import content from './content.json';

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [state, formAction, isPending] = useActionState(signUpAction, null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate passwords match
    if (password !== confirmPassword) {
      setPasswordError(content.errors.passwordsDoNotMatch);
      toast.error(content.errors.passwordsDoNotMatch);
      return;
    }

    if (password.length < 8) {
      setPasswordError(content.errors.passwordTooShort);
      toast.error(content.errors.passwordTooShort);
      return;
    }

    setPasswordError('');

    // Create FormData and submit within a transition
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">{content.appName}</span>
            </Link>
            <h1 className="text-xl font-bold">{content.header.title}</h1>
            <FieldDescription>
              {content.header.signInPrompt}{' '}
              <Link href="/auth/sign-in" className="underline underline-offset-4">
                {content.header.signInLinkText}
              </Link>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">{content.form.emailLabel}</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={content.form.emailPlaceholder}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">{content.form.passwordLabel}</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FieldDescription>
              {content.form.passwordDescription}
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm-password">{content.form.confirmPasswordLabel}</FieldLabel>
            <Input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {passwordError && (
              <p className="text-sm text-destructive">{passwordError}</p>
            )}
          </Field>
          <Field>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? content.form.submitButton.loading : content.form.submitButton.idle}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        {content.footer.agreementText}{' '}
        <Link href="/terms" className="underline underline-offset-4">
          {content.footer.termsLinkText}
        </Link>{' '}
        {content.footer.andText}{' '}
        <Link href="/privacy" className="underline underline-offset-4">
          {content.footer.privacyLinkText}
        </Link>
        .
      </FieldDescription>
    </div>
  );
}
