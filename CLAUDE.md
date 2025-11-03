# create-saas-app-ai-chat

## Project Overview

**create-saas-app-ai-chat** is a production-ready CLI tool that scaffolds a complete AI SaaS application with Next.js 15, Supabase authentication, Stripe subscriptions, and multi-model AI chat via OpenRouter.

### Quick Facts
- **Type**: CLI Package + Full-Stack SaaS Template
- **Version**: 1.0.1
- **License**: MIT
- **Author**: A1X6
- **Repository**: https://github.com/A1X6/create-saas-app-ai-chat

### What This Project Does
1. **CLI Tool** (root): Creates new SaaS projects with `npx create-saas-app-ai-chat my-project`
2. **Template** (template/): Complete AI SaaS application ready for production deployment

---

## Technology Stack

### Frontend
```
Next.js 15 (App Router, React Server Components)
React 19
TypeScript 5
Tailwind CSS 4
shadcn/ui (Radix UI primitives + Tailwind)
MagicUI (animated components)
Framer Motion (animations)
Three.js (@react-three/fiber, @react-three/drei) - 3D effects
Recharts 2.15.4 (usage analytics charts)
next-themes 0.4.6 (dark mode)
```

### Backend & Database
```
Next.js 15 API Routes (serverless functions)
Next.js Server Actions (type-safe mutations)
PostgreSQL (Neon via Supabase)
Drizzle ORM 0.43.1 (type-safe queries)
Drizzle Kit 0.31.1 (migrations)
```

### Authentication
```
Supabase Auth (latest)
@supabase/ssr (SSR-safe session management)
OAuth support (Google, GitHub, etc.)
PKCE flow for enhanced security
```

### Payments
```
Stripe 19.1.0 (subscriptions, checkout, webhooks)
Customer Portal (self-service subscription management)
Trial system (7-day monthly, 14-day yearly)
Credit-based billing (USD precision to 6 decimals)
```

### AI Integration
```
OpenRouter API (multi-model AI gateway)
OpenAI SDK 6.3.0 (client library)
gpt-tokenizer 3.2.0 (token estimation)
tiktoken 1.0.22 (token counting)
15+ AI models supported (Claude, Gemini, Llama, DeepSeek, etc.)
```

### Email & Communication
```
Resend 6.1.2 (transactional emails)
```

### Development Tools
```
Turbopack (fast dev server)
ESLint 9 (linting)
Prettier 3.6.2 (formatting)
TypeScript 5 (strict mode)
tsx 4.19.2 (TypeScript execution)
pnpm (package manager)
```

### UI Libraries
```
lucide-react 0.511.0 (icons)
class-variance-authority 0.7.1 (component variants)
tailwind-merge 3.3.0 (class merging)
clsx 2.1.1 (conditional classes)
sonner 2.0.7 (toast notifications)
```

---

## Project Structure

```
create-saas-app-ai-chat/
├── template/                    # The actual SaaS template
│   ├── app/                     # Next.js 15 App Router
│   │   ├── (marketing)/         # Public pages (route group)
│   │   │   ├── (legal)/         # Terms, Privacy
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── features/
│   │   │   ├── pricing/
│   │   │   ├── layout.tsx       # Marketing layout
│   │   │   └── page.tsx         # Homepage
│   │   ├── (protected)/         # Authenticated routes
│   │   │   └── dashboard/
│   │   │       ├── layout.tsx   # Dashboard layout + sidebar
│   │   │       ├── page.tsx     # Dashboard home
│   │   │       ├── chat/        # AI chat interface
│   │   │       └── account/     # User settings
│   │   ├── api/                 # API routes
│   │   │   ├── auth/callback/   # OAuth callback
│   │   │   ├── stripe/          # Checkout, webhooks
│   │   │   ├── conversations/   # Chat API
│   │   │   ├── contact/         # Contact form
│   │   │   └── cron/            # Scheduled jobs
│   │   ├── auth/                # Auth pages
│   │   │   ├── sign-in/
│   │   │   ├── sign-up/
│   │   │   ├── forgot-password/
│   │   │   └── update-password/
│   │   ├── setup/               # Dev-only setup wizard
│   │   │   ├── database/
│   │   │   ├── environment/
│   │   │   ├── prompts/
│   │   │   ├── stripe/
│   │   │   └── finalize/
│   │   ├── layout.tsx           # Root layout
│   │   ├── sitemap.ts           # SEO sitemap
│   │   └── robots.ts            # SEO robots.txt
│   │
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui base components
│   │   ├── magicui/             # Animated components
│   │   ├── home/                # Homepage components
│   │   ├── dashboard/           # Dashboard components
│   │   ├── chat/                # Chat interface
│   │   ├── auth/                # Auth forms
│   │   ├── pricing/             # Pricing page
│   │   ├── features/            # Features page
│   │   ├── contact/             # Contact page
│   │   ├── about/               # About page
│   │   ├── setup/               # Setup wizard
│   │   ├── header/              # Navigation
│   │   ├── footer/              # Footer
│   │   └── theme/               # Theme provider
│   │
│   ├── lib/                     # Business logic
│   │   ├── db/                  # Database
│   │   │   ├── schema.ts        # Drizzle schema
│   │   │   ├── index.ts         # DB client
│   │   │   ├── queries.ts       # Query functions
│   │   │   └── migrations/      # SQL migrations
│   │   ├── supabase/            # Supabase clients
│   │   │   ├── server.ts        # Server-side client
│   │   │   ├── client.ts        # Browser client
│   │   │   └── middleware.ts    # Session management
│   │   ├── payments/            # Stripe integration
│   │   │   ├── stripe.ts        # Main export
│   │   │   ├── stripe-client.ts # SDK init
│   │   │   ├── checkout.ts      # Checkout sessions
│   │   │   ├── portal.ts        # Customer portal
│   │   │   ├── products.ts      # Products/prices
│   │   │   ├── webhooks.ts      # Event handlers
│   │   │   └── actions.ts       # Server actions
│   │   ├── ai/                  # AI integration
│   │   │   ├── openrouter.ts    # OpenRouter API
│   │   │   ├── models.ts        # Model definitions
│   │   │   ├── context-manager.ts # Context window mgmt
│   │   │   └── artifact-detector.ts # Code detection
│   │   ├── actions/             # Server actions
│   │   │   ├── auth-actions.ts
│   │   │   ├── chat-actions.ts
│   │   │   ├── conversation-actions.ts
│   │   │   ├── stripe-actions.ts
│   │   │   └── [more actions]
│   │   └── utils.ts             # Utilities
│   │
│   ├── hooks/                   # React hooks
│   │   └── use-*.ts
│   │
│   ├── types/                   # TypeScript types
│   │   └── *.ts
│   │
│   ├── prompts/                 # AI system prompts
│   │   ├── *.json               # JSON format
│   │   └── *.md                 # Markdown format
│   │
│   ├── public/                  # Static assets
│   │   └── images/
│   │
│   ├── scripts/                 # Build scripts
│   │   ├── capture-screenshots.ts
│   │   └── convert-prompts.ts
│   │
│   ├── middleware.ts            # Next.js middleware
│   ├── next.config.ts           # Next.js config
│   ├── drizzle.config.ts        # Drizzle config
│   ├── tsconfig.json            # TypeScript config
│   ├── tailwind.config.ts       # Tailwind config
│   ├── package.json             # Dependencies
│   └── .env.example             # Env variables template
│
├── index.js                     # CLI entry point
├── package.json                 # CLI package.json
└── README.md                    # CLI readme
```

---

## Database Schema (Drizzle ORM)

### Tables

#### `user_profiles`
Extends Supabase `auth.users` with application-specific data.

```typescript
{
  id: UUID (primary key, refs auth.users)
  name: varchar(100)
  createdAt, updatedAt: timestamp

  // Stripe subscription
  stripeCustomerId: text (unique)
  stripeSubscriptionId: text (unique)
  stripeProductId: text
  planName: varchar(50)
  subscriptionStatus: varchar(20)  // 'trialing', 'active', 'canceled', etc.

  // AI Credits (USD-based, 6 decimal precision)
  aiCreditsBalance: numeric(10,6)    // Current balance
  aiCreditsAllocated: numeric(10,6)  // Monthly allocation from plan
  aiCreditsUsed: numeric(10,6)       // Total used this period
}
```

#### `chat_conversations`
User chat sessions.

```typescript
{
  id: UUID (primary key)
  userId: UUID (refs user_profiles)
  title: varchar(255)  // First few words of first message
  createdAt, updatedAt: timestamp
}
```

#### `chat_messages`
Individual messages in conversations.

```typescript
{
  id: UUID (primary key)
  conversationId: UUID (refs chat_conversations)
  role: varchar(20)           // 'user' or 'assistant'
  content: text
  model: varchar(100)         // AI model used
  tokensUsed: integer         // LEGACY: display only
  costInDollars: numeric(10,6) // LEGACY: display only
  isArtifact: boolean         // True if contains code/artifact
  createdAt: timestamp
}
```

#### `token_usage_logs`
Permanent token tracking (survives conversation deletion).

```typescript
{
  id: UUID (primary key)
  userId: UUID (refs user_profiles)

  // Token counts
  inputTokens: integer
  outputTokens: integer
  totalTokens: integer

  // Costs (separate input/output rates)
  inputCost: numeric(10,6)
  outputCost: numeric(10,6)
  totalCost: numeric(10,6)

  model: varchar(100)
  timestamp: timestamp
}
```

#### `activity_logs`
Audit trail for user actions.

```typescript
{
  id: UUID (primary key)
  userId: UUID (refs user_profiles)
  action: text  // See ActivityType enum
  timestamp: timestamp
  ipAddress: varchar(45)
}
```

### Activity Types
```typescript
enum ActivityType {
  SIGN_UP, SIGN_IN, SIGN_OUT,
  UPDATE_PASSWORD, UPDATE_ACCOUNT,
  SUBSCRIPTION_CREATED, SUBSCRIPTION_UPDATED, SUBSCRIPTION_CANCELED
}
```

---

## Key Features & Implementation

### 1. Authentication (Supabase)

**Files:**
- `lib/supabase/server.ts` - Server-side Supabase client
- `lib/supabase/client.ts` - Browser Supabase client
- `lib/supabase/middleware.ts` - Session management
- `middleware.ts` - Next.js middleware

**Flow:**
1. User signs up/in via Server Actions (`lib/actions/auth-actions.ts`)
2. Supabase creates `auth.users` record
3. Middleware checks/refreshes session on every request
4. Protected routes redirect if no session
5. `getUser()` retrieves auth + profile data

**Important:**
- PKCE flow for OAuth (enhanced security)
- Session stored in HTTP-only cookies
- Automatic session refresh in middleware
- Profile created in `user_profiles` after signup

---

### 2. Subscription System (Stripe)

**Architecture:**
- Trial-based model (7-day monthly / 14-day yearly)
- Credit-based usage (USD precision to 6 decimals)
- Self-service management via Customer Portal
- Automatic credit reset on subscription renewal

**Files:**
- `lib/payments/stripe-client.ts` - Stripe SDK init
- `lib/payments/checkout.ts` - Create checkout sessions
- `lib/payments/portal.ts` - Customer portal URL
- `lib/payments/products.ts` - Fetch products/prices
- `lib/payments/webhooks.ts` - Webhook handlers
- `lib/payments/actions.ts` - Payment server actions
- `app/api/stripe/checkout/route.ts` - Checkout endpoint
- `app/api/stripe/webhook/route.ts` - Webhook endpoint

**Webhook Events:**
- `checkout.session.completed` - First payment
  - Creates/updates user profile
  - Sets subscription status
  - Allocates trial credits ($1) or plan credits
- `customer.subscription.updated` - Plan changes
  - Updates subscription status
  - Resets credits if billing cycle renewed
- `customer.subscription.deleted` - Cancellation
  - Sets status to 'canceled'

**Product Metadata:**
```json
{
  "ai_credits_amount": "50.00"  // USD credits per billing cycle
}
```

**Trial Logic:**
- New subscribers get trial status
- Trial users get $1 credit
- Can upgrade early without waiting for trial end
- Trial converts to 'active' on first payment

**Credit Management:**
- Credits stored as USD (6 decimal places)
- Deducted based on actual API cost from OpenRouter
- Monthly reset via cron job (`api/cron/reset-yearly-credits`)
- Low credit warnings at < $0.25 for trial users

---

### 3. AI Chat (OpenRouter)

**Multi-Model Support:**
15+ models including Claude, Gemini, Llama, DeepSeek, Mistral, etc.

**Files:**
- `lib/ai/openrouter.ts` - OpenRouter API client
- `lib/ai/models.ts` - Model definitions (pricing, limits)
- `lib/ai/context-manager.ts` - Context window management
- `lib/ai/artifact-detector.ts` - Code block detection
- `lib/actions/chat-actions.ts` - Send message action
- `lib/prompts/` - System prompts (JSON + MD)

**Flow (`sendChatAction`):**
1. Validate user authentication
2. Check subscription status & credits
3. Validate message (max 2000 chars)
4. Create/get conversation
5. Build message history + system prompt
6. Apply context management (auto-summarization)
7. Call OpenRouter API
8. Detect artifacts (code blocks)
9. Deduct credits from balance
10. Save message + token usage
11. Return response with metadata

**Context Management:**
- Tracks total tokens in conversation
- Auto-summarizes when approaching model's max tokens
- Preserves recent messages, summarizes older ones
- Uses same model for summarization

**Artifact Detection:**
- Detects code blocks in AI responses
- Marks messages with `isArtifact: true`
- Desktop: 50/50 split view
- Mobile: Drawer overlay

**Token Estimation:**
- Uses character-based estimation (1 token ≈ 3.5 chars)
- Actual tokens returned from OpenRouter API
- Separate tracking for input/output tokens
- Precise cost calculation from API response

**Cost Tracking:**
```typescript
{
  inputTokens: number,
  outputTokens: number,
  totalTokens: number,
  inputCost: USD (6 decimals),
  outputCost: USD (6 decimals),
  totalCost: USD (6 decimals)
}
```

---

### 4. Setup Wizard (Dev Only)

**Purpose:** Interactive setup for new projects

**Access:** `/setup` (only in development mode)

**Steps:**
1. **Database** - Test connection, run migrations
2. **Environment** - Configure `.env.local`
3. **Prompts** - Set AI system prompts
4. **Stripe** - Sync products, configure webhooks
5. **Finalize** - Complete setup

**Middleware Protection:**
- Only accessible in `NODE_ENV=development`
- Redirects to `/` if `SETUP_COMPLETE=true`
- Can force access with `?force=true` query param
- Redirects home page to `/setup` if not complete

---

### 5. Component Organization

**shadcn/ui Components:**
Located in `components/ui/`, these are base components:
- `button.tsx`, `input.tsx`, `card.tsx`, `dialog.tsx`
- `sidebar.tsx`, `sheet.tsx`, `tabs.tsx`, `select.tsx`
- `chart.tsx` (Recharts wrapper)
- `conversation.tsx`, `response.tsx` (chat-specific)

**MagicUI Components:**
Located in `components/magicui/`, animated components:
- `animated-gradient-text.tsx`
- `shimmer-button.tsx`
- `number-ticker.tsx`
- `text-animate.tsx`

**Feature Components:**
Organized by page/feature:
- `home/` - Homepage components (Plasma, SpotlightCard)
- `dashboard/` - Dashboard-specific components
- `chat/` - Chat interface, artifact cards
- `auth/` - Login/signup forms
- `pricing/`, `features/`, `contact/`, `about/` - Marketing pages

**Philosophy:**
- Co-locate components with their features
- Separate base UI components from feature components
- Use "use client" directive only when needed
- Prefer Server Components by default

---

## API Routes

### Authentication
- `POST /api/auth/callback` - OAuth callback handler

### Stripe
- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/webhook` - Handle Stripe webhooks

### Chat
- `GET /api/conversations` - List user conversations
- `GET /api/conversations/[id]` - Get conversation + messages
- `POST /api/conversations` - Create new conversation
- `DELETE /api/conversations/[id]` - Delete conversation

### Other
- `POST /api/contact` - Contact form submission
- `GET /api/health` - Health check
- `GET /api/cron/reset-yearly-credits` - Scheduled credit reset

---

## Server Actions

**Location:** `lib/actions/`

**Authentication:**
- `signInAction()` - Email/password sign in
- `signUpAction()` - Create new account
- `signOutAction()` - Sign out
- `resetPasswordAction()` - Send reset email
- `updatePasswordAction()` - Change password

**Chat:**
- `sendChatAction()` - Send message to AI
- `createConversationAction()` - Create new conversation
- `deleteConversationAction()` - Delete conversation

**Payments:**
- `createCheckoutAction()` - Create Stripe checkout
- `createPortalAction()` - Open customer portal
- `cancelSubscriptionAction()` - Cancel subscription

**Setup:**
- `checkDatabaseAction()` - Test DB connection
- `saveEnvironmentAction()` - Save .env.local
- `syncStripeAction()` - Sync Stripe products
- `finalizeSetupAction()` - Complete setup

---

## Environment Variables

**Required:**
```env
# Environment
NODE_ENV=development|production

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=postgresql://...

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# App Config
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SUPPORT_EMAIL=support@example.com

# Email (Resend)
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_TO_EMAIL=

# AI (OpenRouter)
OPENROUTER_API_KEY=
AI_TEMPERATURE=0.7

# Cron Jobs
CRON_SECRET=

# Setup Status
SETUP_COMPLETE=true|false
```

**Social Links (Optional):**
```env
NEXT_PUBLIC_TWITTER_URL=
NEXT_PUBLIC_LINKEDIN_URL=
NEXT_PUBLIC_GITHUB_URL=
```

---

## Development Workflow

### Initial Setup
```bash
npx create-saas-app-ai-chat my-project
cd my-project
pnpm install
```

### Environment Configuration
1. Copy `.env.example` to `.env.local`
2. Add Supabase credentials (URL, anon key, service role key)
3. Add DATABASE_URL (from Supabase > Project Settings > Database)
4. Add Stripe credentials (secret key, publishable key)
5. Add OpenRouter API key
6. Add Resend API key

### Database Setup
```bash
pnpm db:push          # Push schema to database
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Drizzle Studio
```

### Stripe Setup
1. Create products in Stripe Dashboard
2. Add product metadata: `{"ai_credits_amount": "50.00"}`
3. Configure webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
4. Add webhook events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
5. Copy webhook secret to `.env.local`

### Development
```bash
pnpm dev              # Start dev server (Turbopack)
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
```

### Scripts
```bash
pnpm screenshots:capture  # Capture UI screenshots (Playwright)
pnpm prompts:convert      # Convert prompts between JSON/MD
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] Set all environment variables in production
- [ ] Configure Supabase production instance
- [ ] Set up Stripe webhook in production mode
- [ ] Configure custom domain
- [ ] Set `SETUP_COMPLETE=true`
- [ ] Set `NODE_ENV=production`
- [ ] Test authentication flow
- [ ] Test payment flow
- [ ] Test AI chat functionality

### Vercel Deployment
1. Connect GitHub repository
2. Configure environment variables
3. Deploy
4. Configure custom domain
5. Update Stripe webhook URL
6. Update Supabase redirect URLs

### Database Migrations
```bash
pnpm db:generate      # Generate migration files
pnpm db:migrate       # Apply migrations
```

---

## Key Architectural Decisions

### 1. Route Groups
Uses Next.js route groups `(marketing)` and `(protected)` to organize routes without affecting URLs.

### 2. Server Actions
Prefers Server Actions over API routes for mutations (better DX, type safety).

### 3. Server Components by Default
Uses React Server Components by default, "use client" only when needed.

### 4. USD-Based Credits
Credits stored as USD (6 decimals) for precise cost tracking, not arbitrary token counts.

### 5. Separate Token Logging
`token_usage_logs` table persists usage data even after conversations are deleted.

### 6. Artifact Detection
AI responses with code blocks displayed in split view (desktop) or drawer (mobile).

### 7. Context Management
Auto-summarization when approaching token limits to maintain conversation flow.

### 8. Trial System
New subscribers start with trial status, get $1 credit, can upgrade early.

### 9. Setup Wizard
Dev-only setup wizard simplifies initial configuration.

### 10. Type Safety
Drizzle ORM + TypeScript for end-to-end type safety.

---

## Common Tasks

### Adding a New AI Model
1. Add model to `lib/ai/models.ts`
2. Update model selection UI in chat interface
3. Test token estimation accuracy
4. Verify cost calculation

### Modifying Subscription Plans
1. Update Stripe products in Dashboard
2. Update product metadata (`ai_credits_amount`)
3. Sync products via setup wizard or manually
4. Test checkout flow

### Customizing System Prompts
1. Edit files in `prompts/` directory
2. Use JSON format (preferred) or Markdown
3. Restart dev server to reload prompts
4. Test AI responses

### Adding a New Page
1. Create route in `app/` directory
2. Create components in `components/[page-name]/`
3. Add navigation link in `components/header/Header.tsx`
4. Update sitemap in `app/sitemap.ts`

### Updating Database Schema
1. Edit `lib/db/schema.ts`
2. Run `pnpm db:push` (dev) or `pnpm db:generate` + `pnpm db:migrate` (prod)
3. Update types if needed
4. Test migrations

---

## Troubleshooting

### Setup Not Completing
- Check `SETUP_COMPLETE` in `.env.local`
- Verify all environment variables
- Check console for errors
- Try `/setup?force=true`

### Stripe Webhooks Not Working
- Verify webhook secret matches
- Check webhook URL is correct
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Check webhook event types

### Database Connection Errors
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Test connection in setup wizard
- Check IP allowlist in Supabase

### AI Chat Not Working
- Verify OPENROUTER_API_KEY is set
- Check model availability on OpenRouter
- Verify user has subscription + credits
- Check console for API errors

### Credits Not Deducting
- Check `aiCreditsBalance` in database
- Verify webhook events are firing
- Check `token_usage_logs` for entries
- Test credit deduction in chat action

---

## Security Considerations

### Authentication
- PKCE flow for OAuth (enhanced security)
- HTTP-only cookies for sessions
- Server-side session validation
- Automatic session refresh

### API Keys
- Never expose service role key client-side
- Use environment variables
- Rotate keys regularly
- Use different keys for dev/prod

### Database
- Row Level Security (RLS) in Supabase
- Server-side query validation
- Type-safe queries with Drizzle
- Prepared statements prevent SQL injection

### Payments
- Webhook signature verification
- Idempotency for webhook events
- Server-side price validation
- Secure checkout sessions

### AI
- User credit limits
- Message length validation
- Rate limiting (implement if needed)
- Content filtering (implement if needed)

---

## Performance Optimizations

### Next.js
- Turbopack for fast dev server
- Image optimization (AVIF, WebP)
- Font optimization
- Tree-shaking for lucide-react, Radix UI, etc.

### Database
- Indexed foreign keys
- Efficient queries with Drizzle
- Connection pooling via Neon

### AI
- Context summarization reduces tokens
- Character-based estimation before API call
- Streaming responses for better UX

### Frontend
- Code splitting by route
- Lazy loading for charts
- Optimized images
- CSS bundling with Tailwind

---

## Testing Strategy

### Manual Testing
- Authentication flows
- Payment flows
- AI chat functionality
- Subscription management
- Setup wizard

### Automated Testing (TODO)
- Unit tests for utilities
- Integration tests for Server Actions
- E2E tests for critical flows (Playwright)
- API route tests

---

## Monitoring & Logging

### Current Logging
- `activity_logs` table for user actions
- `token_usage_logs` for AI usage
- Console logs in development
- Stripe webhook logs

### Recommended Additions
- Error tracking (Sentry, LogRocket)
- Performance monitoring (Vercel Analytics)
- User analytics (PostHog, Mixpanel)
- Uptime monitoring (Better Uptime)

---

## Maintenance

### Regular Tasks
- Update dependencies (`pnpm update`)
- Review Stripe webhook logs
- Monitor credit usage patterns
- Check error logs
- Review user feedback

### Security Updates
- Update Next.js regularly
- Update Supabase client libraries
- Update Stripe SDK
- Monitor security advisories

---

## Contributing

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- 2 spaces indentation
- Max 80-100 chars per line

### Commit Messages
- Conventional Commits format
- `feat:`, `fix:`, `docs:`, `chore:`, etc.

### Pull Requests
- Describe changes clearly
- Include screenshots for UI changes
- Test all affected flows
- Update documentation

---

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [OpenRouter Docs](https://openrouter.ai/docs)

### Support
- GitHub Issues: https://github.com/A1X6/create-saas-app-ai-chat/issues
- Email: support@example.com (configure in .env)

---

## License

MIT License - See LICENSE file for details

---

## Memory MCP - Project Context

**Store in Memory:**
```
Project: create-saas-app-ai-chat
Type: CLI + AI SaaS Template
Stack: Next.js 15 + Supabase + Stripe + OpenRouter
Database: PostgreSQL via Neon (Drizzle ORM)
Auth: Supabase (PKCE flow)
Payments: Stripe (subscription-based, trial system)
AI: OpenRouter (15+ models, credit-based)
Package Manager: pnpm
Version: 1.0.1
```

**Key Decisions:**
```
- Using Server Actions for mutations (not API routes)
- USD-based credits (6 decimal precision)
- Trial system: 7-day monthly / 14-day yearly with $1 credit
- Context auto-summarization for long conversations
- Artifact detection for code blocks
- Setup wizard dev-only (middleware-protected)
- Route groups for organization
- Server Components by default
```

**Important Files:**
```
template/lib/db/schema.ts - Database schema
template/lib/actions/chat-actions.ts - AI chat logic
template/lib/payments/webhooks.ts - Stripe webhooks
template/middleware.ts - Auth + setup protection
template/app/(protected)/dashboard/chat/page.tsx - Chat UI
```

---

## TODO Tracking with Memory

**Current TODOs:**
```
[TODO] Add automated testing (unit, integration, E2E)
[TODO] Implement rate limiting for AI API
[TODO] Add content filtering/moderation
[TODO] Set up error tracking (Sentry)
[TODO] Add user analytics (PostHog)
[TODO] Optimize bundle size
[TODO] Add internationalization (i18n)
[TODO] Implement team/organization features
```

---

## Notes

- This is a **production-ready** template, not a starter
- The CLI creates a copy of the template for new projects
- Setup wizard only runs in development mode
- All payments handled server-side for security
- Credits are USD-based for precise cost tracking
- OpenRouter provides unified API for multiple AI models
- Drizzle ORM provides full type safety end-to-end
