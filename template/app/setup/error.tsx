'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, Settings } from 'lucide-react';

export default function SetupError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Setup error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 flex items-center justify-center">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Setup Error</CardTitle>
          </div>
          <CardDescription>
            An error occurred during the setup process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription className="mt-2 text-sm">
              {error.message || 'An unexpected error occurred during setup'}
            </AlertDescription>
            {error.digest && (
              <AlertDescription className="mt-1 text-xs opacity-70">
                Error ID: {error.digest}
              </AlertDescription>
            )}
          </Alert>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Troubleshooting steps:</p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Verify all environment variables are set correctly</li>
              <li>Check your database connection</li>
              <li>Ensure Stripe keys are valid</li>
              <li>Review the browser console for details</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={reset} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <a href="/setup">
                <Settings className="mr-2 h-4 w-4" />
                Restart Setup
              </a>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Need help? Check the setup documentation or contact support
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
