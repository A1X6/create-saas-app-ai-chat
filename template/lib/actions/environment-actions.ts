'use server';

import { createClient } from '@supabase/supabase-js';
import { Stripe } from 'stripe';
import { Resend } from 'resend';
import { writeFile } from 'fs/promises';
import { join } from 'path';

// Environment variable validation results
type ValidationResult = {
  valid: boolean;
  message: string;
};

// Validate Supabase connection
export async function validateSupabase(
  url: string,
  anonKey: string,
  serviceKey: string
): Promise<ValidationResult> {
  try {
    if (!url || !anonKey || !serviceKey) {
      return { valid: false, message: 'All Supabase fields are required' };
    }

    // Test anon key connection
    const supabase = createClient(url, anonKey);
    const { error } = await supabase.auth.getSession();

    if (error) {
      return { valid: false, message: `Supabase connection failed: ${error.message}` };
    }

    return { valid: true, message: 'Supabase connection successful' };
  } catch (error) {
    return {
      valid: false,
      message: error instanceof Error ? error.message : 'Failed to validate Supabase'
    };
  }
}

// Validate Stripe connection
export async function validateStripe(secretKey: string): Promise<ValidationResult> {
  try {
    if (!secretKey) {
      return { valid: false, message: 'Stripe secret key is required' };
    }

    const stripe = new Stripe(secretKey);
    await stripe.products.list({ limit: 1 });

    return { valid: true, message: 'Stripe connection successful' };
  } catch (error) {
    return {
      valid: false,
      message: error instanceof Error ? error.message : 'Failed to validate Stripe'
    };
  }
}

// Validate Resend connection
export async function validateResend(apiKey: string, fromEmail: string, toEmail: string): Promise<ValidationResult> {
  try {
    if (!apiKey || !fromEmail || !toEmail) {
      return { valid: false, message: 'All Resend fields are required' };
    }

    // Resend doesn't have a simple validation endpoint, so we'll just check the key format
    if (!apiKey.startsWith('re_')) {
      return { valid: false, message: 'Invalid Resend API key format' };
    }

    // Validate email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(fromEmail)) {
      return { valid: false, message: 'Invalid from email format' };
    }
    if (!emailRegex.test(toEmail)) {
      return { valid: false, message: 'Invalid to email format' };
    }

    return { valid: true, message: 'Resend configuration is valid' };
  } catch (error) {
    return {
      valid: false,
      message: error instanceof Error ? error.message : 'Failed to validate Resend'
    };
  }
}

// Validate OpenRouter connection
export async function validateOpenRouter(apiKey: string, temperature: string): Promise<ValidationResult> {
  try {
    if (!apiKey || !temperature) {
      return { valid: false, message: 'All OpenRouter fields are required' };
    }

    // Validate temperature
    const temp = parseFloat(temperature);
    if (isNaN(temp) || temp < 0 || temp > 2) {
      return { valid: false, message: 'AI Temperature must be between 0.0 and 2.0' };
    }

    // Test OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      return { valid: false, message: 'OpenRouter API key is invalid' };
    }

    return { valid: true, message: 'OpenRouter connection successful' };
  } catch (error) {
    return {
      valid: false,
      message: error instanceof Error ? error.message : 'Failed to validate OpenRouter'
    };
  }
}

// Test all connections
export async function testAllConnections(formData: FormData): Promise<{
  supabase: ValidationResult;
  stripe: ValidationResult;
  resend: ValidationResult;
  openrouter: ValidationResult;
}> {
  const supabaseUrl = formData.get('supabase-url') as string;
  const supabaseAnonKey = formData.get('supabase-anon-key') as string;
  const supabaseServiceKey = formData.get('supabase-service-key') as string;
  const stripeSecretKey = formData.get('stripe-secret-key') as string;
  const resendApiKey = formData.get('resend-api-key') as string;
  const resendFromEmail = formData.get('resend-from') as string;
  const resendToEmail = formData.get('resend-to') as string;
  const openrouterApiKey = formData.get('openrouter-api-key') as string;
  const aiTemperature = formData.get('ai-temperature') as string;

  const [supabase, stripe, resend, openrouter] = await Promise.all([
    validateSupabase(supabaseUrl, supabaseAnonKey, supabaseServiceKey),
    validateStripe(stripeSecretKey),
    validateResend(resendApiKey, resendFromEmail, resendToEmail),
    validateOpenRouter(openrouterApiKey, aiTemperature),
  ]);

  return { supabase, stripe, resend, openrouter };
}

// Save environment variables to .env.local
export async function saveEnvironmentVariables(formData: FormData): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Extract all form values
    const supabaseUrl = formData.get('supabase-url') as string;
    const supabaseAnonKey = formData.get('supabase-anon-key') as string;
    const supabaseServiceKey = formData.get('supabase-service-key') as string;
    const databaseUrl = formData.get('database-url') as string;
    const stripeSecretKey = formData.get('stripe-secret-key') as string;
    const stripePublishableKey = formData.get('stripe-publishable-key') as string;
    const stripeWebhookSecret = formData.get('stripe-webhook-secret') as string;
    const resendApiKey = formData.get('resend-api-key') as string;
    const resendFromEmail = formData.get('resend-from') as string;
    const resendToEmail = formData.get('resend-to') as string;
    const openrouterApiKey = formData.get('openrouter-api-key') as string;
    const aiTemperature = formData.get('ai-temperature') as string;

    // Validate required fields
    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey || !databaseUrl) {
      return { success: false, message: 'Supabase configuration is incomplete' };
    }

    if (!stripeSecretKey || !stripePublishableKey || !stripeWebhookSecret) {
      return { success: false, message: 'Stripe configuration is incomplete' };
    }

    if (!resendApiKey || !resendFromEmail || !resendToEmail) {
      return { success: false, message: 'Resend configuration is incomplete' };
    }

    if (!openrouterApiKey || !aiTemperature) {
      return { success: false, message: 'OpenRouter configuration is incomplete' };
    }

    // Build .env.local content
    const envContent = `# Environment
NODE_ENV=development

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}

# Database
DATABASE_URL=${databaseUrl}

# Stripe Configuration
STRIPE_SECRET_KEY=${stripeSecretKey}
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${stripePublishableKey}
STRIPE_WEBHOOK_SECRET=${stripeWebhookSecret}

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Email Configuration (Resend)
RESEND_API_KEY=${resendApiKey}
RESEND_FROM_EMAIL=${resendFromEmail}
RESEND_TO_EMAIL=${resendToEmail}

# AI Configuration (OpenRouter)
OPENROUTER_API_KEY=${openrouterApiKey}
AI_TEMPERATURE=${aiTemperature}

# Profit Configuration (for credit calculation)
# Credits = Subscription Price - PROFIT_PER_USER_MONTHLY
PROFIT_PER_USER_MONTHLY=12.00

# Cron Jobs (Vercel)
# CRON_SECRET=your_secure_random_string_here

# Setup Wizard (will be set to 'true' after completing setup)
SETUP_COMPLETE=false
`;

    // Write to .env.local in the project root
    const envPath = join(process.cwd(), '.env.local');
    await writeFile(envPath, envContent, 'utf8');

    return {
      success: true,
      message: 'Configuration saved successfully! Please restart your development server.'
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to save configuration'
    };
  }
}
