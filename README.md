# create-saas-app-ai-chat

[![npm version](https://img.shields.io/npm/v/create-saas-app-ai-chat)](https://www.npmjs.com/package/create-saas-app-ai-chat)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

Create a **production-ready AI SaaS application** with Next.js 15, Supabase, Stripe, and OpenRouter in seconds. Perfect for indie hackers, startups, and developers who want to launch fast.

## ✨ Features

### 🤖 AI Chat Platform
- **15+ AI Models** - Access Claude, GPT-4, Gemini, Llama, DeepSeek, and more through OpenRouter
- **Multi-Model Support** - Switch between models seamlessly
- **Context Management** - Automatic conversation summarization for long chats
- **Code Artifact Detection** - Beautiful rendering of code blocks and artifacts
- **Credit-Based Billing** - Precise USD-based usage tracking (6 decimal precision)

### 🔐 Authentication
- **Supabase Auth** - Production-ready authentication
- **PKCE Flow** - Enhanced security for OAuth
- **Multiple Providers** - Email/password + OAuth (Google, GitHub, etc.)
- **Session Management** - Server-side sessions with automatic refresh
- **Protected Routes** - Middleware-based route protection

### 💳 Payments & Subscriptions
- **Stripe Integration** - Complete subscription system
- **Trial System** - 7-day monthly / 14-day yearly trials with $1 credit
- **Customer Portal** - Self-service subscription management
- **Webhook Handling** - Automated event processing
- **Credit Allocation** - Automatic monthly credit resets

### 🎨 UI/UX
- **shadcn/ui** - Beautiful, accessible components
- **MagicUI** - Animated components for modern feel
- **Tailwind CSS 4** - Latest styling framework
- **Dark Mode** - Built-in theme switching
- **Responsive Design** - Mobile-first approach
- **Framer Motion** - Smooth animations

### 🗄️ Database & Backend
- **PostgreSQL** - Hosted on Neon via Supabase
- **Drizzle ORM** - Type-safe database queries
- **Server Actions** - Type-safe mutations
- **API Routes** - RESTful endpoints
- **Activity Logging** - Complete audit trail
- **Usage Analytics** - Track token consumption and costs

### 🚀 Developer Experience
- **TypeScript** - Full type safety
- **Next.js 15** - Latest features (App Router, Server Components)
- **Turbopack** - Lightning-fast dev server
- **Setup Wizard** - Interactive configuration in dev mode
- **Hot Reload** - Instant updates during development

## 🎯 Why Choose This Template?

| Feature | create-saas-app-ai-chat | Other Templates |
|---------|------------------------|-----------------|
| AI Integration | ✅ 15+ models via OpenRouter | ❌ Usually none |
| Stripe Setup | ✅ Complete with trials & webhooks | ⚠️ Basic or missing |
| Auth System | ✅ Production-ready with OAuth | ⚠️ Often incomplete |
| Type Safety | ✅ End-to-end TypeScript + Drizzle | ⚠️ Partial |
| Documentation | ✅ Comprehensive guides | ⚠️ Basic |
| Setup Wizard | ✅ Interactive dev setup | ❌ Manual config |

## 🚀 Quick Start

```bash
npx create-saas-app-ai-chat my-awesome-saas
cd my-awesome-saas
```

The CLI will guide you through:
1. Setting your app name and branding
2. Configuring support email
3. Adding social media links (optional)

## 📦 What's Included

### Frontend
- **Next.js 15** - App Router, React Server Components
- **React 19** - Latest React features
- **TypeScript 5** - Strict mode enabled
- **Tailwind CSS 4** - Modern styling
- **shadcn/ui** - Radix UI primitives
- **MagicUI** - Animated components
- **Framer Motion** - Animations
- **Recharts** - Usage analytics charts
- **next-themes** - Dark mode support

### Backend & Database
- **Next.js API Routes** - Serverless functions
- **Next.js Server Actions** - Type-safe mutations
- **PostgreSQL** - Neon via Supabase
- **Drizzle ORM 0.43.1** - Type-safe queries
- **Drizzle Kit** - Database migrations

### Authentication
- **Supabase Auth** - Latest version
- **@supabase/ssr** - SSR-safe sessions
- **OAuth Support** - Google, GitHub, etc.
- **PKCE Flow** - Enhanced security

### Payments
- **Stripe 19.1.0** - Subscriptions, checkout, webhooks
- **Customer Portal** - Self-service management
- **Trial System** - 7-day monthly, 14-day yearly
- **Credit System** - USD-based billing

### AI Integration
- **OpenRouter API** - Multi-model gateway
- **OpenAI SDK 6.3.0** - Client library
- **gpt-tokenizer** - Token estimation
- **tiktoken** - Token counting
- **15+ Models** - Claude, Gemini, Llama, DeepSeek, etc.

### Email
- **Resend 6.1.2** - Transactional emails

## 🛠️ Setup

After creating your project:

### 1. Install Dependencies
```bash
pnpm install
# or
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:
- **Supabase**: URL, anon key, service role key, database URL
- **Stripe**: Secret key, publishable key, webhook secret
- **OpenRouter**: API key
- **Resend**: API key and email addresses

### 3. Set Up Database
```bash
pnpm db:push
```

This creates all necessary tables in your Supabase database.

### 4. Configure Stripe
1. Create products in Stripe Dashboard
2. Add metadata: `{"ai_credits_amount": "50.00"}`
3. Set up webhook: `https://yourdomain.com/api/stripe/webhook`
4. Add webhook events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

### 5. Start Development Server
```bash
pnpm dev
```

Visit `http://localhost:3000/setup` for the interactive setup wizard (dev only).

### 6. Access Your App
- **Homepage**: `http://localhost:3000`
- **Dashboard**: `http://localhost:3000/dashboard` (after signup)
- **Setup Wizard**: `http://localhost:3000/setup` (dev only)

## 📚 Documentation

The generated project includes comprehensive documentation:

- **README.md** - Complete setup and deployment guide
- **CLAUDE.md** - Detailed codebase documentation
- **Database Schema** - All tables and relationships explained
- **API Routes** - Endpoint documentation
- **Server Actions** - Available actions and usage

## 🏗️ Project Structure

```
my-saas/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Public pages
│   ├── (protected)/        # Authenticated routes
│   ├── api/               # API endpoints
│   └── auth/              # Auth pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── magicui/          # Animated components
├── lib/                   # Business logic
│   ├── db/               # Database & schema
│   ├── supabase/         # Supabase clients
│   ├── payments/         # Stripe integration
│   ├── ai/               # OpenRouter integration
│   └── actions/          # Server actions
├── hooks/                 # React hooks
├── types/                 # TypeScript types
├── prompts/              # AI system prompts
└── public/               # Static assets
```

## 🚢 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Configure environment variables
4. Deploy

### Other Platforms
- Works on any Node.js 18+ hosting
- Update Stripe webhook URL after deployment
- Update Supabase redirect URLs

## 🧪 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 15, React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4, shadcn/ui |
| **Database** | PostgreSQL (Neon) |
| **ORM** | Drizzle ORM |
| **Auth** | Supabase Auth |
| **Payments** | Stripe |
| **AI** | OpenRouter |
| **Email** | Resend |
| **Deployment** | Vercel |

## 🐛 Troubleshooting

### Common Issues

**Setup wizard not loading?**
- Ensure `NODE_ENV=development`
- Check `SETUP_COMPLETE` is not set to `true` in `.env.local`
- Try accessing `/setup?force=true`

**Stripe webhooks failing?**
- Verify webhook secret matches
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Check webhook events are enabled

**Database connection errors?**
- Verify `DATABASE_URL` is correct
- Check Supabase project is active
- Test connection in setup wizard

**AI chat not working?**
- Verify `OPENROUTER_API_KEY` is set
- Check user has active subscription and credits
- Inspect browser console for errors

**Credits not deducting?**
- Check webhook events are firing
- Verify `token_usage_logs` table has entries
- Review `aiCreditsBalance` in `user_profiles`

## 🔗 Resources

- **GitHub Repository**: [https://github.com/A1X6/create-saas-app-ai-chat](https://github.com/A1X6/create-saas-app-ai-chat)
- **Issues**: [https://github.com/A1X6/create-saas-app-ai-chat/issues](https://github.com/A1X6/create-saas-app-ai-chat/issues)
- **npm Package**: [https://www.npmjs.com/package/create-saas-app-ai-chat](https://www.npmjs.com/package/create-saas-app-ai-chat)

### Documentation Links
- [Next.js 15](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
- [Stripe](https://stripe.com/docs)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [OpenRouter](https://openrouter.ai/docs)
- [shadcn/ui](https://ui.shadcn.com/)

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**A1X6**
- GitHub: [@A1X6](https://github.com/A1X6)
- npm: [a1x6](https://www.npmjs.com/~a1x6)

---

**Made with ❤️ for indie hackers and SaaS builders**

Start building your AI SaaS today:
```bash
npx create-saas-app-ai-chat my-saas
```
