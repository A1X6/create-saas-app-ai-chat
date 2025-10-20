import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getUserConversations, getUser } from '@/lib/db/queries';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getUserConversations();
  const user = await getUser();

  const userData = user ? {
    name: user.name || 'User',
    email: user.email || '',
    avatar: undefined, // Add avatar URL when available
    planName: user.planName,
    subscriptionStatus: user.subscriptionStatus,
  } : undefined;

  return (
    <div className="h-screen flex flex-col [--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar conversations={conversations} user={userData} />
          <SidebarInset className="flex-1 overflow-hidden">
            <div className="h-full overflow-hidden">{children}</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
