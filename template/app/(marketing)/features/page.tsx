import type { Metadata } from "next";
import { HeroSection } from "./hero-section";
import { FeatureGrid } from "./feature-grid";
import { DetailedFeatures } from "./detailed-features";
import { FAQSection } from "./faq-section";
import { CTASection } from "./cta-section";
import { ParticlesBackground } from "./particles-background";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Features - {{APP_NAME}}",
  description:
    "Access 15+ premium AI models through a unified interface. Track usage with advanced analytics, manage conversations, and optimize your AI workflow with comprehensive features.",
  keywords: [
    "AI features",
    "multi-model chat",
    "AI analytics",
    "token tracking",
    "conversation management",
    "ChatGPT features",
    "Claude features",
    "AI credits tracking",
    "AI usage analytics",
    "conversation sharing",
  ],
  openGraph: {
    title: "Features - Multi-Model AI Chat Platform",
    description:
      "Access 15+ premium AI models, track usage with analytics, manage conversations, and optimize your AI workflow.",
    type: "website",
    url: "/features",
    images: [
      {
        url: "/og-features.png",
        width: 1200,
        height: 630,
        alt: "{{APP_NAME}} Features",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Features - Multi-Model AI Chat Platform",
    description:
      "Access 15+ premium AI models, track usage with analytics, and manage conversations efficiently.",
    images: ["/og-features.png"],
  },
  alternates: {
    canonical: "/features",
  },
};

// FAQ data for JSON-LD
const faqs = [
  {
    question: "What AI models does {{APP_NAME}} support?",
    answer:
      "We support 15+ premium AI models including Claude (multiple versions), GPT-4, Gemini, Llama, DeepSeek, and many others through OpenRouter. All models are available to paid subscribers, with costs deducted from your monthly credit allocation based on actual usage.",
  },
  {
    question: "How does the pricing work?",
    answer:
      "All subscription plans include AI credits in USD that cover actual AI model costs from OpenRouter. Credits are deducted based on your usage and you can monitor your balance in real-time. All plans start with a free trial period to test the platform.",
  },
  {
    question: "What is included in the free trial?",
    answer:
      "All subscription plans include a free trial period. Monthly plans get 7 days, and yearly plans get 14 days. During your trial, you receive $1 in credits to test the platform and explore all features. You can upgrade anytime to unlock your full plan credits.",
  },
  {
    question: "Is my data secure and private?",
    answer:
      "Absolutely. All your conversations are encrypted in transit and at rest using industry-standard encryption. We never share your data with third parties, and you maintain full control over your conversation history. You can delete your data anytime.",
  },
  {
    question: "Can I use the platform for my team?",
    answer:
      "Yes! Each user needs their own account with a subscription. All users get access to the same features including conversation management, usage analytics, and artifact viewing. This ensures everyone has their own isolated workspace and usage tracking.",
  },
  {
    question: "What kind of support do you provide?",
    answer:
      "We provide email support for all paid subscribers. Response times depend on your subscription tier. You can also access comprehensive documentation, FAQs, and guides in our help center. Enterprise plans include dedicated support with custom SLAs.",
  },
];

export default function FeaturesPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";

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
      {
        "@type": "ListItem",
        position: 2,
        name: "Features",
        item: `${baseUrl}/features`,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="relative min-h-screen">
        <div className="relative z-10">
          {/* Sections with particles background */}
          <div className="relative overflow-hidden">
            <ParticlesBackground />
            <HeroSection />
            <FeatureGrid />
          </div>

          <DetailedFeatures />
          <FAQSection />
          <CTASection />
        </div>
      </div>
    </>
  );
}
