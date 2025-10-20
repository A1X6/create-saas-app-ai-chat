import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { SetupProgress } from '@/components/ui/setup-progress';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Setup Wizard',
  description: 'Configure your SaaS application with the step-by-step setup wizard',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only allow in development mode
  if (process.env.NODE_ENV !== 'development') {
    redirect('/404');
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">
            Setup Wizard
          </h1>
          <p className="text-muted-foreground">
            Configure your SaaS application step by step
          </p>
        </div>

        {/* Progress Steps */}
        <SetupProgress />

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            {children}
          </Card>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            This setup wizard is only accessible in development mode (NODE_ENV=development)
          </p>
        </div>
      </div>
    </div>
  );
}
