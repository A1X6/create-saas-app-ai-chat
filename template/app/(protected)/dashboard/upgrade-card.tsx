'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { endTrialEarlyAction } from '@/lib/actions/subscription-actions';
import { customerPortalAction } from '@/lib/payments/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function UpgradeCard() {
  const router = useRouter();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setIsUpgrading(true);

    try {
      const result = await endTrialEarlyAction();

      if (result.success) {
        toast.success('Upgraded! Your full plan is now active.');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to upgrade');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      toast.error('Failed to upgrade. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Trial Active
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Upgrade now to unlock full plan usage and continue your work without interruption.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleUpgrade}
            disabled={isUpgrading}
          >
            {isUpgrading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Upgrading...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade to Full Plan
              </>
            )}
          </Button>
          <form action={customerPortalAction}>
            <Button
              type="submit"
              variant="outline"
              disabled={isUpgrading}
            >
              Manage Subscription
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
