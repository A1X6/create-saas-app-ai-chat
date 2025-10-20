import { redirect } from "next/navigation";
import { stripe } from "./stripe-client";
import { getUser } from "@/lib/db/queries";

/**
 * Customer Portal Management
 *
 * Handles Stripe customer portal for subscription management including:
 * - Dynamic product/price configuration
 * - Subscription updates and cancellations
 * - Payment method management
 */

/**
 * Create Stripe customer portal session
 *
 * Features:
 * - Dynamically loads all active products and prices
 * - Allows subscription upgrades/downgrades
 * - Enables subscription cancellation
 * - Payment method updates
 */
export async function createCustomerPortalSession() {
  const user = await getUser();

  if (!user || !user.stripeCustomerId) {
    redirect("/pricing");
  }

  // Fetch all active products and prices to display in portal
  const [products, prices] = await Promise.all([
    stripe.products.list({ active: true, limit: 100 }),
    stripe.prices.list({ active: true, type: "recurring", limit: 100 }),
  ]);

  // Create a map of product IDs to product names for easy lookup
  const productMap = new Map(
    products.data.map((product) => [product.id, product.name])
  );

  // Filter and map prices to the format expected by Stripe billing portal
  const productPricesMap = new Map<string, string[]>();

  prices.data
    .filter((price) => {
      // Only include prices for products that exist and are active
      const productId =
        typeof price.product === "string" ? price.product : price.product?.id;
      return productId && productMap.has(productId);
    })
    .forEach((price) => {
      const productId =
        typeof price.product === "string" ? price.product : price.product?.id;

      if (productId) {
        if (!productPricesMap.has(productId)) {
          productPricesMap.set(productId, []);
        }
        productPricesMap.get(productId)!.push(price.id);
      }
    });

  // Convert map to array format expected by Stripe
  const productPrices = Array.from(productPricesMap.entries()).map(
    ([productId, priceIds]) => ({
      product: productId,
      prices: priceIds,
    })
  );

  console.log(`Available upgrades: ${productPrices.length} products`);

  const configurations = await stripe.billingPortal.configurations.list();

  const existingConfig = configurations.data[0];

  const configuration = await stripe.billingPortal.configurations.update(
    existingConfig.id,
    {
      features: {
        subscription_update: {
          enabled: true,
          default_allowed_updates: ["price", "promotion_code"],
          proration_behavior: "always_invoice", // Charge immediately for upgrades
          products: productPrices,
        },
        subscription_cancel: {
          enabled: true,
          mode: "at_period_end",
          cancellation_reason: {
            enabled: true,
            options: [
              "too_expensive",
              "missing_features",
              "switched_service",
              "unused",
              "other",
            ],
          },
        },
        payment_method_update: {
          enabled: true,
        },
      },
    }
  );
  return stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    configuration: configuration.id,
  });
}
