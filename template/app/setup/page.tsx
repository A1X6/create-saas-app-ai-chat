import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Rocket, Settings, Database, CreditCard, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Metadata } from 'next';

// Static Site Generation - Setup welcome page can be pre-rendered
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Welcome - Setup Wizard',
  description: 'Get started with the setup wizard to configure your SaaS application',
};

export default function SetupWelcomePage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Rocket className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-3">
          Welcome to SaaS Complete Setup
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Let's configure your application in just a few steps. This wizard will help you set up
          environment variables, database connection, Stripe integration, and generate your landing page.
        </p>
      </div>

      {/* What We'll Configure */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-center">
          What We'll Configure
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-base">Environment Variables</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Configure Supabase, email services, AI integration, and other essential API keys
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-base">Database Setup</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Test database connection and push your schema to Supabase PostgreSQL
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-base">Stripe Configuration</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create products, set pricing, configure webhooks, and sync everything to Stripe
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-base">Landing Page</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Auto-generate a minimal landing page with your branding and pricing
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Prerequisites */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Before You Start</AlertTitle>
        <AlertDescription>
          <ul className="space-y-2 mt-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Have a Supabase project created with database URL and API keys</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Have a Stripe account (test mode is fine for now)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Optional: Resend API key for email, OpenRouter key for AI chat</span>
            </li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-4">
        <Button asChild variant="default" size="lg" className="gap-2">
          <Link href="/setup/environment">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
