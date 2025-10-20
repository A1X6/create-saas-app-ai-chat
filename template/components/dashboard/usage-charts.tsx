'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Sparkles } from 'lucide-react';

interface WeeklyData {
  day: string;
  usage: number;
}

interface MonthlyData {
  month: string;
  usage: number;
}

interface UsageChartsProps {
  weeklyData: WeeklyData[];
  monthlyData: MonthlyData[];
  subscriptionStatus: string | null;
}

export function UsageCharts({ weeklyData, monthlyData, subscriptionStatus }: UsageChartsProps) {
  // Subscription status checks
  const isTrialing = subscriptionStatus === 'trialing';
  const hasActiveSubscription = subscriptionStatus === 'active';
  const isUnsubscribed = !subscriptionStatus || (!isTrialing && !hasActiveSubscription);

  // Chart configuration for tooltips
  const chartConfig = {
    usage: {
      label: 'Usage %',
    },
  } satisfies ChartConfig;

  // Trial users - Show unlimited message
  if (isTrialing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Usage Analytics
          </CardTitle>
          <CardDescription>
            Track your AI usage patterns and trends
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Sparkles className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Unlimited Free Model Usage</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            You&apos;re on a trial period with unlimited access to free models. Upgrade to a paid plan to unlock paid models with AI credits and see detailed analytics.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Token Usage Chart - Only for Unsubscribed Users */}
      {isUnsubscribed && (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Token Usage</CardTitle>
            <CardDescription>
              Daily token usage as % of your total monthly limit (last 7 days)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart data={weeklyData}>
                <XAxis
                  dataKey="day"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="usage"
                  fill="var(--primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Credits Trend - Only for Active Paid Users */}
      {hasActiveSubscription && (
        <Card>
          <CardHeader>
            <CardTitle>Credits Usage Trend</CardTitle>
            <CardDescription>
              Cumulative credit usage % over the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <LineChart data={monthlyData}>
                <XAxis
                  dataKey="month"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="usage"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Unlimited Message for Active Paid Users (Free Models) */}
      {hasActiveSubscription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Free Model Usage
            </CardTitle>
            <CardDescription>
              Your free model usage status
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Sparkles className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Unlimited</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Free models have no usage limits. Use AI credits for paid models with advanced capabilities.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Message for Unsubscribed Users */}
      {isUnsubscribed && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Unlock More Features
            </CardTitle>
            <CardDescription>
              Upgrade to get unlimited access
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Sparkles className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Subscribe for More</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
              Get unlimited access to free models and AI credits for paid models with advanced capabilities.
            </p>
            <a
              href="/pricing"
              className="text-sm font-medium text-primary hover:underline"
            >
              View Plans →
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
