import { stripe } from '@/lib/payments/stripe-client';
import { PricingHero } from '@/components/pricing/pricing-hero';
import { FeatureComparison } from '@/components/pricing/feature-comparison';
import { FAQSection } from '@/components/pricing/faq-section';
import { PricingFinalCTA } from '@/components/pricing/final-cta';
import type Stripe from 'stripe';
import type { Metadata } from 'next';

// Force dynamic rendering to avoid Stripe API calls during build time
// This ensures Docker builds succeed without API keys
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Pricing - {{APP_NAME}}',
  description: 'Choose the perfect plan for your AI prompt engineering needs. Flexible pricing options with AI credits included. Monthly and yearly subscriptions available. Start your free trial today.',
  keywords: [
    'prompt engineering pricing',
    'AI tools pricing',
    'ChatGPT pricing',
    'prompt consultant plans',
    'AI subscription',
    'prompt engineering cost',
    'AI credits',
    'free trial AI tools'
  ],
  openGraph: {
    title: 'Pricing Plans - {{APP_NAME}}',
    description: 'Flexible pricing options with AI credits included. Choose monthly or yearly billing. Start your free trial today.',
    type: 'website',
    url: '/pricing',
    images: [
      {
        url: '/og-pricing.png',
        width: 1200,
        height: 630,
        alt: '{{APP_NAME}} Pricing Plans',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing Plans - {{APP_NAME}}',
    description: 'Flexible pricing with AI credits. Monthly or yearly billing. Free trial available.',
    images: ['/og-pricing.png'],
  },
  alternates: {
    canonical: '/pricing',
  },
};

// FAQ data for JSON-LD
const faqs = [
  {
    question: "Can I change plans later?",
    answer: "Yes! You can upgrade or downgrade your plan at any time through the Stripe Customer Portal. When upgrading, you'll be charged the prorated difference immediately. When downgrading, the change will take effect at the end of your current billing period."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover) and other payment methods through our secure payment processor, Stripe. All transactions are encrypted and PCI-compliant for your security."
  },
  {
    question: "What is your refund policy?",
    answer: "Refunds are handled on a case-by-case basis. Please contact our support team if you're not satisfied with the service, and we'll work with you to address your concerns. We recommend using the free trial period to test the platform before committing to a paid plan."
  },
  {
    question: "What happens when I run out of credits?",
    answer: "If you run out of AI credits, you won't be able to send new messages until your credits reset on your next billing cycle. You can upgrade to a higher plan at any time to get more credits immediately. You'll receive notifications when your credits are running low."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! All subscription plans include a free trial period. Monthly plans get a 7-day trial, and yearly plans get a 14-day trial. During your trial, you receive $1 in credits to test all features. You can upgrade early to unlock your full plan credits anytime."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time with no cancellation fees through the Stripe Customer Portal. Your access will continue until the end of your current billing period, and no further charges will be made."
  },
  {
    question: "Do you offer educational or non-profit discounts?",
    answer: "We may offer discounts for educational institutions and non-profit organizations on a case-by-case basis. Contact our support team with proof of your status to inquire about available discounts for your organization."
  },
  {
    question: "What's included in support?",
    answer: "All paid subscribers receive email support. Response times may vary depending on your subscription tier. We also provide comprehensive documentation and FAQs to help you get the most out of the platform."
  },
  {
    question: "Are there any setup fees or hidden charges?",
    answer: "No. We believe in transparent pricing. The subscription price you see includes your AI credit allocation for the billing period. There are no setup fees, hidden charges, or surprise costs. All charges are clearly shown before you subscribe."
  },
  {
    question: "How do AI credits work?",
    answer: "AI credits are allocated in USD and cover the actual costs of using AI models through OpenRouter. Different models have different costs per token (input and output). You can monitor your credit balance and usage in real-time from your dashboard, with detailed breakdowns by model and conversation."
  },
];

export default async function PricingPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // Fetch all active products with their prices
  const products = await stripe.products.list({
    active: true,
    expand: ['data.default_price'],
  });

  // Fetch all active recurring prices
  const prices = await stripe.prices.list({
    expand: ['data.product'],
    active: true,
    type: 'recurring',
  });

  // Find the lowest AI credit amount to use as base
  let baseUsage = Infinity;
  products.data.forEach((product) => {
    const aiCredits = parseFloat(product.metadata.ai_credits_amount || '0');
    if (aiCredits > 0 && aiCredits < baseUsage) {
      baseUsage = aiCredits;
    }
  });

  // Group prices by product - get everything from Stripe
  const productsWithPrices = products.data.map((product) => {
    const productPrices = prices.data.filter((price) => {
      const priceProduct = price.product as Stripe.Product;
      return priceProduct.id === product.id;
    });

    // Get features from Stripe product marketing_features
    const features = product.marketing_features?.map(f => f.name).filter((name): name is string => !!name) || [];

    // Calculate usage multiplier based on AI credits
    const aiCredits = parseFloat(product.metadata.ai_credits_amount || '0');
    const usageMultiplier = baseUsage > 0 && aiCredits > 0
      ? Math.round(aiCredits / baseUsage)
      : 1;

    return {
      id: product.id,
      name: product.name,
      description: product.description || '',
      features,
      usageMultiplier,
      isRecommended: product.metadata.recommended === 'true',
      prices: productPrices.map((price) => ({
        id: price.id,
        unitAmount: price.unit_amount || 0,
        currency: price.currency,
        interval: price.recurring?.interval || 'month',
        nickname: price.nickname || '',
      })),
    };
  });

  // Generate Product Schema for each pricing plan
  const productSchemas = productsWithPrices.map((product) => {
    // Get the monthly price for the schema
    const monthlyPrice = product.prices.find(p => p.interval === 'month');
    const yearlyPrice = product.prices.find(p => p.interval === 'year');

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${product.name} Plan`,
      description: product.description,
      brand: {
        '@type': 'Brand',
        name: '{{APP_NAME}}',
      },
      offers: [
        monthlyPrice && {
          '@type': 'Offer',
          name: `${product.name} Monthly`,
          price: (monthlyPrice.unitAmount / 100).toFixed(2),
          priceCurrency: monthlyPrice.currency.toUpperCase(),
          priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          availability: 'https://schema.org/InStock',
          url: `${baseUrl}/pricing`,
          billingIncrement: {
            '@type': 'UnitPriceSpecification',
            billingDuration: 1,
            billingInterval: 'month',
          },
        },
        yearlyPrice && {
          '@type': 'Offer',
          name: `${product.name} Yearly`,
          price: (yearlyPrice.unitAmount / 100).toFixed(2),
          priceCurrency: yearlyPrice.currency.toUpperCase(),
          priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          availability: 'https://schema.org/InStock',
          url: `${baseUrl}/pricing`,
          billingIncrement: {
            '@type': 'UnitPriceSpecification',
            billingDuration: 1,
            billingInterval: 'year',
          },
        },
      ].filter(Boolean),
    };
  });

  // ItemList schema for all pricing plans
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pricing Plans',
    description: 'Available subscription plans for {{APP_NAME}}',
    numberOfItems: productsWithPrices.length,
    itemListElement: productsWithPrices.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: `${product.name} Plan`,
      url: `${baseUrl}/pricing`,
    })),
  };

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
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
        name: 'Pricing',
        item: `${baseUrl}/pricing`,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data for Products */}
      {productSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="relative min-h-screen">
        {/* Content */}
        <PricingHero products={productsWithPrices} />
        <FeatureComparison />
        <FAQSection />
        <PricingFinalCTA />
      </div>
    </>
  );
}
