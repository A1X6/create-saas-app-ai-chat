# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Project Name:** AI SaaS Template

This is a production-ready AI SaaS starter template built with Next.js 15, providing unified access to 15+ AI models (Claude, Gemini, Llama, DeepSeek, etc.) through OpenRouter. Features include multi-model chat interface, customizable artifact detection, user authentication, Stripe subscriptions with trial periods, USD-based credit system, usage analytics, and automatic context window management. Ready to customize for your AI product.

**Stack:**

- Next.js 15 (App Router, Turbopack dev mode, standalone output)
- TypeScript 5
- Supabase (Authentication + PostgreSQL)
- Drizzle ORM (Database schema & migrations)
- Stripe (Subscriptions with trials & webhooks)
- OpenRouter (Multi-model AI API aggregator)
- Tailwind CSS 4 + shadcn/ui + magicui
- React 19

## Development Commands

```bash
# Development
pnpm dev              # Start dev server with Turbopack

# Build & Production
pnpm build            # Production build
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint

# Database (Drizzle ORM)
pnpm db:generate      # Generate migration files from schema changes
pnpm db:migrate       # Apply migrations to database
pnpm db:push          # Push schema directly (dev only, skips migrations)
pnpm db:studio        # Open Drizzle Studio UI

# Utilities
pnpm screenshots:capture  # Capture OpenGraph images
```

## Database Workflow

1. **Modify schema**: Edit `lib/db/schema.ts`
2. **Generate migration**: `pnpm db:generate` (creates timestamped SQL in `lib/db/migrations/`)
3. **Apply migration**: `pnpm db:migrate` (applies to DATABASE_URL)
4. **Quick dev push**: `pnpm db:push` (bypasses migrations, use sparingly)

The database connection uses Drizzle ORM with Neon serverless driver, configured in `drizzle.config.ts`.

## Architecture & Code Organization

### Route Structure (Next.js App Router)

```
app/
├── (marketing)/          # Public marketing pages (/, /pricing, /features, /about, /contact)
│   └── (legal)/         # Legal pages (/privacy, /terms)
├── (protected)/         # Auth-protected routes
│   └── dashboard/       # User dashboard
│       ├── page.tsx             # Dashboard home with usage stats
│       ├── chat/                # AI chat interface (/dashboard/chat)
│       ├── account/             # Account settings (/dashboard/account)
│       └── components/          # Dashboard-specific components (upgrade-card.tsx)
├── auth/                # Authentication flows
│   ├── sign-in/                 # Login page
│   ├── sign-up/                 # Registration page
│   ├── forgot-password/         # Password reset request
│   ├── update-password/         # Password change (from email link)
│   └── error/                   # Auth error page
├── setup/               # Initial setup wizard (dev only, when SETUP_COMPLETE=false)
│   ├── page.tsx                 # Welcome screen
│   ├── environment/             # Environment variable configuration
│   ├── database/                # Database connection & schema push
│   ├── stripe/                  # Stripe product setup
│   ├── prompts/                 # System prompts upload
│   └── finalize/                # Completion & SETUP_COMPLETE=true
└── api/                 # API routes
    ├── auth/callback/           # Supabase auth callback
    ├── activity/                # Activity logs endpoint
    ├── conversations/           # Chat conversation CRUD
    │   ├── route.ts             # GET all conversations (authenticated)
    │   └── [id]/route.ts        # GET/DELETE specific conversation
    ├── stripe/
    │   ├── webhook/route.ts     # Stripe webhook handler (POST)
    │   └── checkout/route.ts    # Checkout session redirect (GET)
    ├── cron/                    # Scheduled jobs (protected by CRON_SECRET)
    │   └── reset-yearly-credits/ # Yearly subscription credit reset
    ├── health/route.ts          # Health check endpoint
    └── contact/route.ts         # Contact form submission

```

**Route Groups:**

- `(marketing)` - Marketing layout with header/footer, open to all visitors
- `(legal)` - Nested within marketing, privacy and terms pages
- `(protected)` - Requires authentication (middleware check), uses dashboard layout with sidebar
- `setup` - Only accessible in development mode when `SETUP_COMPLETE=false` in environment (Note: Not a route group, regular folder)

### Core Library Structure

```
lib/
├── actions/             # Server actions (auth, chat, payments, setup)
├── ai/
│   ├── openrouter.ts   # OpenRouter API client & streaming
│   ├── models.ts/json  # AI model definitions with pricing
│   └── context-manager.ts  # Context window management
├── db/
│   ├── schema.ts       # Drizzle schema (source of truth)
│   ├── queries/        # Database query functions by domain
│   └── migrations/     # Generated SQL migrations
├── payments/           # Stripe integration (checkout, webhooks, portal)
├── prompts/            # System prompts loader (from prompts/json/)
├── supabase/           # Supabase client configs (server, client, middleware)
└── utils/              # Shared utilities
```

### Database Schema (lib/db/schema.ts)

**Key Tables:**

- `user_profiles` - Extends Supabase auth.users with:
  - **Stripe fields**: `stripeCustomerId`, `stripeSubscriptionId`, `stripeProductId`, `planName`, `subscriptionStatus`
  - **AI credits**: `aiCreditsBalance`, `aiCreditsAllocated`, `aiCreditsUsed` (USD with 2 decimals)
  - **Note**: Trial tracking is handled via `subscriptionStatus` field (value: 'trialing')

- `chat_conversations` - Chat sessions per user
  - Fields: `id`, `userId`, `title`, `createdAt`, `updatedAt`

- `chat_messages` - Individual messages in conversations
  - Fields: `id`, `conversationId`, `role` (user/assistant), `content`, `model`, `createdAt`
  - Legacy fields: `tokensUsed`, `costInDollars` (deprecated, use token_usage_logs)

- `token_usage_logs` - Permanent token tracking (survives conversation deletion)
  - Token counts: `inputTokens`, `outputTokens`, `totalTokens` (integers)
  - Costs: `inputCost`, `outputCost`, `totalCost` (USD with 6 decimals)
  - Fields: `userId`, `model`, `timestamp`
  - **Purpose**: Analytics and audit trail, independent of chat_messages lifecycle

- `activity_logs` - User activity audit trail
  - Fields: `userId`, `action` (ActivityType enum), `timestamp`, `ipAddress`
  - **Actions**: SIGN_IN, SIGN_OUT, SUBSCRIPTION_CREATED, SUBSCRIPTION_UPDATED, SUBSCRIPTION_CANCELLED, PASSWORD_RESET, etc.

**Credit System Design:**

- **Unsubscribed users**: Users without an active subscription cannot use the service
  - Must subscribe to access AI chat features
  - Redirected to pricing page from all protected routes

- **Trial users**: Have `subscriptionStatus: 'trialing'`
  - Receive $1.00 in trial credits upon subscription
  - Trial duration: 7 days (monthly plans), 14 days (yearly plans)
  - Low credit warning shown when balance drops below $0.25
  - Can upgrade early via Stripe Customer Portal to receive full plan credits immediately
  - When upgraded early, credits are reset to full plan amount (not additive)
  - Credits deducted based on actual AI API costs from OpenRouter

- **Paid users**: Have `subscriptionStatus: 'active'`
  - Have `aiCreditsBalance` in USD, deducted by actual AI costs from OpenRouter
  - Can access all AI models (all models are now paid)
  - Credits allocated based on Stripe product metadata `ai_credits_amount`
  - Monthly reset on subscription anniversary (monthly plans)
  - Yearly reset via cron job (`/api/cron/reset-yearly-credits`)
  - When trial users upgrade, status changes from 'trialing' to 'active' and credits reset to full amount

- **Token tracking**: All usage logged to `token_usage_logs` with input/output token counts and costs

### Authentication Flow

Supabase Auth handles authentication with custom middleware (`middleware.ts`):

1. `updateSession()` refreshes Supabase session cookies
2. Protected routes require valid session (via `getUser()` in queries)
3. Setup wizard redirects (only in dev when `SETUP_COMPLETE=false`)

**Auth utilities:**

- `lib/supabase/server.ts` - Server-side Supabase client
- `lib/supabase/client.ts` - Client-side Supabase client
- `lib/db/queries/user.queries.ts` - `getUser()` helper

### AI Chat Architecture

**Key components:**

- `lib/ai/openrouter.ts` - OpenRouter client, streaming support
- `lib/ai/models.ts` - Model definitions with input/output pricing
- `lib/ai/context-manager.ts` - Token estimation & automatic context optimization
- `app/(protected)/dashboard/chat/chat-interface.tsx` - Main chat UI (client component)

**Chat flow:**

1. User sends message → `sendChatAction()` in `lib/actions/chat-actions.ts`
2. Load conversation history from `chat_messages` table
3. **Context optimization** → `manageContext()` checks token usage:
   - Calculate total tokens in conversation history (using `gpt-tokenizer`)
   - If tokens > 70% of model's max context window:
     - Keep last 10 messages (recent context)
     - Summarize older messages using **the same AI model**
     - Replace old messages with summary (reduces tokens significantly)
   - Purpose: Maintain context while staying within limits
4. Stream response from OpenRouter via `sendChatMessageStream()`
5. Parse streaming chunks → Extract content and usage data
6. Track tokens/costs → Log to `token_usage_logs` (permanent record)
7. Update user balance → Deduct from `aiCreditsBalance` (in USD)
8. Save user message and assistant response to `chat_messages` table

**Token tracking:**

- Uses `encode()` from `gpt-tokenizer` for accurate token counts (GPT tokenizer)
- Fallback: Character-based estimation (3.5 chars ≈ 1 token)
- Separate input/output token counts (different pricing ratios)
- Input tokens cost less than output tokens (typically 40% of output cost)
- All users: Deduct calculated cost from `aiCreditsBalance` (in USD)
- Trial users: $1.00 trial credit, with low credit warning at $0.25

**Model access control:**

- All models are now paid (no free models)
- Unsubscribed users: Cannot access any models - must subscribe
- Trial users: Can access all models using $1.00 trial credit
- Paid users: Can access all models using plan credits
- Model list loaded from `lib/ai/models.json` via `lib/ai/models.ts`
- Pricing structure: `inputCostPer1M` and `outputCostPer1M` (USD per 1M tokens)

### Stripe Integration

**Payment flow:**

- `lib/payments/checkout.ts` - Creates Checkout sessions with trial periods
- `lib/payments/portal.ts` - Customer portal for subscription management
- `lib/payments/webhooks.ts` - Handles webhook events (event processing logic)
- `app/api/stripe/webhook/route.ts` - Webhook endpoint (POST)

**Key webhooks:**

- `checkout.session.completed` - Create/link Stripe customer, activate subscription
- `customer.subscription.created` - Initial subscription setup, **allocate credits after trial**
- `customer.subscription.updated` - Update subscription status, reset monthly credits
- `customer.subscription.deleted` - Cancel subscription, zero out credits

**Trial period logic:**

- **Monthly plans**: 7-day trial (`subscription_data.trial_period_days: 7`)
- **Yearly plans**: 14-day trial (`subscription_data.trial_period_days: 14`)
- **During trial**: $1.00 trial credit allocated, `subscriptionStatus` set to `'trialing'` in user profile
- **Low credit warning**: Shown when trial balance drops below $0.25
- **Early upgrade**: Users can upgrade via Stripe Customer Portal before trial ends
  - Credits immediately reset to full plan amount (not additive)
  - Status changes from 'trialing' to 'active'
- **After trial**: Full plan credits allocated when subscription becomes active
- **Trial tracking**: Managed via Stripe subscription status (trialing → active)

**Credit allocation:**

- Defined in Stripe product price metadata: `ai_credits_amount` (e.g., "10.00" = $10 USD)
- Allocated via `resetAICredits()` in `lib/db/queries/credits.queries.ts`
- **Trial users**: $1.00 credit allocated on subscription creation
- **Monthly plans**: Reset credits on subscription anniversary (handled by Stripe webhook)
- **Yearly plans**: Reset via cron job (`/api/cron/reset-yearly-credits`)
- **Early upgrade**: Credits reset to full plan amount when trial users upgrade

### System Prompts

**System Prompts** (Admin/Developer):

- Stored in `prompts/json/` directory
- Main prompt file: `prompts/json/prompt.json` (contains full system prompt)
- Index file: `prompts/json/index.ts` (exports `allPrompts` array)
- Structure:
  ```json
  {
    "content": "System prompt text..."
  }
  ```
- Loaded via `lib/prompts/index.ts` using static imports (serverless-compatible)
- **Chat** (`/dashboard/chat`): Uses customizable system prompt (generic AI assistant by default)
- First prompt accessed via `getFirstPrompt()` helper function
- **Customization**: Edit `prompts/markdown/prompt.md` and run `pnpm prompts:convert` to generate JSON

### Artifact Detection

- Customizable AI output detection in `lib/ai/artifact-detector.ts`
- Example detects code blocks (5+ lines) - modify for your use case
- Artifacts display in split-view (desktop) or overlay (mobile)

## Environment Variables

Critical `.env.local` variables (see `.env.example` for full list):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=                      # Supabase database connection string (pooler URL)

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# OpenRouter
OPENROUTER_API_KEY=
AI_TEMPERATURE=0.7

# Email (Resend)
RESEND_API_KEY=                    # For contact form emails
RESEND_FROM_EMAIL=                 # Verified sender email
RESEND_TO_EMAIL=                   # Recipient for contact form

# App Config
NEXT_PUBLIC_BASE_URL=              # http://localhost:3000 or production URL
SETUP_COMPLETE=false               # Set to 'true' to skip setup wizard

# Cron Jobs
CRON_SECRET=                       # Required for scheduled endpoints
```

## Key Design Patterns

### Server Actions Pattern

Server actions in `lib/actions/` use this pattern:

```typescript
"use server";

export async function actionName(): Promise<ActionResponse<T>> {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }
    // ... business logic
    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Error message" };
  }
}
```

### Database Query Pattern

Queries in `lib/db/queries/` are organized by domain:

- Always use Drizzle ORM (`db` instance from `lib/db/index.ts`)
- Prefer prepared statements for repeated queries
- Use transactions for multi-table operations

### AI Streaming Pattern

Streaming responses use ReadableStream with proper error handling:

```typescript
const stream = await openrouter.chat.completions.create({
  model,
  messages,
  stream: true,
});

return new Response(
  new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        // Process chunk
        controller.enqueue(encodedChunk);
      }
      controller.close();
    },
  })
);
```

## Common Development Tasks

### Adding a New Database Table

1. Add table definition to `lib/db/schema.ts`
2. Add relations if needed
3. Export TypeScript types
4. Run `pnpm db:generate` to create migration
5. Run `pnpm db:migrate` to apply
6. Create query functions in `lib/db/queries/`

### Adding a New AI Model

1. Add model definition to `lib/ai/models.json`
2. Set `type` to `"paid"` (all models are now paid)
3. Include `inputCostPer1M` and `outputCostPer1M` (USD per 1M tokens)
4. Model will be auto-loaded by `lib/ai/models.ts`

### Creating a New API Route

1. Create route file in `app/api/[route]/route.ts`
2. Export HTTP method handlers (GET, POST, etc.)
3. Use `getUser()` for authentication
4. Return `NextResponse.json()` with proper status codes

### Adding Stripe Products

1. Create products/prices in Stripe dashboard
2. Add `ai_credits` metadata to price (e.g., "10.00")
3. Webhook handlers will auto-sync on subscription events

## Cron Jobs & Scheduled Tasks

**Scheduled endpoint (protected by `CRON_SECRET` header):**

1. **Yearly Credit Reset** (`/api/cron/reset-yearly-credits/route.ts`):
   - Resets AI credits for yearly subscription users
   - Checks subscription anniversary date
   - Schedule: Monthly (1st of every month at 00:00 UTC)
   - Cron expression: `0 0 1 * *`

**Vercel Cron Configuration:**
Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/reset-yearly-credits",
      "schedule": "0 0 1 * *"
    }
  ]
}
```

**Security:**

- All cron endpoints check for `x-cron-secret` header
- Must match `CRON_SECRET` environment variable
- Returns 401 Unauthorized if missing or incorrect

## Deployment

**Production Requirements:**

- Next.js configured with `output: 'standalone'` in `next.config.ts`
- Enables optimized Docker builds with minimal dependencies
- All environment variables must be set in production environment

**Vercel Deployment:**

- Native Next.js hosting (recommended)
- Set all environment variables in project settings
- Add `CRON_SECRET` for scheduled functions
- Configure cron jobs in `vercel.json`
- Configure `DATABASE_URL` with your Supabase connection string

**Google Cloud Run Deployment:**

- Use `Dockerfile` with multi-stage build
- Configure `app.yaml` for Cloud Run
- Set environment variables via `gcloud run services update`
- Enable Cloud SQL connector for database access (if using Cloud SQL)
- Health check endpoint: `/api/health` (implement if needed)

**Docker Deployment:**

- Multi-stage Dockerfile with standalone output
- Use `docker-compose.yml` for local testing
- Copy `.next/standalone` and `.next/static` to production image
- Run as non-root user (security best practice)
- Expose port 3000 (or use `PORT` environment variable)

## Component Architecture

**UI Framework:**

- **shadcn/ui** (50+ components): Base UI components built on Radix UI
  - Located in `components/ui/`
  - Examples: `button.tsx`, `card.tsx`, `dialog.tsx`, `sidebar.tsx`
  - Customizable via `components.json` config

- **magicui** (Animation components): Advanced animated components
  - Located in `components/magicui/`
  - Examples: `animated-gradient-text.tsx`, `shimmer-button.tsx`, `number-ticker.tsx`
  - Used for marketing pages and interactive effects

**Key Dashboard Components:**

- `app/(protected)/dashboard/` - Dashboard-specific components
  - `dashboard-header.tsx` - Header with user menu
  - `dashboard-sidebar.tsx` - Navigation sidebar
  - `usage-charts.tsx` - Analytics charts (using Recharts)
  - `upgrade-card.tsx` - Trial upgrade UI
  - `low-credit-warning.tsx` - Credit warning component

**Marketing Components:**

- `PlasmaBackground.tsx` + `Plasma.tsx` - 3D WebGL plasma effect (using Three.js)
- `HeroSection.tsx` - Homepage hero with animated elements
- `Header.tsx` / `Footer.tsx` - Marketing layout components

## Setup Wizard Flow (Development Only)

**Access:** Only when `NODE_ENV === 'development'` AND `SETUP_COMPLETE=false`

**Five-step process:**

1. **Environment** (`/setup/environment`):
   - Input all required API keys and environment variables
   - Validates required fields
   - Writes to `.env.local` file

2. **Database** (`/setup/database`):
   - Test database connection
   - Push schema using `pnpm db:push`
   - Create initial tables

3. **Stripe** (`/setup/stripe`):
   - Create products and prices via Stripe API
   - Set `ai_credits_amount` metadata
   - Configure webhook endpoints

4. **Prompts** (`/setup/prompts`):
   - Upload system prompt JSON files
   - Store in `prompts/json/` directory
   - Validate prompt structure

5. **Finalize** (`/setup/finalize`):
   - Set `SETUP_COMPLETE=true` in `.env.local`
   - Log setup completion activity
   - Redirect to sign-in

**Bypass:** Can force access with `?force=true` query parameter

## Important Notes

1. **Database Connection**: Use your Supabase database connection string (pooler or direct connection both work)
   - Format: `postgresql://user:password@host:PORT/database`

2. **Token Tracking**: Token usage is logged to `token_usage_logs` independently of `chat_messages` (survives deletion)
   - Enables usage analytics and billing reconciliation
   - Separate input/output token counts for accurate cost calculation

3. **Context Window Management**: Automatic summarization kicks in at 70% of model's max context
   - Uses the same model to summarize (maintains quality)
   - Keeps last 10 messages for continuity
   - Prevents token limit errors

4. **Credit System**:
   - Unsubscribed users: Cannot access AI features - must subscribe
   - Trial users: $1.00 credit, low warning at $0.25, can upgrade early via 2-button UI
   - Paid tier: USD amounts (6 decimals for precision), reset on anniversary
   - All credits deducted based on actual OpenRouter API costs

5. **Model Access Control**:
   - All models have `type: "paid"` in `lib/ai/models.json`
   - Unsubscribed users: Blocked from all AI features
   - Trial and paid users: Can access all models
   - No free models available

6. **Setup Wizard**: Only accessible in development when `SETUP_COMPLETE=false`
   - Middleware redirects all routes to setup wizard if incomplete
   - Force access with `?force=true` for troubleshooting

7. **Middleware Flow**: All requests go through `middleware.ts`
   - Session refresh (`updateSession()` from Supabase)
   - Auth checks for protected routes
   - Setup wizard redirect (dev only)
   - Redirect authenticated users away from auth pages

8. **Streaming Responses**: AI responses use `ReadableStream` for real-time updates
   - Parses SSE (Server-Sent Events) from OpenRouter
   - Extracts content chunks and usage data
   - Updates UI progressively as tokens arrive

9. **Type Safety**:
   - Use inferred types from Drizzle schema: `typeof table.$inferSelect` / `$inferInsert`
   - Zod schemas for runtime validation (form inputs, API payloads)
   - Strict TypeScript mode enabled (`tsconfig.json`)

10. **Server Actions**:
    - Mark with `'use server'` directive at top of file
    - Return consistent `ActionResponse<T>` shape: `{ success: boolean, data?: T, error?: string }`
    - Always check authentication via `getUser()` before operations

11. **Activity Logs**: Track all major user actions for audit trail
    - Sign-in/out, subscription changes, password resets
    - Stored in `activity_logs` table with timestamp and IP
    - Useful for security monitoring and user support

## Recent Changes & New Features

### 1. Artifact Detection System

**Feature**: Customizable detection of AI-generated content for split-view display

**Files**:

- `lib/ai/artifact-detector.ts` - Configurable detection function
- `app/(protected)/dashboard/chat/artifact-drawer.tsx` - Display component
- `app/(protected)/dashboard/chat/artifact-card.tsx` - Preview card

**Customization**:

- Edit `detectArtifact()` function to match your AI's output patterns
- Example detects code blocks (5+ lines)
- Returns `{ title, content }` or `null`

**Storage**:

- Artifacts stored as regular messages with `isArtifact: true` flag
- No separate database table needed
- Message ID serves as artifact ID

### 2. Trial Early Upgrade Feature

**Added**: Two-button UI allowing trial users to upgrade to paid immediately without waiting for trial to end

**Files**:

- `lib/actions/subscription-actions.ts` - `endTrialEarlyAction()` server action
- `app/(protected)/dashboard/components/upgrade-card.tsx` - Upgrade card component
- `app/(protected)/dashboard/low-credit-warning.tsx` - Updated with dual buttons
- `app/(protected)/dashboard/page.tsx` - Shows upgrade card for trial users

**How it Works**:

1. User clicks "Upgrade to Full Plan" button
2. Calls Stripe API: `stripe.subscriptions.update({ trial_end: 'now', proration_behavior: 'always_invoice' })`
3. Stripe charges payment method immediately
4. Webhook `customer.subscription.updated` fires with `status: 'active'`
5. Existing webhook handler allocates full plan credits (non-additive)
6. Page refreshes with success toast

**UI Components**:

- **Upgrade Card**: Shows trial status, dual buttons (Upgrade / Manage Subscription)
- **Low Credit Warning**: Updated with same dual-button pattern
- **Generic Messaging**: No specific credit amounts shown (e.g., "Upgrade now to unlock full plan usage")

**User Experience**:

- Trial users see upgrade card in dashboard
- When credits drop below $0.25, low credit warning appears
- Both components offer instant upgrade or portal access
- No plan switching required - upgrades current plan

### 3. Artifact Split View (Desktop 50/50)

**Enhanced**: Desktop users now see chat and artifact side-by-side instead of always using drawer overlay

**Files**:

- `app/(protected)/dashboard/chat/artifact-drawer.tsx` - Updated to support dual modes
- `app/(protected)/dashboard/chat/chat-interface.tsx` - Implements split layout
- `hooks/use-is-desktop.ts` - Custom hook for responsive detection

**Implementation**:

- `artifact-drawer.tsx` accepts `mode` prop: `'panel'` or `'drawer'`
- **Desktop (≥1024px)**: Panel mode (inline Card component, 50% width)
- **Mobile (<1024px)**: Drawer mode (Sheet overlay, full screen)
- Uses `useIsDesktop()` hook with media query: `(min-width: 1024px)`

**Layout**:

```typescript
// Desktop split view
{artifactDrawerOpen && isDesktop && (
  <div className="flex w-1/2">
    <ArtifactDrawer mode="panel" />
  </div>
)}

// Mobile overlay
{artifactDrawerOpen && !isDesktop && (
  <ArtifactDrawer mode="drawer" />
)}
```

**Features**:

- Chat area dynamically resizes (50% when artifact open, 100% when closed)
- Close button (X) in panel mode header
- Artifact closes when switching conversations
- Edit, download (MD/PDF), copy, test prompt actions available in both modes

### 4. Credit Precision Enhancement (6 Decimals)

**Updated**: Database schema changed from 2 to 6 decimal places for accurate micro-transaction tracking

**Database Changes**:

```sql
ALTER TABLE user_profiles
  ALTER COLUMN ai_credits_balance TYPE NUMERIC(10, 6),
  ALTER COLUMN ai_credits_allocated TYPE NUMERIC(10, 6),
  ALTER COLUMN ai_credits_used TYPE NUMERIC(10, 6);
```

**Code Changes** (`lib/db/queries/credits.queries.ts`):

- `deductAICredits()`: Uses `.toFixed(6)` instead of `.toFixed(2)`
- `setAICredits()`: Uses `.toFixed(6)` for balance and allocated
- `resetAICredits()`: Uses `.toFixed(6)` for all credit operations

**Why 6 Decimals**: OpenRouter API costs can be less than $0.01 per request (e.g., $0.000123), requiring precision for accurate billing

**Impact**: All credit operations now track costs to 6 decimal places (e.g., `0.000123` instead of `0.00`)

### 5. Prompt Conversion Script

**Added**: NPM script for converting markdown prompts to JSON without using UI

**File**: `scripts/convert-prompts.ts`

**Usage**:

```bash
pnpm prompts:convert
```

**Functionality**:

- Reads `.md` files from `prompts/markdown/`
- Converts to JSON format: `{ "content": "..." }`
- Saves to `prompts/json/`
- Auto-generates `prompts/json/index.ts` with exports

**Benefits**: CI/CD integration, batch processing, no UI interaction needed

### Summary of File Changes

**New Files** (5):

1. `lib/actions/subscription-actions.ts` - Early upgrade server action
2. `app/(protected)/dashboard/components/upgrade-card.tsx` - Trial upgrade UI
3. `lib/ai/artifact-detector.ts` - Customizable artifact detection
4. `hooks/use-is-desktop.ts` - Responsive detection hook

**Modified Files**:

1. `lib/db/queries/credits.queries.ts` - 6 decimal precision USD credits
2. `app/(protected)/dashboard/chat/artifact-drawer.tsx` - Split-view support
3. `app/(protected)/dashboard/chat/chat-interface.tsx` - Artifact integration
4. `app/(protected)/dashboard/low-credit-warning.tsx` - Dual button UI
