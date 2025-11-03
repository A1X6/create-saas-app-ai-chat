'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { signInAction } from '@/lib/actions/auth-actions';
import { toast } from 'sonner';
import content from './content.json';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [state, formAction, isPending] = useActionState(signInAction, null);
  const searchParams = useSearchParams();
  const toastShown = useRef(false);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'check-email' && !toastShown.current) {
      toast.success(content.messages.verificationEmailSent);
      toastShown.current = true;
    }
  }, [searchParams]);

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form action={formAction}>
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
              {content.header.signUpPrompt}{' '}
              <Link href="/auth/sign-up" className="underline underline-offset-4">
                {content.header.signUpLinkText}
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
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">{content.form.passwordLabel}</FieldLabel>
              <Link
                href="/auth/forgot-password"
                className="text-sm underline underline-offset-4"
              >
                {content.form.forgotPasswordText}
              </Link>
            </div>
            <Input id="password" name="password" type="password" required />
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
