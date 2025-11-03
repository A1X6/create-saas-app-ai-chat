'use server';

import { createClient } from '@supabase/supabase-js';
import { Stripe } from 'stripe';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import messages from './messages.json';

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
      return { valid: false, message: messages.environment.validation.supabase.errors.allFieldsRequired };
    }

    // Test anon key connection
    const supabase = createClient(url, anonKey);
    const { error } = await supabase.auth.getSession();

    if (error) {
      return {
        valid: false,
        message: messages.environment.validation.supabase.errors.connectionFailed.replace('{{error}}', error.message)
      };
    }

    return { valid: true, message: messages.environment.validation.supabase.success };
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
      return { valid: false, message: messages.environment.validation.stripe.errors.secretKeyRequired };
    }

    const stripe = new Stripe(secretKey);
    await stripe.products.list({ limit: 1 });

    return { valid: true, message: messages.environment.validation.stripe.success };
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
      return { valid: false, message: messages.environment.validation.resend.errors.allFieldsRequired };
    }

    // Resend doesn't have a simple validation endpoint, so we'll just check the key format
    if (!apiKey.startsWith('re_')) {
      return { valid: false, message: messages.environment.validation.resend.errors.invalidKeyFormat };
    }

    // Validate email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(fromEmail)) {
      return { valid: false, message: messages.environment.validation.resend.errors.invalidFromEmail };
    }
    if (!emailRegex.test(toEmail)) {
      return { valid: false, message: messages.environment.validation.resend.errors.invalidToEmail };
    }

    return { valid: true, message: messages.environment.validation.resend.success };
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
      return { valid: false, message: messages.environment.validation.openrouter.errors.allFieldsRequired };
    }

    // Validate temperature
    const temp = parseFloat(temperature);
    if (isNaN(temp) || temp < 0 || temp > 2) {
      return { valid: false, message: messages.environment.validation.openrouter.errors.invalidTemperature };
    }

    // Test OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      return { valid: false, message: messages.environment.validation.openrouter.errors.invalidApiKey };
    }

    return { valid: true, message: messages.environment.validation.openrouter.success };
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
      return { success: false, message: messages.environment.save.errors.supabaseIncomplete };
    }

    if (!stripeSecretKey || !stripePublishableKey || !stripeWebhookSecret) {
      return { success: false, message: messages.environment.save.errors.stripeIncomplete };
    }

    if (!resendApiKey || !resendFromEmail || !resendToEmail) {
      return { success: false, message: messages.environment.save.errors.resendIncomplete };
    }

    if (!openrouterApiKey || !aiTemperature) {
      return { success: false, message: messages.environment.save.errors.openrouterIncomplete };
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
      message: messages.environment.save.success
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to save configuration'
    };
  }
}
