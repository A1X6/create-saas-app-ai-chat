import Link from 'next/link';
import { GalleryVerticalEnd, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
} from '@/components/ui/field';
import type { Metadata } from 'next';
import content from '@/components/auth/error/content.json';

export const metadata: Metadata = {
  title: content.metadata.title,
  description: content.metadata.description,
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/auth/error',
  },
};

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
                <span className="sr-only">{content.appName}</span>
              </Link>
              <div className="p-3 bg-destructive/10 rounded-full mt-2">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <h1 className="text-xl font-bold">{content.header.title}</h1>
              <FieldDescription>
                {content.header.description}
              </FieldDescription>
            </div>

            {/* Description */}
            <FieldDescription className="text-center">
              {content.message}
            </FieldDescription>

            {/* Back Button */}
            <Field>
              <Button asChild className="w-full">
                <Link href="/auth/sign-in">{content.button}</Link>
              </Button>
            </Field>
          </FieldGroup>
        </div>
      </div>
    </div>
  );
}
