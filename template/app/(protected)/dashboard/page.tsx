import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { customerPortalAction } from '@/lib/payments/actions';
import type { Metadata } from 'next';

// Server-Side Rendering (SSR) - Dynamic page with user data
// This is the default behavior for Server Components
export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'View your account overview, usage analytics, and quick actions',
};
import {
  CreditCard,
  User as UserIcon,
  TrendingUp,
  Activity as ActivityIcon,
  ArrowRight,
  Zap,
  MessageSquare,
  Settings,
  BarChart3,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUser, getActivityLogs, getWeeklyTokenUsage, getMonthlyCreditsUsage } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { UsageChartsLazy } from '@/components/dashboard/usage-charts-lazy';

type User = {
  id: string;
  email: string;
  name: string | null;
  planName: string | null;
  subscriptionStatus: string | null;
  stripeCustomerId: string | null;
  aiCreditsBalance: number;
  aiCreditsAllocated: number;
  aiCreditsUsed: number;
  freeTokensUsed: number;
  freeTokensLimit: number;
};

function getUserInitials(user: User) {
  if (user?.name) {
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
  return user?.email?.[0]?.toUpperCase() || '?';
}

function getStatusBadge(status: string | null) {
  if (!status) return { text: 'Free', variant: 'secondary' as const };

  switch (status) {
    case 'active':
      return { text: 'Active', variant: 'default' as const };
    case 'trialing':
      return { text: 'Trial', variant: 'secondary' as const };
    case 'canceled':
      return { text: 'Canceled', variant: 'destructive' as const };
    case 'past_due':
      return { text: 'Past Due', variant: 'outline' as const };
    default:
      return { text: status, variant: 'secondary' as const };
  }
}

export default async function DashboardPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const user = await getUser();

  if (!user) {
    redirect('/auth/sign-in');
  }

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
    ],
  };

  const [activityLogs, weeklyTokenUsage, monthlyCreditsUsage] = await Promise.all([
    getActivityLogs(),
    getWeeklyTokenUsage(user.id),
    getMonthlyCreditsUsage(user.id),
  ]);

  const status = getStatusBadge(user?.subscriptionStatus ?? null);

  // Subscription status checks
  const isTrialing = user?.subscriptionStatus === 'trialing';
  const hasActiveSubscription = user?.subscriptionStatus === 'active';
  const isUnsubscribed = !user?.subscriptionStatus || (!isTrialing && !hasActiveSubscription);

  const creditsRemaining = user?.aiCreditsAllocated && user.aiCreditsAllocated > 0
    ? Math.round(((user.aiCreditsAllocated - (user?.aiCreditsUsed || 0)) / user.aiCreditsAllocated) * 100)
    : 0;

  const tokensUsedPercentage = user?.freeTokensLimit && user.freeTokensLimit > 0
    ? Math.round((user.freeTokensUsed / user.freeTokensLimit) * 100)
    : 0;

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'SIGN_IN':
      case 'SIGN_UP':
        return <UserIcon className="h-4 w-4" />;
      case 'SUBSCRIPTION_CREATED':
      case 'SUBSCRIPTION_UPDATED':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <ActivityIcon className="h-4 w-4" />;
    }
  };

  return (
    <>
      {/* JSON-LD Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back{user?.name ? `, ${user.name}` : ''}! Here&apos;s your overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {getUserInitials(user)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* AI Credits Balance - Only for Active Paid Subscribers */}
        {hasActiveSubscription && user?.aiCreditsAllocated > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                AI Credits Balance
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${user?.aiCreditsBalance.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {creditsRemaining}% remaining this period
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-secondary overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    creditsRemaining > 50
                      ? "bg-green-500"
                      : creditsRemaining > 20
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  )}
                  style={{ width: `${creditsRemaining}%` }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Subscription
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.planName || 'Free'}
            </div>
            <div className="mt-2">
              <Badge variant={status.variant} className="text-xs">
                {status.text}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Free Model Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Free Model Usage
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isTrialing || hasActiveSubscription ? (
              <>
                <div className="text-2xl font-bold">Unlimited</div>
                <p className="text-xs text-muted-foreground">
                  Free models have no usage limits
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {tokensUsedPercentage}%
                </div>
                <p className="text-xs text-muted-foreground">
                  of monthly free allocation
                </p>
                <div className="mt-3 h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${tokensUsedPercentage}%` }}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Account Type */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Account Type
            </CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Personal
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Individual account
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <UsageChartsLazy
        weeklyData={weeklyTokenUsage}
        monthlyData={monthlyCreditsUsage}
        subscriptionStatus={user?.subscriptionStatus ?? null}
      />

      {/* Quick Actions & Recent Activity Row */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Quick Actions - Takes 2 columns */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Commonly used features and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {/* AI Chat */}
              <Link
                href="/dashboard/chat"
                className="group flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">AI Chat</p>
                  <p className="text-xs text-muted-foreground">
                    Start a conversation
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>

              {/* Activity Logs */}
              <Link
                href="/dashboard/account"
                className="group flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <ActivityIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Activity</p>
                  <p className="text-xs text-muted-foreground">
                    View your logs
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>

              {/* Settings */}
              <Link
                href="/dashboard/account"
                className="group flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Settings</p>
                  <p className="text-xs text-muted-foreground">
                    Manage account
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>

              {/* Billing */}
              {user?.stripeCustomerId && (
                <form action={customerPortalAction} className="contents">
                  <button
                    type="submit"
                    className="group flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors text-left w-full"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Billing</p>
                      <p className="text-xs text-muted-foreground">
                        Manage subscription
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                </form>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {getActivityIcon(log.action)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {log.action.split('_').map(word =>
                        word.charAt(0) + word.slice(1).toLowerCase()
                      ).join(' ')}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
              {activityLogs.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade CTA */}
      {!user?.stripeCustomerId && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">
                    Upgrade Your Plan
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Unlock unlimited AI credits and premium features
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Unlimited tokens
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Priority support
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Advanced features
                    </Badge>
                  </div>
                </div>
              </div>
              <Button asChild size="lg" className="shrink-0">
                <Link href="/pricing">
                  View Plans
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </>
  );
}
