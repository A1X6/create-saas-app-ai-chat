# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**SaaS Complete** is a production-ready Next.js 15 SaaS template with a **setup wizard system**. The application features a development-only setup flow that guides users through environment configuration, database setup, Stripe integration, and prompts management.

**Tech Stack:**
- **Framework**: Next.js 15 (App Router, Server Components, Server Actions)
- **Language**: TypeScript 5
- **Database**: PostgreSQL via Supabase (Drizzle ORM)
- **Auth**: Supabase Auth (PKCE flow)
- **Payments**: Stripe (subscriptions, webhooks)
- **AI**: OpenRouter (multiple AI models)
- **UI**: shadcn/ui + Tailwind CSS 4
- **Email**: Resend

---

## Development Commands

### Essential Commands
```bash
# Development
pnpm dev              # Start dev server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database (Drizzle ORM)
pnpm db:push          # Push schema changes (development only)
pnpm db:generate      # Generate migration files
pnpm db:migrate       # Run migrations (production)
pnpm db:studio        # Open Drizzle Studio GUI

# Stripe Configuration
pnpm stripe:sync      # Sync products to Stripe + generate plan-features.ts
pnpm stripe:sync:dry  # Preview sync changes (dry run)
pnpm stripe:list      # List all Stripe products

# Prompts Management
pnpm prompts:convert  # Convert markdown prompts to JSON format

# Demo Materials
pnpm screenshots:capture  # Automated screenshot capture (Playwright)
```

### First-Time Setup
1. Copy `.env.example` to `.env.local` and fill in values
2. Navigate to `http://localhost:3000/setup` in development mode
3. Follow the 6-step wizard to configure the application
4. Or manually run:
   ```bash
   pnpm db:push                # Initialize database schema
   pnpm stripe:sync            # Configure Stripe products
   ```

---

## Architecture

### Directory Structure

```
app/
├── (setup)/              # Setup wizard (development-only)
│   ├── environment/      # Step 1: Environment config
│   ├── database/         # Step 2: Database setup
│   ├── prompts/          # Step 3: AI prompts upload
│   ├── stripe/           # Step 4: Stripe configuration
│   └── finalize/         # Step 5: Complete setup
├── (protected)/          # Protected routes (auth required)
│   └── dashboard/        # User dashboard, chat, account
├── (marketing)/          # Public pages (landing, pricing)
├── (legal)/              # Legal pages (privacy, terms)
├── auth/                 # Authentication pages
├── api/                  # API routes
│   ├── auth/callback/    # Supabase OAuth callback
│   ├── stripe/webhook/   # Stripe webhook handler
│   ├── conversations/    # Chat conversations API
│   ├── activity/         # Activity logs API
│   └── cron/            # Cron jobs (token reset)
└── setup/                # Setup wizard pages

lib/
├── actions/              # Server Actions
│   ├── auth-actions.ts   # Authentication operations
│   ├── chat-actions.ts   # AI chat operations
│   ├── conversation-actions.ts
│   ├── database-actions.ts
│   ├── environment-actions.ts
│   ├── finalize-actions.ts
│   ├── prompts-actions.ts
│   └── stripe-actions.ts
├── db/
│   ├── schema.ts         # Drizzle schema (5 tables)
│   ├── queries/          # Database queries (organized by domain)
│   └── migrations/       # Generated migration files
├── supabase/
│   ├── server.ts         # Server-side Supabase client
│   ├── client.ts         # Browser-side Supabase client
│   └── middleware.ts     # Session management & route protection
├── payments/
│   ├── stripe-client.ts  # Stripe client configuration
│   ├── checkout.ts       # Checkout session creation
│   ├── portal.ts         # Customer portal
│   ├── webhooks.ts       # Webhook event handlers
│   └── products.ts       # Product/price fetching
├── ai/
│   ├── openrouter.ts     # OpenRouter API client
│   ├── models.ts         # AI model configurations
│   └── context-manager.ts # Chat context management
└── email/
    └── resend.ts         # Email sending via Resend

components/
├── ui/                   # shadcn/ui components
│   ├── orb-lazy.tsx      # Lazy-loaded 3D Orb (~200KB)
│   └── ...               # Other UI components
└── dashboard/
    └── usage-charts-lazy.tsx  # Lazy-loaded charts (~80KB)

scripts/
├── stripe/
│   ├── sync-stripe-products.ts    # Sync products to Stripe
│   └── list-stripe-products.ts
├── convert-prompts-to-json.ts     # Convert .md → .json
└── capture-screenshots.ts         # Automated screenshots
```

---

## Database Schema

### Core Tables (5 tables)

1. **user_profiles** - Extends Supabase auth.users
   - Stripe subscription data (customerId, subscriptionId, planName, status)
   - AI credits (balance, allocated, used) - monetary credits for paid plans
   - Free tokens (used, limit) - token limits for free tier

2. **activity_logs** - User action tracking
   - Per-user audit trail (SIGN_UP, SIGN_IN, SUBSCRIPTION_CREATED, etc.)

3. **chat_conversations** - Chat session metadata
   - User conversations with title, timestamps

4. **chat_messages** - Individual chat messages
   - Role (user/assistant), content, model, tokens, cost

5. **token_usage_logs** - Permanent token/cost tracking
   - Survives conversation deletion
   - Separate input/output token counts and costs

### Important Database Notes

- **Connection String**: Use DIRECT connection (not pooler) for Drizzle ORM
  ```
  postgresql://postgres.xxx:[PASSWORD]@aws-0-xxx.pooler.supabase.com:5432/postgres
  ```
- **Schema Changes**: Use `pnpm db:push` in development, `pnpm db:generate` + `pnpm db:migrate` in production
- **Type Safety**: All tables have inferred types via `typeof tableName.$inferSelect`
- **Relations**: Defined in schema.ts for type-safe joins

---

## Critical Patterns

### 1. Server Components First
Most pages are Server Components that directly access the database:

```typescript
// app/(protected)/dashboard/page.tsx
export default async function DashboardPage() {
  const user = await getUser(); // Direct DB access
  const activityLogs = await getActivityLogs();
  // No client-side state needed for initial render
}
```

### 2. Server Actions for Mutations
All data mutations use Server Actions:

```typescript
'use server';

export async function signUpAction(formData: FormData) {
  // Server-side validation, database operations
  // Returns { success, error } or redirects
}
```

Usage in components:
```tsx
<form action={signUpAction}>
  <input name="email" />
  <button type="submit">Sign Up</button>
</form>
```

### 3. React cache() for Deduplication
All database queries use React's `cache()` to prevent duplicate calls:

```typescript
import { cache } from 'react';

export const getUser = cache(async () => {
  // Called 10 times in one request? Only executes once!
  const supabase = await createClient();
  // ... fetch user
});
```

### 4. Route Protection via Middleware
Two-layer middleware system:

**Layer 1** (`middleware.ts`): Setup route protection
- Blocks `/setup` in production (NODE_ENV !== 'development')
- Redirects to `/setup` if `SETUP_COMPLETE !== 'true'`
- Supports `?force=true` parameter for manual access

**Layer 2** (`lib/supabase/middleware.ts`): Auth protection
- Protected routes: `/dashboard/*` → redirect to `/auth/sign-in` if not authenticated
- Auth routes: `/auth/*` → redirect to `/dashboard` if authenticated
- Uses Supabase `auth.getClaims()` for session validation

### 5. Lazy Loading for Performance
Heavy components use dynamic imports:

```typescript
// components/ui/orb-lazy.tsx
const OrbDynamic = dynamic(() => import('./orb'), {
  ssr: false, // Client-only (3D canvas requires browser)
  loading: () => <Loader2 className="animate-spin" />,
});
```

**Lazy-loaded components:**
- `<OrbLazy />` - 3D Orb animation (~200KB Three.js bundle)
- `<UsageChartsLazy />` - Recharts (~80KB)

### 6. Stripe Integration Pattern
Config-based product management:

1. Define products in `scripts/stripe/stripe-products.config.ts`
2. Run `pnpm stripe:sync` to push to Stripe
3. Auto-generates `plan-features.ts` for pricing page
4. Webhooks update database on subscription changes

**Webhook Events Handled:**
- `checkout.session.completed` → Create subscription
- `customer.subscription.updated` → Update subscription status
- `customer.subscription.deleted` → Cancel subscription

### 7. AI Chat Architecture
- **Models**: Free (GLM-4.5 Air) and Paid (GPT-4, Claude, Llama)
- **Token Tracking**: Dual system
  - `aiCreditsUsed` - monetary credits deducted from paid subscriptions
  - `freeTokensUsed` - token count for free tier users
- **Monthly Reset**:
  - **Free tokens**: Reset on 1st of each month (via cron: `/api/cron/reset-free-tokens`)
  - **AI credits (yearly)**: Reset on 1st of each month (via cron: `/api/cron/reset-yearly-credits`)
  - **AI credits (monthly)**: Reset on billing cycle (via Stripe webhook)
- **Conversations**: Stored in DB with messages
- **Context Management**: `lib/ai/context-manager.ts` handles conversation history

---

## Setup Wizard System

### Access Control
- **Development Only**: `/setup` routes blocked in production
- **Environment Check**: `SETUP_COMPLETE=true` disables wizard
- **Force Access**: Use `http://localhost:3000/setup?force=true`

### Wizard Flow (6 steps)

1. **Welcome** (`/setup`) - Introduction & prerequisites
2. **Environment** (`/setup/environment`) - Configure .env.local
   - Validates Supabase, Stripe, Resend, OpenRouter credentials
   - Tests connections before saving
3. **Database** (`/setup/database`) - Initialize schema
   - Runs `pnpm db:push` via server action
   - Verifies tables created
4. **Prompts** (`/setup/prompts`) - Upload AI prompts
   - Place .md files in `prompts/markdown/`
   - Converts to JSON format in `prompts/json/`
5. **Stripe** (`/setup/stripe`) - Configure products
   - Lists existing products
   - Syncs to Stripe
   - Sets up webhooks
6. **Finalize** (`/setup/finalize`) - Complete setup
   - Generates landing page
   - Sets `SETUP_COMPLETE=true`

---

## Environment Variables

### Required Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database (DIRECT connection, not pooler)
DATABASE_URL=postgresql://...

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Email
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_TO_EMAIL=

# AI
OPENROUTER_API_KEY=
AI_TEMPERATURE=0.7

# Setup
SETUP_COMPLETE=false  # Set to 'true' after setup wizard
```

### Getting API Keys
- **Supabase**: Project Settings → API (anon key + service role key)
- **Database URL**: Project Settings → Database → Direct Connection
- **Stripe**: Dashboard → Developers → API keys
- **Stripe Webhook**: Run `pnpm stripe:webhook:setup` (auto-configures)
- **Resend**: https://resend.com/api-keys
- **OpenRouter**: https://openrouter.ai/keys

---

## Common Development Tasks

### Add a New Database Field
```typescript
// 1. Update lib/db/schema.ts
export const userProfiles = pgTable('user_profiles', {
  // ... existing fields
  newField: varchar('new_field', { length: 255 }),
});

// 2. Push to database
pnpm db:push  // Development
# OR
pnpm db:generate && pnpm db:migrate  // Production

// 3. Update queries in lib/db/queries/
// 4. TypeScript types auto-update via Drizzle inference
```

### Add a New Protected Page
```typescript
// app/(protected)/dashboard/new-page/page.tsx
import { getUser } from '@/lib/db/queries';

export default async function NewPage() {
  const user = await getUser(); // Auto-protected by middleware
  return <div>Protected content for {user?.name}</div>;
}
```

### Add a New Server Action
```typescript
// lib/actions/new-actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function newAction(formData: FormData) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect('/auth/sign-in');
  }

  // Perform action
  // Return result or redirect
}
```

### Modify Stripe Products
```typescript
// 1. Edit scripts/stripe/stripe-products.config.ts
export const stripePricingConfig = {
  products: [
    {
      name: 'New Plan',
      description: 'Description',
      features: ['Feature 1', 'Feature 2'],
      prices: [
        { nickname: 'New Plan Monthly', unitAmount: 2000, currency: 'usd', interval: 'month' }
      ],
      metadata: { tier: 'new', ai_credits_limit: '10000' }
    }
  ]
};

// 2. Sync to Stripe
pnpm stripe:sync:dry  // Preview changes
pnpm stripe:sync      // Apply changes + generate plan-features.ts

// 3. Pricing page auto-updates (no code changes needed)
```

### Add AI Prompts
```bash
# 1. Create markdown file
echo "# System Prompt\nYou are a helpful assistant." > prompts/markdown/helper.md

# 2. Convert to JSON
pnpm prompts:convert

# 3. Use in code
import helperPrompt from '@/prompts/json/helper.json';
const systemMessage = { role: 'system', content: helperPrompt.content };
```

---

## Performance Optimizations

### Implemented Optimizations
1. **Route-level code splitting** - Automatic (Next.js App Router)
2. **Component-level lazy loading** - Orb (~200KB), Charts (~80KB)
3. **React cache()** - Deduplicates database queries
4. **Tree-shaking** - `optimizePackageImports` in next.config.ts
5. **Image optimization** - AVIF/WebP formats, responsive sizes
6. **Gzip compression** - `compress: true` in next.config.ts
7. **SSG for public pages** - Landing, pricing, legal pages

### Bundle Sizes
- Initial JS: ~350KB (-30% from baseline)
- Homepage: ~250KB (static)
- Dashboard: ~480KB initial + 80KB lazy-loaded charts
- Chat: ~500KB initial + 200KB lazy-loaded Orb

---

## Testing

### Stripe Test Cards
```
Success:     4242 4242 4242 4242
Decline:     4000 0000 0000 0002
3D Secure:   4000 0025 0000 3155
Expiry:      Any future date
CVC:         Any 3 digits
```

### Test Flow
1. Sign up new user
2. Subscribe to plan (use test card)
3. Verify webhook updates database
4. Test Customer Portal
5. Test AI chat with token tracking
6. Verify activity logging

---

## Security Notes

### Implemented Security
- **PKCE Auth Flow** - Supabase authentication
- **Webhook Signature Verification** - Stripe webhooks
- **Route Protection** - Middleware enforces auth
- **Environment Variables** - Secrets never in code
- **SQL Injection Prevention** - Drizzle ORM parameterized queries
- **XSS Prevention** - React automatic escaping

### Security Best Practices
- Never log sensitive data (API keys, tokens)
- Use Supabase Row Level Security (RLS) for additional protection
- Validate all user input in Server Actions
- Keep dependencies updated (`pnpm update`)
- Use `SUPABASE_SERVICE_ROLE_KEY` only on server-side

---

## Deployment

### Vercel Deployment
```bash
# 1. Push to GitHub
git push origin main

# 2. Connect to Vercel
# Import repository in Vercel dashboard

# 3. Set environment variables
# Add all .env.example variables in Vercel project settings

# 4. Configure Stripe webhook for production
pnpm stripe:webhook:setup --url https://yourdomain.com

# 5. Deploy
# Automatic on git push
```

### Required Vercel Environment Variables
- All variables from `.env.example`
- `CRON_SECRET` - For scheduled jobs (monthly free token reset & yearly credit reset)
- `SETUP_COMPLETE=true` - Disable setup wizard in production

### Post-Deployment
1. Test authentication flow
2. Test subscription flow with Stripe test mode
3. Verify webhook events in Stripe dashboard
4. Switch Stripe to live mode
5. Update OAuth redirect URLs in Supabase

---

## Troubleshooting

### Database Connection Error
**Problem**: `Error: connect ECONNREFUSED`
**Solution**: Use DIRECT connection string from Supabase (not pooler URL)

### Stripe Webhook Failed
**Problem**: Subscriptions not updating
**Solution**: Run `pnpm stripe:webhook:setup` or use Stripe CLI

### Auth Redirect Error
**Problem**: "Auth Error" after signing up
**Solution**: Add callback URL to Supabase: `http://localhost:3000/api/auth/callback`

### Setup Wizard Not Accessible
**Problem**: Cannot access `/setup`
**Solution**:
- Ensure `NODE_ENV=development`
- Set `SETUP_COMPLETE=false` in `.env.local`
- Or use `http://localhost:3000/setup?force=true`

---

## Key Files Reference

### Configuration
- `drizzle.config.ts` - Database ORM configuration
- `next.config.ts` - Next.js configuration (compression, image optimization)
- `middleware.ts` - Route protection and setup access control
- `components.json` - shadcn/ui configuration
- `.env.example` - Environment variables template

### Core Logic
- `lib/db/schema.ts` - Database schema (source of truth)
- `lib/supabase/middleware.ts` - Auth protection logic
- `lib/payments/webhooks.ts` - Stripe subscription logic
- `lib/ai/openrouter.ts` - AI chat integration
- `app/api/stripe/webhook/route.ts` - Webhook endpoint
- `app/api/cron/reset-free-tokens/route.ts` - Monthly free token reset (1st of month)
- `app/api/cron/reset-yearly-credits/route.ts` - Monthly yearly credit reset (1st of month)

### Auto-Generated Files (Do Not Edit Manually)
- `plan-features.ts` - Generated by `pnpm stripe:sync`
- `prompts/json/*.json` - Generated by `pnpm prompts:convert`
- `.next/` - Build output directory
- `tsconfig.tsbuildinfo` - TypeScript incremental build cache

---

## Documentation Files

- `.env.example` - Environment variables reference
- `docs/screenshots/` - Screenshot storage (16 required screenshots)
- `docs/videos/` - Demo video storage (3 videos)
- `CLAUDE.md` - This file (project guidance)
