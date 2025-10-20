import { ChatbotElevenLabs } from "@/app/(protected)/dashboard/chat/chat-interface";
import { getUser } from "@/lib/db/queries";
import { redirect } from "next/navigation";
import type { Metadata } from 'next';

// Server-Side Rendering (SSR) - Dynamic page with user data
// Real-time chat requires fresh user data on each request
export const metadata: Metadata = {
  title: 'AI Chat',
  description: 'Chat with AI models using your credits and free tokens',
};

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ conversation?: string }>;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const user = await getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const params = await searchParams;
  const conversationId = params.conversation || null;

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Dashboard',
        item: `${baseUrl}/dashboard`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'AI Chat',
        item: `${baseUrl}/dashboard/chat`,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="h-full p-4 lg:p-8">
        <ChatbotElevenLabs user={user} conversationId={conversationId} />
      </div>
    </>
  );
}
