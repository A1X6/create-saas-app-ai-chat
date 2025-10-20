import { stripe } from '@/lib/payments/stripe-client';
import { PricingClient } from './pricing-client';
import type Stripe from 'stripe';
import type { Metadata } from 'next';

// Incremental Static Regeneration - rebuild every hour
// This keeps the page fast while allowing pricing updates
export const revalidate = 3600; // 1 hour in seconds

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Choose the perfect plan for your needs. Get started with our flexible pricing options, including monthly and yearly subscriptions with AI credits.',
  openGraph: {
    title: 'Pricing Plans - SaaS Complete',
    description: 'Flexible pricing options with AI credits included. Choose monthly or yearly billing.',
    type: 'website',
  },
};

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
        name: 'SaaS Complete',
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
    description: 'Available subscription plans for SaaS Complete',
    numberOfItems: productsWithPrices.length,
    itemListElement: productsWithPrices.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: `${product.name} Plan`,
      url: `${baseUrl}/pricing`,
    })),
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

      <PricingClient products={productsWithPrices} />
    </>
  );
}
