import { PlasmaBackground } from "@/components/PlasmaBackground";
import Link from "next/link";
import type { Metadata } from "next";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { TextAnimate } from "@/components/magicui/text-animate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Meteors } from "@/components/ui/meteors";
import {
  ArrowRight,
  Sparkles,
  Zap,
  ChevronDown,
  FileText,
  Lightbulb,
  BarChart3,
  Layers,
  BookmarkPlus,
  Brain,
} from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";
import { HeroSection } from "@/components/HeroSection";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import content from './content.json';

// Static Site Generation for optimal performance and SEO
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: content.metadata.title,
  description: content.metadata.description,
  keywords: content.metadata.keywords,
  openGraph: {
    title: content.metadata.ogTitle,
    description: content.metadata.ogDescription,
    type: "website",
    url: "/",
    images: [
      {
        url: content.metadata.ogImage,
        width: 1200,
        height: 630,
        alt: content.metadata.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: content.metadata.twitterTitle,
    description: content.metadata.twitterDescription,
    images: [content.metadata.twitterImage],
  },
  alternates: {
    canonical: "/",
  },
};

const faqs = content.faq.items;

export default function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "{{APP_NAME}}",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      "Professional AI prompt engineering platform to optimize your AI interactions and unlock maximum value from AI models.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com",
    },
  };

  // WebApplication Schema
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "{{APP_NAME}}",
    url: baseUrl,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "AI prompt engineering platform with expert frameworks, templates, and optimization tools.",
    screenshot: `${baseUrl}/screenshot.png`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Plasma Background - covers entire page */}
      <PlasmaBackground />

      {/* Content - positioned above background */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="flex justify-center">
              <Badge
                variant="outline"
                className="px-4 py-2 bg-background/60 backdrop-blur-sm border-primary/20"
              >
                <Sparkles className="w-4 h-4 mr-2 text-primary" />
                <span className="font-medium">
                  AI Prompt Engineering Made Simple
                </span>
              </Badge>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                <TextAnimate
                  animation="blurInUp"
                  by="word"
                  className="text-foreground"
                >
                  Craft Perfect Prompts
                </TextAnimate>
              </h1>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                <AnimatedGradientText
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold"
                  speed={0.8}
                >
                  Get Better AI Results
                </AnimatedGradientText>
              </h2>
            </div>

            {/* Description */}
            <HeroSection />

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/auth/sign-up">
                <ShimmerButton className="px-8 py-6 text-lg font-semibold">
                  <span className="flex items-center gap-2">
                    Try it Free
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </ShimmerButton>
              </Link>
              <Link href="/dashboard/chat">
                <button className="px-8 py-6 text-lg font-semibold rounded-full bg-background/60 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                  Start Chatting
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-3xl mx-auto">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary flex items-baseline justify-center gap-1">
                  <NumberTicker value={15} />
                  <span className="text-2xl">+</span>
                </div>
                <p className="text-sm text-muted-foreground">AI Models</p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary flex items-baseline justify-center gap-1">
                  <NumberTicker value={100} />
                  <span className="text-2xl">%</span>
                </div>
                <p className="text-sm text-muted-foreground">Uptime SLA</p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary flex items-baseline justify-center gap-1">
                  <NumberTicker value={24} />
                  <span className="text-2xl">/7</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Support Available
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with MagicBento */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <Badge
                variant="outline"
                className="px-4 py-2 bg-background/60 backdrop-blur-sm border-primary/20"
              >
                <Zap className="w-4 h-4 mr-2 text-primary" />
                Features
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bold">
                <TextAnimate
                  animation="blurInUp"
                  by="word"
                  className="text-foreground"
                >
                  Everything You Need to Master AI Prompts
                </TextAnimate>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Powerful tools and frameworks designed to help you craft perfect
                prompts every time
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              <SpotlightCard>
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Layers className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-primary font-semibold text-sm uppercase tracking-wide">
                      Models
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground mb-3">
                    Multi-Model Chat
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4 flex-grow">
                    Access 15+ premium AI models from a single interface. Switch
                    between GPT-4, Claude, Gemini, and more to find the perfect
                    model for your needs.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>15+ premium AI models</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Easy model switching</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Real-time responses</span>
                    </li>
                  </ul>
                </div>
              </SpotlightCard>

              <SpotlightCard>
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-primary font-semibold text-sm uppercase tracking-wide">
                      Organize
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground mb-3">
                    Conversation Management
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4 flex-grow">
                    Keep your AI conversations organized and easily accessible.
                    Manage unlimited chat sessions with automatic saving and
                    comprehensive history tracking.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Automatic conversation saving</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Unlimited conversation history</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Rename and organize chats</span>
                    </li>
                  </ul>
                </div>
              </SpotlightCard>

              <SpotlightCard>
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-primary font-semibold text-sm uppercase tracking-wide">
                      Analytics
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground mb-3">
                    Usage Analytics
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4 flex-grow">
                    Track your AI credits, token usage, and spending with
                    comprehensive analytics. Monitor your usage patterns and
                    optimize your AI costs.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Real-time credit tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Token usage monitoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Detailed analytics dashboard</span>
                    </li>
                  </ul>
                </div>
              </SpotlightCard>

              <SpotlightCard>
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-primary font-semibold text-sm uppercase tracking-wide">
                      Coding
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground mb-3">
                    Code Highlighting
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4 flex-grow">
                    Get syntax-highlighted code blocks in your AI responses.
                    Perfect for developers working with AI on coding tasks and
                    technical queries.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Multi-language support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Auto-detected syntax</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Easy copy-paste</span>
                    </li>
                  </ul>
                </div>
              </SpotlightCard>

              <SpotlightCard>
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <BookmarkPlus className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-primary font-semibold text-sm uppercase tracking-wide">
                      Productivity
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground mb-3">
                    Artifact View
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4 flex-grow">
                    AI-generated content displays in a beautiful split-view
                    interface. Desktop shows side-by-side layout, mobile uses an
                    overlay for optimal viewing.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Split-view on desktop</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Responsive overlay on mobile</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Customizable detection patterns</span>
                    </li>
                  </ul>
                </div>
              </SpotlightCard>

              <SpotlightCard>
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Brain className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-primary font-semibold text-sm uppercase tracking-wide">
                      Testing
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground mb-3">
                    Test Prompt Sandbox
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4 flex-grow">
                    Test your prompts in an isolated environment with vanilla AI
                    behavior. Perfect for iterating and refining prompts before
                    using them in production.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Isolated testing environment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>No conversation saving</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Quick iteration cycles</span>
                    </li>
                  </ul>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold">
                <TextAnimate
                  animation="blurInUp"
                  by="word"
                  className="text-foreground"
                >
                  Frequently Asked Questions
                </TextAnimate>
              </h2>
              <p className="text-xl text-muted-foreground">
                {'Everything you need to know about {{APP_NAME}}'}
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Collapsible key={index} className="group">
                  <div className="bg-card/60 backdrop-blur-sm border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-colors">
                    <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-accent/10 transition-colors">
                      <span className="font-semibold text-lg">
                        {faq.question}
                      </span>
                      <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-6 pb-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
              {/* Meteors Effect */}
              <Meteors number={20} />

              {/* Content */}
              <div className="relative z-10 px-8 sm:px-12 py-16 sm:py-20 text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <Sparkles className="h-4 w-4" />
                    Start Your Journey
                  </div>

                  {/* Heading */}
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                    Ready to Transform Your
                    <br />
                    <span className="text-primary">AI Workflow?</span>
                  </h2>

                  {/* Description */}
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Join thousands of professionals who are already mastering AI
                    prompt engineering with {'{{APP_NAME}}'}.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <Button size="lg" asChild className="w-full sm:w-auto">
                      <Link
                        href="/auth/sign-up"
                        className="flex items-center gap-2"
                      >
                        Start Free Trial
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      asChild
                      className="w-full sm:w-auto"
                    >
                      <Link href="/contact">Contact Sales</Link>
                    </Button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      ✓ Free trial included
                    </div>
                    <div className="flex items-center gap-2">
                      ✓ Transparent pricing
                    </div>
                    <div className="flex items-center gap-2">
                      ✓ Cancel anytime
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
