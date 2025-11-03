# AI SaaS Template

A production-ready AI SaaS starter template providing unified access to 15+ AI models (Claude, Gemini, Llama, DeepSeek, and more) through OpenRouter. Built with Next.js 15 with authentication, subscriptions, credits, and a complete dashboard - ready to customize for your AI product.

## Key Features

### AI Chat & Model Access

- **Multi-Model Support**: Access 15+ AI models through a single unified interface via OpenRouter
- **Intelligent Context Management**: Automatic conversation summarization when approaching token limits
- **Streaming Responses**: Real-time AI responses with server-sent events
- **Model Switching**: Change AI models mid-conversation without losing context
- **Token Tracking**: Detailed input/output token counts and cost breakdowns

### User Features

- **Conversation Management**: Organize chats, rename conversations, and delete old threads
- **Artifact System**: Customizable split-view display for AI-generated content (50/50 on desktop, overlay on mobile)
- **Usage Analytics**: Track token consumption and costs with interactive charts
- **Responsive Design**: Desktop and mobile-optimized interface

### Subscription & Billing

- **Trial Period**: 7-day trial for monthly plans, 14-day trial for yearly plans with $1 credit
- **Early Upgrade**: Convert from trial to paid subscription instantly without waiting for trial to end
- **Flexible Plans**: Multiple subscription tiers with different credit allocations
- **Stripe Integration**: Secure payment processing with customer portal for subscription management
- **Credit System**: USD-based credits (6 decimal precision) deducted based on actual API costs
- **Automatic Reset**: Monthly credit reset on subscription anniversary, yearly via cron job

### Developer Experience

- **Setup Wizard**: Interactive setup flow for environment configuration (development mode)
- **Type Safety**: Full TypeScript coverage with Drizzle ORM type inference
- **Modern Stack**: Next.js 15 App Router, React 19, Turbopack dev mode
- **Database Migrations**: Version-controlled schema changes with Drizzle migrations
- **Activity Logging**: Comprehensive audit trail for user actions

## Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router and Server Components
- **React 19** - UI library with concurrent features
- **TypeScript 5** - Static type checking
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Customizable UI components built on Radix UI
- **magicui** - Advanced animated components for marketing
- **Recharts** - Interactive usage analytics charts
- **Three.js** - 3D WebGL plasma background effect

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Server Actions** - Type-safe server-side mutations
- **OpenRouter** - Multi-model AI API aggregator
- **Stripe** - Payment processing and subscription management
- **Resend** - Transactional email service

### Database & Authentication

- **Supabase** - PostgreSQL database and authentication
- **Drizzle ORM** - Type-safe database queries and migrations
- **Neon** - Serverless PostgreSQL (via Supabase)

### Development Tools

- **Turbopack** - Fast development bundler
- **ESLint** - Code linting
- **Prettier** - Code formatting (via ESLint integration)
- **pnpm** - Fast, disk-space efficient package manager

## Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **pnpm** 8.0 or later (`npm install -g pnpm`)
- **Supabase Account** - [supabase.com](https://supabase.com)
- **Stripe Account** - [stripe.com](https://stripe.com)
- **OpenRouter API Key** - [openrouter.ai](https://openrouter.ai)
- **Resend API Key** - [resend.com](https://resend.com) (optional, for contact form)

### Installation

1. **Create a new project**

   ```bash
   npx create-saas-app-ai-chat my-saas-app
   cd my-saas-app
   ```

2. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables** (see [Environment Setup](#environment-setup) below)

5. **Run the setup wizard** (development mode only)
   ```bash
   pnpm dev
   ```
   Navigate to `http://localhost:3000` and follow the interactive setup flow.

### Environment Setup

Required environment variables in `.env.local`:

```env
# Supabase (Database & Authentication)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_supabase_database_connection_string

# Stripe (Payments & Subscriptions)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# OpenRouter (AI Models)
OPENROUTER_API_KEY=your_openrouter_api_key
AI_TEMPERATURE=0.7

# Email (Contact Form - Optional)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_TO_EMAIL=contact@yourdomain.com

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
SETUP_COMPLETE=false

# Cron Jobs (Production)
CRON_SECRET=your_random_secret_string
```

### Database Setup

#### Option 1: Using Setup Wizard (Recommended for Development)

1. Set `SETUP_COMPLETE=false` in `.env.local`
2. Run `pnpm dev`
3. Navigate to `http://localhost:3000`
4. Follow the setup wizard through all 5 steps
5. The wizard will automatically push the database schema

#### Option 2: Manual Setup

1. **Generate migration files** (after schema changes)

   ```bash
   pnpm db:generate
   ```

2. **Apply migrations**

   ```bash
   pnpm db:migrate
   ```

3. **Quick push** (development only, skips migrations)

   ```bash
   pnpm db:push
   ```

4. **Open Drizzle Studio** (database GUI)
   ```bash
   pnpm db:studio
   ```

### Stripe Configuration

#### 1. Create Products & Prices

In your Stripe Dashboard, create subscription products with the following metadata:

**Product Metadata:**

- `ai_credits_amount`: Amount in USD (e.g., "10.00" for $10)

**Example Products:**

- **Basic Plan (Monthly)**: $9/month, `ai_credits_amount: "10.00"`
- **Pro Plan (Monthly)**: $29/month, `ai_credits_amount: "35.00"`
- **Basic Plan (Yearly)**: $90/year, `ai_credits_amount: "120.00"`
- **Pro Plan (Yearly)**: $290/year, `ai_credits_amount: "420.00"`

#### 2. Configure Webhook

1. Go to **Developers > Webhooks** in Stripe Dashboard
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in `.env.local`

#### 3. Test Webhook Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Development Workflow

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server with Turbopack (http://localhost:3000)

# Build & Production
pnpm build            # Create production build
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint

# Database (Drizzle ORM)
pnpm db:generate      # Generate migration files from schema changes
pnpm db:migrate       # Apply migrations to database
pnpm db:push          # Push schema directly (dev only, skips migrations)
pnpm db:studio        # Open Drizzle Studio UI (database GUI)

# Utilities
pnpm screenshots:capture  # Capture OpenGraph images
```

### Database Workflow

1. **Modify schema**: Edit `lib/db/schema.ts`
2. **Generate migration**: `pnpm db:generate` (creates timestamped SQL in `lib/db/migrations/`)
3. **Apply migration**: `pnpm db:migrate` (applies to `DATABASE_URL`)
4. **Quick dev push**: `pnpm db:push` (bypasses migrations, use sparingly)

### Adding a New AI Model

1. Edit `lib/ai/models.json`
2. Add model definition with pricing:
   ```json
   {
     "id": "anthropic/claude-3.5-sonnet",
     "name": "Claude 3.5 Sonnet",
     "provider": "Anthropic",
     "type": "paid",
     "contextWindow": 200000,
     "maxTokens": 8192,
     "inputCostPer1M": 3.0,
     "outputCostPer1M": 15.0,
     "description": "Most intelligent model"
   }
   ```
3. Model will be auto-loaded by `lib/ai/models.ts`

### Creating a New API Route

1. Create file: `app/api/[route]/route.ts`
2. Export HTTP method handlers:
   ```typescript
   export async function GET(request: Request) {
     // Handler logic
     return NextResponse.json({ data });
   }
   ```
3. Use `getUser()` for authentication
4. Return `NextResponse.json()` with proper status codes

## Project Structure

```
my-saas-app/
├── app/                          # Next.js App Router
│   ├── (marketing)/             # Public pages (/, /pricing, /features)
│   │   └── (legal)/            # Legal pages (/privacy, /terms)
│   ├── (protected)/            # Auth-protected routes
│   │   └── dashboard/          # User dashboard
│   │       ├── page.tsx        # Dashboard home
│   │       ├── chat/           # AI chat interface
│   │       ├── account/        # Account settings
│   │       ├── prompts/        # Saved prompts
│   │       ├── test-prompt/    # Test prompt sandbox
│   │       └── components/     # Dashboard components
│   ├── auth/                   # Authentication flows
│   ├── setup/                  # Setup wizard (dev only)
│   └── api/                    # API routes
│       ├── auth/               # Auth callback
│       ├── conversations/      # Chat CRUD
│       ├── prompts/            # Saved prompts CRUD
│       ├── stripe/             # Stripe webhooks & checkout
│       ├── cron/               # Scheduled jobs
│       ├── health/             # Health check
│       └── contact/            # Contact form
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   ├── magicui/                # Animated components
│   └── dashboard/              # Dashboard components
├── lib/                        # Core library code
│   ├── actions/                # Server actions
│   ├── ai/                     # AI integration
│   │   ├── openrouter.ts      # OpenRouter client
│   │   ├── models.ts/json     # Model definitions
│   │   └── context-manager.ts # Context window management
│   ├── db/                     # Database layer
│   │   ├── schema.ts          # Drizzle schema
│   │   ├── queries/           # Query functions
│   │   └── migrations/        # SQL migrations
│   ├── payments/               # Stripe integration
│   ├── prompts/                # System prompts
│   ├── supabase/               # Supabase clients
│   └── utils/                  # Shared utilities
├── prompts/                    # System prompt JSON files
├── public/                     # Static assets
├── .env.local                  # Environment variables (create from .env.example)
├── drizzle.config.ts          # Drizzle ORM configuration
├── middleware.ts              # Next.js middleware (auth, session refresh)
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── CLAUDE.md                  # Claude Code developer guide
└── README.md                  # This file
```

## Key Features Explained

### Context Window Management

The app automatically manages token limits to prevent context overflow:

1. **Token Estimation**: Uses `gpt-tokenizer` for accurate token counts
2. **Smart Summarization**: When conversation reaches 70% of model's max tokens:
   - Keeps last 10 messages (recent context)
   - Summarizes older messages using the same AI model
   - Replaces old messages with summary (reduces tokens significantly)
3. **Model-Specific Limits**: Each model has its own context window defined in `models.json`

### Credit System

**Unsubscribed Users:**

- Cannot access AI features
- Must subscribe to use the service
- Redirected to pricing page

**Trial Users** (`subscriptionStatus: 'trialing'`):

- $1.00 trial credit upon subscription
- 7-day trial (monthly) or 14-day trial (yearly)
- Low credit warning at $0.25 remaining
- Can upgrade early to receive full plan credits immediately

**Paid Users** (`subscriptionStatus: 'active'`):

- Credits allocated based on Stripe product metadata (`ai_credits_amount`)
- Deducted based on actual OpenRouter API costs
- Monthly reset on subscription anniversary
- Yearly reset via cron job

### Token Tracking

All AI usage is logged to `token_usage_logs` table with:

- Separate input/output token counts
- Input/output/total costs (6 decimal precision)
- Model used and timestamp
- Survives conversation deletion (audit trail)

### Artifact System

Split-view display for generated content:

- **Desktop (≥1024px)**: 50/50 split view (chat | artifact)
- **Mobile (<1024px)**: Overlay with tabs
- Responsive grid with automatic breakpoint handling
- Markdown rendering with syntax highlighting

### Early Trial Upgrade

Trial users can upgrade to their current plan immediately:

1. Click "Upgrade to Full Plan" button
2. Triggers `endTrialEarlyAction()` server action
3. Calls Stripe API with `trial_end: 'now'`
4. Charges payment method immediately
5. Status changes from 'trialing' to 'active'
6. Credits reset to full plan amount

## Deployment

### Vercel (Recommended)

1. **Connect repository**
   - Import project in Vercel dashboard
   - Connect GitHub/GitLab/Bitbucket

2. **Configure environment variables**
   - Add all variables from `.env.local`
   - Set `SETUP_COMPLETE=true`
   - Add `CRON_SECRET` for scheduled functions

3. **Configure cron jobs**

   Create `vercel.json` in project root:

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

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Docker

1. **Build image**

   ```bash
   docker build -t my-saas-app .
   ```

2. **Run container**

   ```bash
   docker run -p 3000:3000 --env-file .env.local my-saas-app
   ```

3. **Docker Compose** (with PostgreSQL)
   ```bash
   docker-compose up -d
   ```

### Google Cloud Run

1. **Build and push image**

   ```bash
   gcloud builds submit --tag gcr.io/PROJECT-ID/my-saas-app
   ```

2. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy my-saas-app \
     --image gcr.io/PROJECT-ID/my-saas-app \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars="NODE_ENV=production,SETUP_COMPLETE=true" \
     --set-secrets="DATABASE_URL=database-url:latest"
   ```

## Scheduled Jobs (Cron)

### Yearly Credit Reset

**Endpoint:** `/api/cron/reset-yearly-credits`

**Purpose:** Reset AI credits for yearly subscription users on their anniversary date

**Schedule:** Monthly (1st of every month at 00:00 UTC)

**Cron Expression:** `0 0 1 * *`

**Security:** Requires `x-cron-secret` header matching `CRON_SECRET` environment variable

**Setup on Vercel:**

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

## Security Considerations

### Authentication

- Supabase Auth with session-based authentication
- Middleware refreshes sessions on every request
- Protected routes check for valid user session
- Activity logging for security audit trail

### API Security

- Stripe webhook signature verification
- Cron job authentication via secret header
- Server actions validate user authentication
- Environment variables never exposed to client

### Credit System

- All costs deducted server-side (never trust client)
- Token usage logged permanently (audit trail)
- Stripe handles payment processing (PCI compliant)
- Webhook events validate subscription status

### Data Privacy

- User data isolated by user ID (row-level filtering)
- Passwords hashed by Supabase Auth
- Activity logs track user actions
- GDPR-compliant data handling

## Troubleshooting

### Setup Wizard Not Appearing

**Solution:** Ensure `SETUP_COMPLETE=false` and `NODE_ENV=development` in `.env.local`

### Database Connection Errors

**Check:**

1. `DATABASE_URL` format: `postgresql://user:password@host:PORT/database`
2. Supabase project is not paused
3. Database pooler is enabled (use pooler URL)
4. IP allowlist if using restricted access

### Stripe Webhook Failures

**Debug:**

1. Check webhook signing secret matches `.env.local`
2. Verify webhook endpoint is accessible (use Stripe CLI for local testing)
3. Check webhook logs in Stripe Dashboard
4. Ensure all required events are subscribed

### OpenRouter API Errors

**Common issues:**

1. Invalid API key
2. Insufficient credits in OpenRouter account
3. Model not available or deprecated
4. Rate limiting (429 errors)

### Credit Not Deducting

**Check:**

1. Token usage logs are being created (`token_usage_logs` table)
2. `deductAICredits()` function is called after AI response
3. User has `aiCreditsBalance > 0`
4. Webhook processed subscription correctly

## Support

For questions or issues:

- **Documentation:** Check `CLAUDE.md` for developer guide
- **GitHub Issues:** Report bugs or feature requests
- **Contact Form:** Use in-app contact form on marketing site

## License

[Add your license here]

## Acknowledgments

Built with:

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Stripe](https://stripe.com/) - Payment processing
- [OpenRouter](https://openrouter.ai/) - Multi-model AI API
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
