import type { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { MissionVisionValues } from "@/components/about/mission-vision-values";
import { StatsSection } from "@/components/about/stats-section";
import { FinalCTA } from "@/components/about/final-cta";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "About - {{APP_NAME}}",
  description: "Learn about our mission to provide seamless access to multiple premium AI models through one unified platform. Discover how we're simplifying AI interactions with transparent pricing and powerful management tools.",
  keywords: [
    'about prompt consultant',
    'AI chat platform',
    'multi-model AI',
    'AI tools company',
    'OpenRouter platform',
    'AI innovation',
    'AI conversation management'
  ],
  openGraph: {
    title: "About {{APP_NAME}} - Our Mission & Story",
    description: "Providing seamless access to 15+ premium AI models through one unified platform. Learn about our mission to simplify AI interactions.",
    type: "website",
    url: '/about',
    images: [
      {
        url: '/og-about.png',
        width: 1200,
        height: 630,
        alt: 'About {{APP_NAME}}',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "About {{APP_NAME}} - Our Mission & Story",
    description: "Providing seamless access to 15+ premium AI models through one unified platform.",
    images: ['/og-about.png'],
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '{{APP_NAME}}',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Multi-model AI chat platform providing access to 15+ premium AI models with conversation management and usage analytics.',
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@example.com',
    },
    sameAs: [
      ...(process.env.NEXT_PUBLIC_TWITTER_URL ? [process.env.NEXT_PUBLIC_TWITTER_URL] : []),
      ...(process.env.NEXT_PUBLIC_LINKEDIN_URL ? [process.env.NEXT_PUBLIC_LINKEDIN_URL] : []),
      ...(process.env.NEXT_PUBLIC_GITHUB_URL ? [process.env.NEXT_PUBLIC_GITHUB_URL] : []),
    ].filter(Boolean),
  };

  // AboutPage Schema
  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About {{APP_NAME}}',
    description: 'Learn about our mission to provide seamless access to multiple premium AI models through one unified platform with transparent pricing and powerful management tools.',
    url: `${baseUrl}/about`,
    mainEntity: {
      '@type': 'Organization',
      name: '{{APP_NAME}}',
    },
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About',
        item: `${baseUrl}/about`,
      },
    ],
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="relative min-h-screen">
        {/* Grid Background Pattern */}
        <div className="fixed inset-0 -z-10 opacity-30" aria-hidden="true" />

        {/* Content */}
        <div className="relative z-10">
          {/* Hero Section */}
          <AboutHero />

          {/* Mission, Vision & Values */}
          <MissionVisionValues />

          {/* Stats & Achievements */}
          <StatsSection />

          {/* Final CTA */}
          <FinalCTA />
        </div>
      </div>
    </>
  );
}
