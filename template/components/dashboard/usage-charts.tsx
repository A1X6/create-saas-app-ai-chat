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
  const isSubscribed = isTrialing || hasActiveSubscription;

  // Chart configuration for tooltips
  const chartConfig = {
    usage: {
      label: 'Usage %',
    },
  } satisfies ChartConfig;

  // Show charts for trial and paid users
  if (isSubscribed) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {/* Weekly Credits Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Credits Usage</CardTitle>
            <CardDescription>
              Daily credit usage as % of your total allocation (last 7 days)
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

        {/* Monthly Credits Trend */}
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
      </div>
    );
  }

  // Unsubscribed users - Show upgrade message
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Usage Analytics
        </CardTitle>
        <CardDescription>
          Subscribe to track your AI usage patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Sparkles className="h-12 w-12 text-primary mb-4" />
        <h3 className="text-xl font-semibold mb-2">Subscribe to Access Analytics</h3>
        <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
          Get AI credits and detailed usage analytics when you subscribe. Start your trial with $1 credit today.
        </p>
        <a
          href="/pricing"
          className="text-sm font-medium text-primary hover:underline"
        >
          View Pricing Plans →
        </a>
      </CardContent>
    </Card>
  );
}
