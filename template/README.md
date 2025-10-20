# SaaS Complete

A production-ready Next.js 15 SaaS starter template with **guided setup wizard**. Get your SaaS up and running in minutes with automated configuration, database setup, and Stripe integration.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-green)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Subscriptions-purple)](https://stripe.com/)

---

## ✨ Features

- 🧙‍♂️ **Interactive Setup Wizard** - Guided 6-step configuration (no manual .env editing!)
- 🔐 **Authentication** - Supabase Auth with PKCE flow, email/password
- 💳 **Payments** - Stripe subscriptions with automated webhooks
- 🤖 **AI Chat** - OpenRouter integration with multiple AI models (GPT-4, Claude, Llama)
- 📊 **Dashboard** - User analytics, usage charts, activity logs
- 🎨 **Beautiful UI** - shadcn/ui components, Tailwind CSS, dark mode
- 🗄️ **Type-Safe Database** - Drizzle ORM with PostgreSQL
- 📈 **Performance Optimized** - Lazy loading, code splitting, SSG/SSR
- 🚀 **Production Ready** - Built-in error handling, security best practices

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ and **pnpm** 9+
- **Supabase Account** - [Sign up free](https://supabase.com/)
- **Stripe Account** - [Sign up](https://stripe.com/)
- **Resend Account** - [Sign up free](https://resend.com/) (for emails)
- **OpenRouter Account** - [Sign up](https://openrouter.ai/) (for AI chat)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd saas-complete
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

   You'll be automatically redirected to the **Setup Wizard** 🎉

---

## 🧙‍♂️ Setup Wizard

The setup wizard will guide you through **6 simple steps** to configure your SaaS application.

### Step 1: Welcome
- Overview of the setup process
- Prerequisites checklist
- Getting started

### Step 2: Environment Configuration
Configure all your API keys and environment variables through an interactive form:

- ✅ **Supabase** - Project URL, Anon Key, Service Role Key
- ✅ **Database** - Connection string (direct connection)
- ✅ **Stripe** - Secret Key, Publishable Key, Webhook Secret
- ✅ **Resend** - API Key, Email addresses
- ✅ **OpenRouter** - API Key for AI models
- ✅ **App Settings** - Base URL, environment

**What you'll need:**
- [Supabase Project](https://app.supabase.com/) - Create a new project
- [Stripe Keys](https://dashboard.stripe.com/test/apikeys) - Use test mode keys
- [Resend API Key](https://resend.com/api-keys) - Create a new API key
- [OpenRouter Key](https://openrouter.ai/keys) - Create a new API key

The wizard will **test all connections** before saving to ensure everything works!

### Step 3: Database Setup
Automatically initialize your PostgreSQL database:

- 📋 View database schema (5 tables)
- 🔄 Push schema to Supabase
- ✅ Verify tables created successfully

**Tables Created:**
- `user_profiles` - User data and subscription info
- `activity_logs` - User activity tracking
- `chat_conversations` - AI chat sessions
- `chat_messages` - Chat message history
- `token_usage_logs` - AI token usage tracking

### Step 4: AI Prompts Upload
Upload your AI system prompts for the chatbot:

- 📁 Upload markdown files (`.md`)
- 🔄 Auto-convert to JSON format
- 📝 Preview converted prompts

**Example prompts:**
```markdown
# System Prompt
You are a helpful AI assistant specialized in [your domain].

# Instructions
- Be concise and helpful
- Provide code examples when relevant
- Ask clarifying questions when needed
```

### Step 5: Stripe Configuration
Configure your subscription products and pricing:

- 📦 List existing Stripe products
- 🔄 Sync products from config file
- 🔗 Automatically setup webhook endpoints
- 💰 View pricing and AI credit calculations

**What happens:**
1. Reads product config from `scripts/stripe/stripe-products.config.ts`
2. Creates/updates products in Stripe
3. Configures webhook for subscription events
4. Generates `plan-features.ts` for your pricing page

### Step 6: Finalize
Complete the setup and launch your SaaS:

- ✅ Review all completed steps
- 📄 Generate landing page template
- 🎉 Redirect to your dashboard

---

## 📁 Project Structure

```
saas-complete/
├── app/
│   ├── (setup)/          # Setup wizard pages (dev-only)
│   ├── (protected)/      # Protected routes (dashboard, chat, account)
│   ├── (marketing)/      # Public pages (landing, pricing)
│   ├── auth/             # Authentication pages
│   └── api/              # API routes (webhooks, cron)
├── lib/
│   ├── actions/          # Server Actions
│   ├── db/               # Database schema & queries
│   ├── supabase/         # Auth clients & middleware
│   ├── payments/         # Stripe integration
│   └── ai/               # OpenRouter AI integration
├── components/
│   ├── ui/               # shadcn/ui components
│   └── dashboard/        # Dashboard components
├── scripts/
│   ├── stripe/           # Stripe product sync scripts
│   └── convert-prompts-to-json.ts
└── prompts/
    ├── markdown/         # Source .md files (you'll upload these)
    └── json/             # Generated .json files (auto-created)
```

---

## 🛠️ Development Commands

```bash
# Development
pnpm dev              # Start dev server (with Turbopack)
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm db:push          # Push schema changes (dev)
pnpm db:generate      # Generate migration files
pnpm db:migrate       # Run migrations (production)
pnpm db:studio        # Open Drizzle Studio GUI

# Stripe
pnpm stripe:sync      # Sync products to Stripe
pnpm stripe:sync:dry  # Preview changes (dry run)
pnpm stripe:list      # List Stripe products

# Prompts
pnpm prompts:convert  # Convert .md to .json

# Demo
pnpm screenshots:capture  # Capture screenshots (Playwright)
```

---

## 🔧 Manual Setup (Advanced)

If you prefer to configure manually instead of using the setup wizard:

### 1. Create Environment File

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in all required values. See `.env.example` for detailed instructions on where to get each API key.

### 2. Initialize Database

```bash
pnpm db:push
```

This creates all necessary tables in your Supabase database.

### 3. Configure Stripe

Edit `scripts/stripe/stripe-products.config.ts` to define your products, then:

```bash
pnpm stripe:sync
```

This creates products in Stripe and generates the pricing page configuration.

### 4. Add AI Prompts (Optional)

1. Place `.md` files in `prompts/markdown/`
2. Run `pnpm prompts:convert`
3. JSON files will be generated in `prompts/json/`

### 5. Mark Setup as Complete

Add to your `.env.local`:
```bash
SETUP_COMPLETE=true
```

---

## 🗄️ Database Schema

### Core Tables

**user_profiles**
- Extends Supabase `auth.users`
- Stores subscription data (Stripe customer ID, plan, status)
- Tracks AI credits and free token usage

**activity_logs**
- Audit trail of user actions
- Sign ups, sign ins, subscription changes

**chat_conversations**
- User chat sessions with AI
- Title, timestamps, user association

**chat_messages**
- Individual messages in conversations
- Role (user/assistant), content, model, tokens

**token_usage_logs**
- Permanent record of AI token usage
- Survives conversation deletion
- Tracks costs and token counts

---

## 💳 Stripe Integration

### Product Configuration

Products are defined in code and synced to Stripe:

```typescript
// scripts/stripe/stripe-products.config.ts
export const stripePricingConfig = {
  products: [
    {
      name: 'Plus',
      description: 'For power users',
      features: ['Unlimited AI chat', 'Priority support'],
      prices: [
        {
          nickname: 'Plus Monthly',
          unitAmount: 3000, // $30.00
          currency: 'usd',
          interval: 'month',
        }
      ],
      metadata: {
        tier: 'plus',
        ai_credits_amount: '18.00', // $30 - $12 profit = $18 credits
      }
    }
  ]
};
```

### Sync Workflow

```bash
# Preview changes
pnpm stripe:sync:dry

# Apply to Stripe + generate plan-features.ts
pnpm stripe:sync
```

### Webhook Handling

Webhooks are automatically configured during setup. The application handles:
- `checkout.session.completed` - New subscription created
- `customer.subscription.updated` - Subscription modified
- `customer.subscription.deleted` - Subscription canceled

---

## 🤖 AI Chat Features

### Supported Models

**Free Tier:**
- GLM-4.5 Air (free model via OpenRouter)

**Paid Subscriptions:**
- GPT-4o (OpenAI)
- Claude 3.5 Sonnet (Anthropic)
- Llama 3.1 70B (Meta)

### Token Tracking

- **Free Users**: Limited monthly tokens (default: 1M tokens)
  - Automatically resets on the 1st of each month
  - Can only use free AI models (GLM-4.5 Air)
- **Paid Users**: Unlimited free model usage + AI credits for paid models
  - Free models: No token limits
  - Paid models: Deducted from AI credit balance
- **Credits System**: Monetary balance deducted based on actual API costs
  - Monthly subscriptions: Reset on billing cycle (via Stripe webhook)
  - Yearly subscriptions: Reset on the 1st of each month (via cron job)

### Usage

```typescript
// lib/actions/chat-actions.ts
const response = await sendChatAction(messages, selectedModel);
```

---

## ⏰ Cron Jobs

The application uses automated cron jobs to handle recurring tasks like resetting user tokens and AI credits.

### What Are Cron Jobs?

Cron jobs are scheduled tasks that run automatically at specified intervals. In this SaaS template, they're used to:
- Reset free user tokens monthly
- Reset yearly subscription AI credits monthly

### Cron Job Endpoints

#### 1. Reset Free Tokens
**Endpoint**: `POST /api/cron/reset-free-tokens`

**Purpose**: Resets monthly free tokens for users without active subscriptions

**Schedule**: Runs on the 1st of every month at 00:00 UTC

**What it does:**
- Finds all users with no active/trialing subscription
- Resets their `freeTokensUsed` to 0
- Allows free users to continue using the free AI model

**Protection**: Requires `Authorization: Bearer {CRON_SECRET}` header

#### 2. Reset Yearly Credits
**Endpoint**: `POST /api/cron/reset-yearly-credits`

**Purpose**: Resets AI credits for yearly subscription users

**Schedule**: Runs on the 1st of every month at 00:00 UTC

**What it does:**
- Finds all users with yearly subscriptions
- Resets their AI credits to the plan limit
- Logs activity for audit trail

**Protection**: Requires `Authorization: Bearer {CRON_SECRET}` header

### Setup on Vercel (Automatic)

Vercel cron jobs are configured in `vercel.json` and automatically enabled on deployment:

```json
{
  "crons": [
    {
      "path": "/api/cron/reset-yearly-credits",
      "schedule": "0 0 1 * *"
    },
    {
      "path": "/api/cron/reset-free-tokens",
      "schedule": "0 0 1 * *"
    }
  ]
}
```

**No additional setup required!** Once deployed to Vercel, cron jobs will run automatically.

### Setup on Google Cloud

Google Cloud uses **Cloud Scheduler** for cron jobs. Use the provided automation script:

```bash
# Generate a secure CRON_SECRET
CRON_SECRET=$(openssl rand -base64 32)

# Run the setup script
./scripts/setup-gcloud-cron.sh \
  https://your-service-url.run.app \
  $CRON_SECRET
```

**What the script does:**
1. Enables Cloud Scheduler API
2. Creates/updates cron jobs for both endpoints
3. Sets schedule to monthly (1st at 00:00 UTC)
4. Configures authentication with CRON_SECRET

**View jobs in Cloud Console:**
```
https://console.cloud.google.com/cloudscheduler?project=YOUR_PROJECT_ID
```

### Manual Testing

Test cron jobs locally or verify they're working correctly:

```bash
# Test reset-free-tokens endpoint
curl -X POST http://localhost:3000/api/cron/reset-free-tokens \
  -H "Authorization: Bearer your-cron-secret"

# Test reset-yearly-credits endpoint
curl -X POST http://localhost:3000/api/cron/reset-yearly-credits \
  -H "Authorization: Bearer your-cron-secret"
```

**Expected response:**
```json
{
  "success": true,
  "message": "Free tokens reset successfully",
  "usersAffected": 42
}
```

### Trigger Jobs Manually (Google Cloud)

```bash
# Trigger reset-free-tokens
gcloud scheduler jobs run reset-free-tokens --location=us-central1

# Trigger reset-yearly-credits
gcloud scheduler jobs run reset-yearly-credits --location=us-central1
```

### Cron Schedule Format

Both jobs use the cron syntax `0 0 1 * *`:

```
┌───────────── minute (0)
│ ┌─────────── hour (0 = midnight UTC)
│ │ ┌───────── day of month (1 = 1st)
│ │ │ ┌─────── month (* = every month)
│ │ │ │ ┌───── day of week (* = any day)
│ │ │ │ │
0 0 1 * *
```

### Security

- **CRON_SECRET**: Must be set in environment variables
- **Header validation**: Endpoints reject requests without valid secret
- **Idempotent**: Safe to run multiple times (won't duplicate resets)
- **Logging**: All resets are logged in the database

### Monitoring

Check if cron jobs are running successfully:

1. **Vercel Dashboard**: Project → Settings → Cron Jobs
2. **Google Cloud Console**: Cloud Scheduler → View job history
3. **Application Logs**: Check for cron execution logs
4. **Database**: Verify `activity_logs` table for reset entries

### Troubleshooting

**Problem**: Cron jobs not running

**Solutions**:
1. **Vercel**: Ensure `vercel.json` is committed and deployed
2. **Google Cloud**: Run `./scripts/setup-gcloud-cron.sh` to configure
3. **Check CRON_SECRET**: Must match in environment variables and Cloud Scheduler
4. **Verify endpoint**: Test manually with curl

**Problem**: 401 Unauthorized error

**Solution**: Check that `CRON_SECRET` environment variable is set correctly

**Problem**: Cron runs but tokens not resetting

**Solution**: Check application logs for errors, verify database connection

---

## 🎨 UI Components

Built with **shadcn/ui** (Radix UI + Tailwind CSS):

- ✅ Pre-configured with 20+ component registries
- ✅ Dark mode support (next-themes)
- ✅ Responsive design
- ✅ Accessible (ARIA compliant)
- ✅ Customizable via CSS variables

### Custom Components

- **OrbLazy** - Animated 3D orb for AI chat (Three.js)
- **UsageChartsLazy** - Usage analytics charts (Recharts)
- **SetupProgress** - Multi-step wizard progress indicator
- **ChatInterface** - AI chat with Eleven Labs voice integration

---

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Configure environment variables (copy from `.env.local`)

3. **Set Environment Variables**

   Add all variables from `.env.example` in Vercel project settings:
   - Supabase credentials
   - Database URL
   - Stripe keys
   - Resend API key
   - OpenRouter API key
   - **Important**: Set `SETUP_COMPLETE=true` to disable setup wizard in production

4. **Configure Stripe Webhook (Production)**
   ```bash
   pnpm stripe:webhook:setup --url https://yourdomain.com
   ```

5. **Update Supabase Redirect URLs**

   In Supabase Dashboard → Authentication → URL Configuration:
   - Add `https://yourdomain.com/api/auth/callback`

6. **Deploy**

   Automatic deployment on every `git push`!

---

### Deploy to Google Cloud

Google Cloud offers two deployment options: **Cloud Run** (recommended) and **App Engine**.

#### Option 1: Cloud Run (Recommended)

Cloud Run is a fully managed serverless platform for containerized applications.

**Prerequisites:**
- [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) installed
- Google Cloud project created
- Billing enabled

**1. Enable Required APIs**
```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable cloudscheduler.googleapis.com
```

**2. Set Project ID**
```bash
gcloud config set project YOUR_PROJECT_ID
```

**3. Build and Deploy**
```bash
# Build the container image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/saas-complete

# Deploy to Cloud Run
gcloud run deploy saas-complete \
  --image gcr.io/YOUR_PROJECT_ID/saas-complete \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --port 8080
```

**4. Set Environment Variables**
```bash
# Set all required environment variables
gcloud run services update saas-complete \
  --region us-central1 \
  --set-env-vars="NODE_ENV=production" \
  --set-env-vars="SETUP_COMPLETE=true" \
  --set-env-vars="NEXT_PUBLIC_BASE_URL=https://your-service-url.run.app" \
  --update-secrets="SUPABASE_SERVICE_ROLE_KEY=supabase-service-key:latest" \
  --update-secrets="DATABASE_URL=database-url:latest" \
  --update-secrets="STRIPE_SECRET_KEY=stripe-secret:latest" \
  --update-secrets="STRIPE_WEBHOOK_SECRET=stripe-webhook:latest" \
  --update-secrets="RESEND_API_KEY=resend-api-key:latest" \
  --update-secrets="OPENROUTER_API_KEY=openrouter-api-key:latest" \
  --update-secrets="CRON_SECRET=cron-secret:latest"
```

*Note: Store secrets in Google Secret Manager first, then reference them.*

**5. Setup Cron Jobs**
```bash
# Generate a secure CRON_SECRET
CRON_SECRET=$(openssl rand -base64 32)

# Run the setup script
./scripts/setup-gcloud-cron.sh \
  https://your-service-url.run.app \
  $CRON_SECRET
```

**6. Configure Stripe Webhook**
```bash
pnpm stripe:webhook:setup --url https://your-service-url.run.app
```

**7. Update Supabase Redirect URLs**
- Go to Supabase Dashboard → Authentication → URL Configuration
- Add: `https://your-service-url.run.app/api/auth/callback`

---

#### Option 2: App Engine

App Engine is a fully managed PaaS for deploying applications.

**1. Initialize App Engine**
```bash
gcloud app create --region=us-central
```

**2. Set Environment Variables**

Edit `app.yaml` and uncomment the environment variables, or use:
```bash
# Set secrets via Secret Manager
gcloud secrets create supabase-service-key --data-file=- < key.txt
```

**3. Deploy**
```bash
gcloud app deploy
```

**4. Setup Cron Jobs**
```bash
# Get your App Engine URL
APP_URL=$(gcloud app describe --format="value(defaultHostname)")

# Run the setup script
./scripts/setup-gcloud-cron.sh \
  https://$APP_URL \
  $(openssl rand -base64 32)
```

**5. Configure Stripe & Supabase**
- Same as steps 6-7 in Cloud Run instructions above

---

### Google Cloud Cost Optimization

**Cloud Run (Pay-per-use):**
- **Free Tier**: 2 million requests/month
- **Typical Cost**: $0.00002400/request + $0.00001800/GB-second memory
- **Recommendation**: Use `--min-instances 0` for auto-scaling to zero

**App Engine (Instance-based):**
- **Free Tier**: 28 instance hours/day
- **F1 Instance**: ~$0.05/hour
- **Recommendation**: Use automatic scaling with min_instances: 0

**Cloud Scheduler:**
- **Free Tier**: 3 jobs/month
- **Cost**: $0.10/job/month (for 2 jobs = $0.20/month)

**Estimated Monthly Cost:**
- **Low traffic** (<10K requests): ~$0-5
- **Medium traffic** (100K requests): ~$10-20
- **High traffic** (1M requests): ~$50-100

---

## 🧪 Testing

### Test Stripe Subscriptions

Use these test card numbers:

| Card Number | Result |
|------------|--------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Decline |
| `4000 0025 0000 3155` | 3D Secure |

**Expiry**: Any future date
**CVC**: Any 3 digits

### Test Flow

1. Sign up new user
2. Navigate to pricing page
3. Select a plan and checkout
4. Use test card `4242 4242 4242 4242`
5. Verify subscription in dashboard
6. Check Stripe dashboard for customer
7. Test AI chat with tokens
8. Verify activity logs

---

## 🔒 Security

### Implemented Security Features

- ✅ **PKCE Authentication** - Secure auth flow (Supabase)
- ✅ **Webhook Signature Verification** - Validates Stripe webhooks
- ✅ **Route Protection** - Middleware enforces authentication
- ✅ **Environment Variables** - Secrets never in code
- ✅ **SQL Injection Prevention** - Drizzle ORM parameterized queries
- ✅ **XSS Prevention** - React automatic escaping
- ✅ **HTTPS Enforcement** - Production only

### Security Best Practices

- Never commit `.env.local` to version control
- Use Supabase Row Level Security (RLS) policies
- Rotate API keys regularly
- Enable Stripe webhook signature verification
- Keep dependencies updated

---

## 📊 Performance

### Optimizations

- **Route-level code splitting** - Automatic (Next.js)
- **Component lazy loading** - Heavy components (~280KB saved)
- **React cache()** - Prevents duplicate DB queries
- **Tree-shaking** - Removes unused code
- **Image optimization** - AVIF/WebP formats
- **Gzip compression** - Smaller response sizes
- **SSG for public pages** - Instant page loads

### Bundle Sizes

- **Initial JS**: ~350KB (30% reduction)
- **Homepage**: ~250KB (static)
- **Dashboard**: ~480KB + 80KB lazy-loaded charts
- **Chat page**: ~500KB + 200KB lazy-loaded 3D Orb

---

## 🐛 Troubleshooting

### Setup Wizard Not Accessible

**Problem**: Can't access `/setup` route

**Solutions**:
- Ensure `NODE_ENV=development` in `.env.local`
- Remove or set `SETUP_COMPLETE=false` in `.env.local`
- Use `http://localhost:3000/setup?force=true` to bypass check

### Database Connection Error

**Problem**: `Error: connect ECONNREFUSED`

**Solution**: Use the **DIRECT connection** string from Supabase, not the pooler URL:
```
Settings → Database → Connection String → Direct Connection
```

### Stripe Webhook Not Working

**Problem**: Subscriptions not updating in database

**Solutions**:
1. Use the setup wizard to auto-configure webhook
2. Or manually run: `pnpm stripe:webhook:setup`
3. Or use Stripe CLI for local testing:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

### Auth Redirect Error

**Problem**: "Auth Error" after sign up

**Solution**: Add callback URL in Supabase:
- Dashboard → Authentication → URL Configuration
- Add: `http://localhost:3000/api/auth/callback`

### Build Errors

**Problem**: TypeScript errors during build

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Clear TypeScript build info
rm tsconfig.tsbuildinfo

# Rebuild
pnpm build
```

---

## 📚 Documentation

- **CLAUDE.md** - Development guide for Claude Code
- **.env.example** - Environment variables reference
- **docs/screenshots/** - Screenshot guidelines
- **docs/videos/** - Demo video guidelines

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with these amazing technologies:

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Auth & Database
- [Stripe](https://stripe.com/) - Payments
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe database
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [OpenRouter](https://openrouter.ai/) - AI models
- [Resend](https://resend.com/) - Email delivery

---

## 📧 Support

For support, email support@yourdomain.com or open an issue on GitHub.

---

**Made with ❤️ by A1X6**
