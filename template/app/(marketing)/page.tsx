import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

// Static Site Generation for optimal performance and SEO
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Build something amazing with our production-ready SaaS starter template. Authentication, payments, AI chat, and database - all set up and ready to go.',
  openGraph: {
    title: 'SaaS Complete - Build Your SaaS Faster',
    description: 'Production-ready SaaS starter with authentication, payments, AI chat, and more. Start building today.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaaS Complete - Build Your SaaS Faster',
    description: 'Production-ready SaaS starter with authentication, payments, AI chat, and more',
  },
};

export default function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SaaS Complete',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Production-ready personal SaaS starter with Supabase Auth, Drizzle ORM, Stripe subscriptions, and activity logging. Build your SaaS faster.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@saascomplete.com',
    },
    sameAs: [
      'https://twitter.com/saascomplete',
      'https://github.com/saascomplete',
    ],
  };

  // WebApplication Schema
  const webApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'SaaS Complete',
    url: baseUrl,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '8.00',
      highPrice: '80.00',
      offerCount: '3',
    },
    description: 'Production-ready SaaS starter template with authentication, payments, AI chat, and database integration.',
    screenshot: `${baseUrl}/screenshot.png`,
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />

      <div className="min-h-screen flex flex-col items-center justify-center p-8 pt-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Welcome to Your SaaS
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Build something amazing with our production-ready SaaS starter template.
            Authentication, payments, and database - all set up and ready to go.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/auth/sign-up">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/auth/sign-in">
              Sign In
            </Link>
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 pt-12">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold">Secure Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Powered by Supabase with PKCE flow
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="font-semibold">Stripe Payments</h3>
            <p className="text-sm text-muted-foreground">
              Subscriptions and billing ready
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <h3 className="font-semibold">Database Ready</h3>
            <p className="text-sm text-muted-foreground">
              PostgreSQL with Drizzle ORM
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="pt-12 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          {' · '}
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
        </div>
        </div>
      </div>
    </>
  );
}
