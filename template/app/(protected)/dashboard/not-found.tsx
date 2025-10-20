import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileQuestion, LayoutDashboard, MessageSquare, User } from 'lucide-react';

export default function DashboardNotFound() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-muted">
              <FileQuestion className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <CardDescription>
            This dashboard page doesn&apos;t exist
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            The page you&apos;re looking for might have been removed or doesn&apos;t exist.
          </p>

          <div className="grid gap-3">
            <Button asChild className="w-full">
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" asChild>
                <Link href="/dashboard/chat">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  AI Chat
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/account">
                  <User className="mr-2 h-4 w-4" />
                  Account
                </Link>
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            Need help? Contact support if you think this is an error.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
