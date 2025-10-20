import { getActivityLogs, getUser } from '@/lib/db/queries';
import { AccountPageClient } from './account-client';
import type { Metadata } from 'next';

// Server-Side Rendering (SSR) - Dynamic page with user data
// Account settings and activity logs require fresh data
export const metadata: Metadata = {
  title: 'Account Settings',
  description: 'Manage your profile, security settings, subscription, and view activity logs',
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
