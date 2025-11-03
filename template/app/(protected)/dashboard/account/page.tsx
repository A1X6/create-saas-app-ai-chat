import { getActivityLogs, getUser } from '@/lib/db/queries';
import { AccountPageClient } from '@/components/account/account-client';
import type { Metadata } from 'next';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Server-Side Rendering (SSR) - Dynamic page with user data
// Account settings and activity logs require fresh data
export const metadata: Metadata = {
  title: 'Account Settings - {{APP_NAME}}',
  description: 'Manage your {{APP_NAME}} account profile, security settings, subscription, and view your activity logs.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/dashboard/account',
  },
};

export default async function AccountPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const user = await getUser();
  const activityLogs = await getActivityLogs();

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
        name: 'Account Settings',
        item: `${baseUrl}/dashboard/account`,
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

      <AccountPageClient
        user={user}
        activityLogs={activityLogs}
      />
    </>
  );
}
