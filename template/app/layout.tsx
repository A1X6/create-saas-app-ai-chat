import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: "SaaS Complete - Personal SaaS Starter",
    template: "%s | SaaS Complete"
  },
  description:
    "Production-ready personal SaaS starter with Supabase Auth, Drizzle ORM, Stripe subscriptions, and activity logging. Build your SaaS faster with built-in authentication, payments, and AI chat.",
  keywords: [
    "SaaS starter",
    "Next.js template",
    "Supabase Auth",
    "Stripe subscriptions",
    "AI chatbot",
    "Drizzle ORM",
    "TypeScript",
    "shadcn/ui",
    "personal SaaS",
    "indie hacker"
  ],
  authors: [{ name: "SaaS Complete" }],
  creator: "SaaS Complete",
  publisher: "SaaS Complete",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "SaaS Complete - Personal SaaS Starter",
    description:
      "Production-ready personal SaaS starter with Supabase Auth, Drizzle ORM, Stripe subscriptions, and activity logging",
    siteName: "SaaS Complete",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaS Complete - Personal SaaS Starter",
    description:
      "Production-ready personal SaaS starter with Supabase Auth, Drizzle ORM, Stripe subscriptions, and activity logging",
    creator: "@saascomplete",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
