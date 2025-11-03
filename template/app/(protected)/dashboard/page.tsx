import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { customerPortalAction } from "@/lib/payments/actions";
import type { Metadata } from "next";

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Server-Side Rendering (SSR) - Dynamic page with user data
// This is the default behavior for Server Components
export const metadata: Metadata = {
  title: "Dashboard - {{APP_NAME}}",
  description:
    "View your account overview, usage analytics, AI credits balance, and quick actions. Access your conversations and manage your subscription.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/dashboard",
  },
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
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getUser,
  getActivityLogs,
  getWeeklyTokenUsage,
  getMonthlyCreditsUsage,
} from "@/lib/db/queries";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { UsageChartsLazy } from "@/app/(protected)/dashboard/usage-charts-lazy";
import { LowCreditWarning } from "@/app/(protected)/dashboard/low-credit-warning";
import { UpgradeCard } from "@/app/(protected)/dashboard/upgrade-card";
import content from "./page-content.json";

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
};

function getUserInitials(user: User) {
  if (user?.name) {
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }
  return user?.email?.[0]?.toUpperCase() || "?";
}

function getStatusBadge(status: string | null) {
  if (!status)
    return { text: content.subscriptionStatus.noSubscription, variant: "destructive" as const };

  switch (status) {
    case "active":
      return { text: content.subscriptionStatus.active, variant: "default" as const };
    case "trialing":
      return { text: content.subscriptionStatus.trial, variant: "secondary" as const };
    case "canceled":
      return { text: content.subscriptionStatus.canceled, variant: "destructive" as const };
    case "past_due":
      return { text: content.subscriptionStatus.pastDue, variant: "outline" as const };
    default:
      return { text: status, variant: "secondary" as const };
  }
}

export default async function DashboardPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const user = await getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: content.breadcrumb.home,
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: content.breadcrumb.dashboard,
        item: `${baseUrl}/dashboard`,
      },
    ],
  };

  // Subscription status checks
  const isTrialing = user?.subscriptionStatus === "trialing";
  const hasActiveSubscription = user?.subscriptionStatus === "active";
  const isUnsubscribed = !isTrialing && !hasActiveSubscription;
  const creditsBalance = user.aiCreditsBalance;
  const isLowCredit = isTrialing && creditsBalance > 0 && creditsBalance < 0.25;

  const [activityLogs, weeklyTokenUsage, monthlyCreditsUsage] =
    await Promise.all([
      getActivityLogs(),
      getWeeklyTokenUsage(user.id),
      getMonthlyCreditsUsage(user.id),
    ]);

  const status = getStatusBadge(user?.subscriptionStatus ?? null);

  const creditsRemaining =
    user?.aiCreditsAllocated && user.aiCreditsAllocated > 0
      ? Math.round(
          ((user.aiCreditsAllocated - (user?.aiCreditsUsed || 0)) /
            user.aiCreditsAllocated) *
            100
        )
      : 0;

  const getActivityIcon = (action: string) => {
    switch (action) {
      case "SIGN_IN":
      case "SIGN_UP":
        return <UserIcon className="h-4 w-4" />;
      case "SUBSCRIPTION_CREATED":
      case "SUBSCRIPTION_UPDATED":
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

      {/* Subscription Required Gate */}
      {isUnsubscribed && (
        <div className="h-full p-4 lg:p-8 flex items-center justify-center">
          <div className="max-w-md w-full">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{content.subscriptionRequired.title}</AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-4">
                  {content.subscriptionRequired.message}
                </p>
                <Button
                  asChild
                  className="whitespace-normal text-center leading-tight"
                >
                  <Link href="/pricing">{content.subscriptionRequired.button}</Link>
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      {/* Dashboard Content - Only show if subscribed */}
      {!isUnsubscribed && (
        <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
          {/* Low Credit Warning for Trial Users */}
          {isLowCredit && (
            <LowCreditWarning creditsRemainingPercent={creditsRemaining} />
          )}
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{content.header.title}</h1>
              <p className="text-muted-foreground mt-1">
                {content.header.welcomeBack}{user?.name ? `, ${user.name}` : ""}{content.header.welcomeMessage}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {getUserInitials(user)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{user?.name || content.header.userFallback}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* AI Credits Balance */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {isTrialing ? content.statsCards.aiCredits.trialTitle : content.statsCards.aiCredits.paidTitle}
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{creditsRemaining}%</div>
                <p className="text-xs text-muted-foreground">
                  {isTrialing
                    ? content.statsCards.aiCredits.trialSubtext
                    : content.statsCards.aiCredits.paidSubtext}
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

            {/* Subscription Status */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {content.statsCards.subscription.title}
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user?.planName || content.statsCards.subscription.noPlan}
                </div>
                <div className="mt-2">
                  <Badge variant={status.variant} className="text-xs">
                    {status.text}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Account Type */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {content.statsCards.accountType.title}
                </CardTitle>
                <UserIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{content.statsCards.accountType.type}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {content.statsCards.accountType.subtext}
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
                <CardTitle>{content.quickActions.title}</CardTitle>
                <CardDescription>
                  {content.quickActions.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {/* AI Chat */}
                  <Link
                    href={content.quickActions.actions[0].href}
                    className="group flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{content.quickActions.actions[0].title}</p>
                      <p className="text-xs text-muted-foreground">
                        {content.quickActions.actions[0].description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>

                  {/* Activity Logs */}
                  <Link
                    href={content.quickActions.actions[1].href}
                    className="group flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <ActivityIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{content.quickActions.actions[1].title}</p>
                      <p className="text-xs text-muted-foreground">
                        {content.quickActions.actions[1].description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>

                  {/* Settings */}
                  <Link
                    href={content.quickActions.actions[2].href}
                    className="group flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{content.quickActions.actions[2].title}</p>
                      <p className="text-xs text-muted-foreground">
                        {content.quickActions.actions[2].description}
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
                          <p className="font-medium">{content.quickActions.actions[3].title}</p>
                          <p className="text-xs text-muted-foreground">
                            {content.quickActions.actions[3].description}
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
                <CardTitle>{content.recentActivity.title}</CardTitle>
                <CardDescription>{content.recentActivity.description}</CardDescription>
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
                          {log.action
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0) + word.slice(1).toLowerCase()
                            )
                            .join(" ")}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(log.timestamp), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {activityLogs.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {content.recentActivity.noActivity}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upgrade Card - Show for trial users */}
          {isTrialing && <UpgradeCard />}
        </div>
      )}
    </>
  );
}
