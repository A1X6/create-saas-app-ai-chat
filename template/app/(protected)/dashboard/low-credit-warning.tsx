'use client';

import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2, Sparkles } from 'lucide-react';
import { endTrialEarlyAction } from '@/lib/actions/subscription-actions';
import { customerPortalAction } from '@/lib/payments/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import content from './low-credit-warning-content.json';

interface LowCreditWarningProps {
  creditsRemainingPercent: number;
}

export function LowCreditWarning({ creditsRemainingPercent }: LowCreditWarningProps) {
  const router = useRouter();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setIsUpgrading(true);

    try {
      const result = await endTrialEarlyAction();

      if (result.success) {
        toast.success(content.toasts.success);
        router.refresh();
      } else {
        toast.error(result.error || content.toasts.error);
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      toast.error(content.toasts.error);
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{content.alert.title}</AlertTitle>
      <AlertDescription>
        <p className="mb-3">
          {content.alert.message.replace('{percent}', creditsRemainingPercent.toString())}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleUpgrade}
            disabled={isUpgrading}
            size="sm"
          >
            {isUpgrading ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                {content.buttons.upgrade.loading}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-1" />
                {content.buttons.upgrade.text}
              </>
            )}
          </Button>
          <form action={customerPortalAction}>
            <Button
              type="submit"
              size="sm"
              variant="outline"
              disabled={isUpgrading}
            >
              {content.buttons.manageSubscription}
            </Button>
          </form>
        </div>
      </AlertDescription>
    </Alert>
  );
}
