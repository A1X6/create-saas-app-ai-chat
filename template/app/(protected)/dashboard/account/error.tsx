'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, User } from 'lucide-react';

export default function AccountError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Account error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[600px] p-4 md:p-6 lg:p-8">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Account Error</CardTitle>
          </div>
          <CardDescription>
            Unable to load your account settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription className="mt-2 text-sm">
              {error.message || 'An unexpected error occurred while loading your account'}
            </AlertDescription>
            {error.digest && (
              <AlertDescription className="mt-1 text-xs opacity-70">
                Error ID: {error.digest}
              </AlertDescription>
            )}
          </Alert>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={reset} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <a href="/dashboard">
                <User className="mr-2 h-4 w-4" />
                Back to Dashboard
              </a>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Your account data is safe. This is just a temporary loading issue.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
