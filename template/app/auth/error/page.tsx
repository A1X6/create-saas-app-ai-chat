import Link from 'next/link';
import { GalleryVerticalEnd, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
} from '@/components/ui/field';

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn('flex flex-col gap-6')}>
          <FieldGroup>
            {/* Header */}
            <div className="flex flex-col items-center gap-2 text-center">
              <Link href="/" className="flex flex-col items-center gap-2 font-medium">
                <div className="flex size-8 items-center justify-center rounded-md">
                  <GalleryVerticalEnd className="size-6" />
                </div>
                <span className="sr-only">SaaS App</span>
              </Link>
              <div className="p-3 bg-destructive/10 rounded-full mt-2">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <h1 className="text-xl font-bold">Authentication Error</h1>
              <FieldDescription>
                There was a problem with your authentication request
              </FieldDescription>
            </div>

            {/* Description */}
            <FieldDescription className="text-center">
              Please try signing in again or contact support if the problem persists.
            </FieldDescription>

            {/* Back Button */}
            <Field>
              <Button asChild className="w-full">
                <Link href="/auth/sign-in">Back to Sign In</Link>
              </Button>
            </Field>
          </FieldGroup>
        </div>
      </div>
    </div>
  );
}
