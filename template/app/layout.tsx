import type { Metadata } from "next";
import { Inter, Roboto_Flex } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";

const inter = Inter({ subsets: ["latin"] });
const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-roboto-flex",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: "{{APP_NAME}} - {{APP_TAGLINE}}",
    template: "%s | {{APP_NAME}}"
  },
  description:
    "{{APP_DESCRIPTION}}",
  keywords: [
    "AI SaaS",
    "AI chat",
    "multi-model AI",
    "Claude",
    "Gemini",
    "OpenRouter",
    "AI platform",
    "AI subscription",
    "AI credits",
    "AI analytics"
  ],
  authors: [{ name: "{{APP_AUTHOR}}" }],
  creator: "{{APP_AUTHOR}}",
  publisher: "{{APP_AUTHOR}}",
  applicationName: "{{APP_NAME}}",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "{{APP_NAME}} - {{APP_TAGLINE}}",
    description:
      "{{APP_DESCRIPTION}}",
    siteName: "{{APP_NAME}}",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "{{APP_NAME}} - {{APP_TAGLINE}}",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "{{APP_NAME}} - {{APP_TAGLINE}}",
    description:
      "{{APP_DESCRIPTION}}",
    images: ["/og-image.png"],
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
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${robotoFlex.variable}`}>
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
