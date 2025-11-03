'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

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

// Lazy load the heavy Recharts library
const UsageChartsDynamic = dynamic(
  () => import('./usage-charts').then(mod => ({ default: mod.UsageCharts })),
  {
    ssr: false, // Charts don't need SSR
    loading: () => (
      <div className="grid gap-4 md:grid-cols-2">
        {/* Weekly Usage Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Free Model Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>

        {/* Monthly Credits Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly AI Credits Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    ),
  }
);

export function UsageChartsLazy({ weeklyData, monthlyData, subscriptionStatus }: UsageChartsProps) {
  return (
    <Suspense
      fallback={
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Free Model Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Monthly AI Credits Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        </div>
      }
    >
      <UsageChartsDynamic
        weeklyData={weeklyData}
        monthlyData={monthlyData}
        subscriptionStatus={subscriptionStatus}
      />
    </Suspense>
  );
}
