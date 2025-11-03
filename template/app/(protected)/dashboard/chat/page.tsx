import { ChatbotElevenLabs } from "@/app/(protected)/dashboard/chat/chat-interface";
import { getUser } from "@/lib/db/queries";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { LowCreditWarning } from "@/app/(protected)/dashboard/low-credit-warning";
import type { Metadata } from "next";

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Server-Side Rendering (SSR) - Dynamic page with user data
// Real-time chat requires fresh user data on each request
export const metadata: Metadata = {
  title: "AI Chat - {{APP_NAME}}",
  description:
    "Chat with 15+ premium AI models including GPT-4, Claude, and Gemini. Use your AI credits or free tokens to have conversations.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/dashboard/chat",
  },
};

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ conversation?: string }>;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const user = await getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const params = await searchParams;
  const conversationId = params.conversation || null;

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Dashboard",
        item: `${baseUrl}/dashboard`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "AI Chat",
        item: `${baseUrl}/dashboard/chat`,
      },
    ],
  };

  // Check subscription status
  const isTrialing = user.subscriptionStatus === "trialing";
  const hasActiveSubscription = user.subscriptionStatus === "active";
  const isUnsubscribed = !isTrialing && !hasActiveSubscription;
  const creditsBalance = user.aiCreditsBalance;
  const isLowCredit = isTrialing && creditsBalance > 0 && creditsBalance < 0.25;

  // Calculate percentage for display
  const creditsRemainingPercent =
    user.aiCreditsAllocated && user.aiCreditsAllocated > 0
      ? Math.round(
          ((user.aiCreditsAllocated - (user.aiCreditsUsed || 0)) /
            user.aiCreditsAllocated) *
            100
        )
      : 0;

  // If unsubscribed, show subscription required message
  if (isUnsubscribed) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <div className="h-full p-4 lg:p-8 flex items-center justify-center">
          <div className="max-w-md w-full">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Subscription Required</AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-4">
                  {'You need an active subscription to use {{APP_NAME}}. Subscribe now to start your trial with $1 credit.'}
                </p>
                <Button
                  asChild
                  className="w-[20%] whitespace-normal text-center leading-tight"
                >
                  <Link href="/pricing">View Pricing Plans</Link>
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* JSON-LD Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="h-full p-4 lg:p-8">
        {isLowCredit && (
          <LowCreditWarning creditsRemainingPercent={creditsRemainingPercent} />
        )}
        <ChatbotElevenLabs user={user} conversationId={conversationId} />
      </div>
    </>
  );
}
