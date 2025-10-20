'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, MessageSquare } from 'lucide-react';

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Chat error:', error);
  }, [error]);

  return (
    <div className="h-full p-4 lg:p-8 flex items-center justify-center">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Chat Error</CardTitle>
          </div>
          <CardDescription>
            Failed to load the AI chat interface
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription className="mt-2 text-sm">
              {error.message || 'An unexpected error occurred while loading the chat'}
            </AlertDescription>
            {error.digest && (
              <AlertDescription className="mt-1 text-xs opacity-70">
                Error ID: {error.digest}
              </AlertDescription>
            )}
          </Alert>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Common solutions:</p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Check your internet connection</li>
              <li>Clear your browser cache</li>
              <li>Try refreshing the page</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={reset} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <a href="/dashboard/chat">
                <MessageSquare className="mr-2 h-4 w-4" />
                New Chat
              </a>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            If the problem continues, contact support with the error ID above
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
