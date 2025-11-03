'use client';

import { FileText, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface ArtifactCardProps {
  title: string;
  onOpen: () => void;
}

export function ArtifactCardSkeleton() {
  return (
    <Card className="max-w-[80%] border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon skeleton */}
          <div className="flex-shrink-0 rounded-lg bg-primary/10 p-2.5">
            <FileText className="h-5 w-5 text-primary animate-pulse" />
          </div>

          {/* Content skeleton */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Badge skeleton */}
            <Badge variant="secondary" className="text-xs font-medium w-32">
              <Sparkles className="h-3 w-3 mr-1 animate-pulse" />
              <Skeleton className="h-3 w-20 bg-muted-foreground/20" />
            </Badge>

            {/* Title skeleton */}
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-full bg-muted-foreground/20" />
              <Skeleton className="h-4 w-3/4 bg-muted-foreground/20" />
            </div>

            {/* Button skeleton */}
            <Skeleton className="h-8 w-28 mt-2 bg-muted-foreground/20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ArtifactCard({ title, onOpen }: ArtifactCardProps) {
  // Truncate title if too long
  const displayTitle = title.length > 80 ? `${title.substring(0, 80)}...` : title;

  return (
    <Card
      className="max-w-[80%] cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] group border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10"
      onClick={onOpen}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 rounded-lg bg-primary/10 p-2.5 group-hover:bg-primary/20 transition-colors">
            <FileText className="h-5 w-5 text-primary" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Badge */}
            <Badge variant="secondary" className="text-xs font-medium">
              <Sparkles className="h-3 w-3 mr-1" />
              Execution Plan
            </Badge>

            {/* Title */}
            <h4 className="text-sm font-semibold leading-tight line-clamp-2">
              {displayTitle}
            </h4>

            {/* View Button */}
            <Button
              size="sm"
              variant="outline"
              className="mt-2 w-full sm:w-auto"
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
            >
              View Prompt
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
