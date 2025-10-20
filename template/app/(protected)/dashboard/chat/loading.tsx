import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function ChatLoading() {
  return (
    <div className="h-full p-4 lg:p-8">
      <Card className="flex flex-col h-full">
        {/* Header Skeleton */}
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-9 w-40" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-2 w-full max-w-xs" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        {/* Chat Messages Skeleton */}
        <div className="flex-1 p-4 space-y-6 overflow-hidden">
          {/* Orb Skeleton */}
          <div className="flex justify-center items-center py-8">
            <Skeleton className="h-32 w-32 rounded-full" />
          </div>

          {/* Message Bubbles Skeleton */}
          <div className="space-y-4 max-w-3xl mx-auto">
            {/* User message */}
            <div className="flex justify-end">
              <div className="max-w-[80%] space-y-2">
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
            </div>

            {/* Assistant message */}
            <div className="flex justify-start">
              <div className="max-w-[80%] space-y-2">
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            </div>

            {/* User message */}
            <div className="flex justify-end">
              <div className="max-w-[80%] space-y-2">
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </div>

            {/* Assistant message */}
            <div className="flex justify-start">
              <div className="max-w-[80%] space-y-2">
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Input Area Skeleton */}
        <div className="p-4 border-t">
          <div className="max-w-3xl mx-auto space-y-3">
            <Skeleton className="h-24 w-full rounded-lg" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
