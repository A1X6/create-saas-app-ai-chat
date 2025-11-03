'use server';

import { exec } from 'child_process';
import { promisify } from 'util';
import Stripe from 'stripe';
import messages from './messages.json';

const execAsync = promisify(exec);

// Initialize Stripe
const getStripe = () => {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(stripeKey);
};

type StripeProduct = {
  id: string;
  name: string;
  description?: string | null;
  active: boolean;
  metadata?: Record<string, string | null>;
};

// List current products in Stripe
export async function listStripeProducts(): Promise<{
  success: boolean;
  products: StripeProduct[];
  message: string;
}> {
  try {
    const stripe = getStripe();
    const products = await stripe.products.list({ limit: 100, expand: ['data.default_price'] });

    return {
      success: true,
      products: products.data,
      message: messages.stripe.products.list.success.replace('{{count}}', products.data.length.toString()),
    };
  } catch (error) {
    return {
      success: false,
      products: [],
      message: error instanceof Error ? error.message : 'Failed to list products',
    };
  }
}

// Sync products to Stripe using CLI command
export async function syncStripeProducts(dryRun: boolean = false): Promise<{
  success: boolean;
  message: string;
  output?: string;
}> {
  try {
    // Check if STRIPE_SECRET_KEY is set
    if (!process.env.STRIPE_SECRET_KEY) {
      return {
        success: false,
        message: messages.stripe.sync.errors.noSecretKey,
      };
    }

    // Run stripe:sync command
    const command = dryRun ? 'pnpm stripe:sync:dry' : 'pnpm stripe:sync';
    const { stdout, stderr } = await execAsync(command, {
      cwd: process.cwd(),
      env: process.env,
    });

    const output = stdout + stderr;

    // Check if sync was successful
    if (stderr && stderr.toLowerCase().includes('error') && !stderr.includes('[dry run]')) {
      return {
        success: false,
        message: messages.stripe.sync.errors.failed,
        output,
      };
    }

    return {
      success: true,
      message: dryRun ? messages.stripe.sync.dryRun : messages.stripe.sync.success,
      output,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : messages.stripe.sync.errors.failed,
      output: error instanceof Error ? error.message : undefined,
    };
  }
}

// Verify Stripe connection
export async function verifyStripeConnection(): Promise<{
  success: boolean;
  message: string;
  account?: { id?: string; name?: string | null; email?: string | null; country?: string | null; type?: string };
}> {
  try {
    const stripe = getStripe();
    const account = await stripe.accounts.retrieve();

    return {
      success: true,
      message: messages.stripe.connection.success,
      account: {
        id: account.id,
        email: account.email,
        country: account.country,
        type: account.type,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to verify Stripe connection',
    };
  }
}

// Sync user-defined products to Stripe
export async function syncUserProducts(productsData: string): Promise<{
  success: boolean;
  message: string;
  output?: string;
}> {
  try {
    const products = JSON.parse(productsData);
    const stripe = getStripe();

    // Archive all existing active products
    const existingProducts = await stripe.products.list({ active: true, limit: 100 });
    let archived = 0;
    for (const existingProduct of existingProducts.data) {
      await stripe.products.update(existingProduct.id, { active: false });
      archived++;
    }

    let created = 0;
    let updated = 0;

    for (const productConfig of products) {
      // Create or update product
      let product;
      if (productConfig.id) {
        // Update existing product
        product = await stripe.products.update(productConfig.id, {
          name: productConfig.name,
          description: productConfig.description,
          metadata: productConfig.metadata,
          marketing_features: productConfig.features.map((feature: string) => ({ name: feature })),
        });
        updated++;
      } else {
        // Create new product
        product = await stripe.products.create({
          name: productConfig.name,
          description: productConfig.description,
          metadata: productConfig.metadata,
          marketing_features: productConfig.features.map((feature: string) => ({ name: feature })),
        });
        created++;
      }

      // Create or update prices
      for (const priceConfig of productConfig.prices) {
        await stripe.prices.create({
          product: product.id,
          nickname: priceConfig.nickname,
          unit_amount: priceConfig.unitAmount,
          currency: priceConfig.currency,
          recurring: {
            interval: priceConfig.interval,
          },
        });
      }
    }

    return {
      success: true,
      message: messages.stripe.userProducts.sync.success
        .replace('{{archived}}', archived.toString())
        .replace('{{created}}', created.toString())
        .replace('{{updated}}', updated.toString()),
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to sync products',
    };
  }
}

// Save profit margin to environment
export async function saveProfitMargin(profitMargin: number): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const { readFile, writeFile } = await import('fs/promises');
    const { join } = await import('path');

    const envPath = join(process.cwd(), '.env.local');

    // Read current .env.local content
    let envContent = '';
    try {
      envContent = await readFile(envPath, 'utf8');
    } catch {
      return {
        success: false,
        message: messages.stripe.profitMargin.save.errors.noEnvFile,
      };
    }

    // Update or add PROFIT_PER_USER_MONTHLY
    if (envContent.includes('PROFIT_PER_USER_MONTHLY=')) {
      // Replace existing value
      envContent = envContent.replace(
        /PROFIT_PER_USER_MONTHLY=.*/g,
        `PROFIT_PER_USER_MONTHLY=${profitMargin.toFixed(2)}`
      );
    } else {
      // Add new line before CRON_SECRET section
      const cronSection = '# Cron Jobs (Vercel)';
      if (envContent.includes(cronSection)) {
        envContent = envContent.replace(
          cronSection,
          `# Profit Configuration (for credit calculation)\nPROFIT_PER_USER_MONTHLY=${profitMargin.toFixed(2)}\n\n${cronSection}`
        );
      } else {
        // Add at the end
        envContent += `\n# Profit Configuration (for credit calculation)\nPROFIT_PER_USER_MONTHLY=${profitMargin.toFixed(2)}\n`;
      }
    }

    await writeFile(envPath, envContent, 'utf8');

    return {
      success: true,
      message: messages.stripe.profitMargin.save.success.replace('{{amount}}', profitMargin.toFixed(2)),
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to save profit margin',
    };
  }
}
