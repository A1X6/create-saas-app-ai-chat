'use server';

import { exec } from 'child_process';
import { promisify } from 'util';
import Stripe from 'stripe';

const execAsync = promisify(exec);

// Initialize Stripe
const getStripe = () => {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(stripeKey);
};

// List current products in Stripe
export async function listStripeProducts(): Promise<{
  success: boolean;
  products: any[];
  message: string;
}> {
  try {
    const stripe = getStripe();
    const products = await stripe.products.list({ limit: 100, expand: ['data.default_price'] });

    return {
      success: true,
      products: products.data,
      message: `Found ${products.data.length} products`,
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
        message: 'STRIPE_SECRET_KEY environment variable is not set. Please configure it in the environment page.',
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
        message: 'Failed to sync products',
        output,
      };
    }

    return {
      success: true,
      message: dryRun
        ? 'Dry run completed - no changes made'
        : 'Products synced successfully to Stripe',
      output,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to sync products',
      output: error instanceof Error ? error.message : undefined,
    };
  }
}

// Verify Stripe connection
export async function verifyStripeConnection(): Promise<{
  success: boolean;
  message: string;
  account?: any;
}> {
  try {
    const stripe = getStripe();
    const account = await stripe.accounts.retrieve();

    return {
      success: true,
      message: 'Stripe connection verified',
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
        });
        updated++;
      } else {
        // Create new product
        product = await stripe.products.create({
          name: productConfig.name,
          description: productConfig.description,
          metadata: productConfig.metadata,
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
      message: `Created ${created} and updated ${updated} product(s) in Stripe`,
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
    } catch (error) {
      return {
        success: false,
        message: 'Please configure environment variables first (Environment page)',
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
      message: `Profit margin set to $${profitMargin.toFixed(2)}/user/month`,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to save profit margin',
    };
  }
}
