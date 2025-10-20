# create-saas-app-ai-chat

Create a production-ready personal SaaS with Next.js, Supabase, and Stripe in seconds.

## Quick Start

```bash
npx create-saas-app-ai-chat my-awesome-saas
cd my-awesome-saas
```

## What's Included

- 🔐 Supabase Authentication (PKCE flow)
- 💳 Stripe Subscriptions (checkout, webhooks, portal)
- 📊 Auto-generated pricing pages
- 🗄️ PostgreSQL + Drizzle ORM
- 📝 Activity logging
- 🎨 shadcn/ui + Tailwind CSS
- 🚀 Next.js 15 (App Router, Server Actions)

## Setup

After creating your project:

1. Copy `.env.example` to `.env.local`
2. Add your Supabase credentials
3. Add your Stripe credentials
4. Run `pnpm db:push`
5. Run `pnpm stripe:sync`
6. Run `pnpm dev`

Check the generated README.md for detailed instructions.

## License

MIT