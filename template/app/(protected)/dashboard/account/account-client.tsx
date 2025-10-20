'use client';

import { useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Lock,
  Loader2,
  Shield,
  KeyRound,
  Activity,
  LogIn,
  LogOut,
  UserPlus,
  KeySquare,
  RefreshCw,
  CreditCard,
  Ban,
  CheckCircle2,
} from 'lucide-react';
import { updateProfileAction, changePasswordAction } from '@/lib/actions/auth-actions';
import { customerPortalAction } from '@/lib/payments/actions';
import { toast } from 'sonner';
import type { ActivityLog } from '@/lib/db/schema';
import { formatDistanceToNow } from 'date-fns';

interface AccountPageClientProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    planName?: string | null;
    subscriptionStatus?: string | null;
  } | null;
  activityLogs: ActivityLog[];
}

type PasswordState = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  error?: string;
  success?: string;
} | null;

const getActivityIcon = (action: string) => {
  switch (action) {
    case 'SIGN_UP':
      return <UserPlus className="h-4 w-4" />;
    case 'SIGN_IN':
      return <LogIn className="h-4 w-4" />;
    case 'SIGN_OUT':
      return <LogOut className="h-4 w-4" />;
    case 'UPDATE_PASSWORD':
      return <KeySquare className="h-4 w-4" />;
    case 'UPDATE_ACCOUNT':
      return <RefreshCw className="h-4 w-4" />;
    case 'SUBSCRIPTION_CREATED':
      return <CreditCard className="h-4 w-4" />;
    case 'SUBSCRIPTION_UPDATED':
      return <RefreshCw className="h-4 w-4" />;
    case 'SUBSCRIPTION_CANCELED':
      return <Ban className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const getActivityColor = (action: string) => {
  switch (action) {
    case 'SIGN_UP':
    case 'SUBSCRIPTION_CREATED':
      return 'bg-green-500/10 text-green-700 border-green-500/20';
    case 'SIGN_IN':
      return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
    case 'SIGN_OUT':
      return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    case 'UPDATE_PASSWORD':
    case 'UPDATE_ACCOUNT':
    case 'SUBSCRIPTION_UPDATED':
      return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
    case 'SUBSCRIPTION_CANCELED':
      return 'bg-red-500/10 text-red-700 border-red-500/20';
    default:
      return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
  }
};

const formatActivityAction = (action: string) => {
  return action
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

export function AccountPageClient({ user, activityLogs }: AccountPageClientProps) {
  const [profileState, profileAction, isProfilePending] = useActionState(
    updateProfileAction,
    null
  );

  const [passwordState, passwordAction, isPasswordPending] = useActionState<
    PasswordState,
    FormData
  >(changePasswordAction, null);

  useEffect(() => {
    if (profileState?.error) {
      toast.error(profileState.error);
    } else if (profileState?.success) {
      toast.success(profileState.success);
    }
  }, [profileState]);

  useEffect(() => {
    if (passwordState?.error) {
      toast.error(passwordState.error);
    } else if (passwordState?.success) {
      toast.success(passwordState.success);
    }
  }, [passwordState]);

  // Subscription status checks
  const isTrialing = user?.subscriptionStatus === 'trialing';
  const hasActiveSubscription = user?.subscriptionStatus === 'active';
  const isUnsubscribed = !user?.subscriptionStatus || (!isTrialing && !hasActiveSubscription);

  const handleBillingPortal = async () => {
    await customerPortalAction();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account information, security settings, and activity history
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" action={profileAction}>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  defaultValue={user?.name || ''}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>
              <Button type="submit" disabled={isProfilePending}>
                {isProfilePending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription
            </CardTitle>
            <CardDescription>
              View and manage your subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user?.planName ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Plan</span>
                  <Badge variant="secondary">{user.planName}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge
                    variant={
                      hasActiveSubscription || isTrialing
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {user.subscriptionStatus || 'inactive'}
                  </Badge>
                </div>

                {/* Trial User - Show upgrade prompt */}
                {isTrialing && (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs text-muted-foreground">
                      You&apos;re currently on a trial period with access to free models only. Upgrade to unlock paid models with AI credits.
                    </p>
                    <Button asChild className="w-full">
                      <a href="/pricing">Upgrade to Paid Plan</a>
                    </Button>
                  </div>
                )}

                {/* Active Paid User - Show billing management */}
                {hasActiveSubscription && (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs text-muted-foreground">
                      Unlimited free models + AI credits for paid models
                    </p>
                    <Button
                      onClick={handleBillingPortal}
                      className="w-full"
                      variant="outline"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Manage Billing
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-4">
                  You don&apos;t have an active subscription
                </p>
                <Button asChild>
                  <a href="/pricing">View Plans</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Change your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" action={passwordAction}>
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={8}
                  maxLength={100}
                  defaultValue={passwordState?.currentPassword}
                  placeholder="Enter your current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={100}
                  defaultValue={passwordState?.newPassword}
                  placeholder="Enter your new password"
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  maxLength={100}
                  defaultValue={passwordState?.confirmPassword}
                  placeholder="Confirm your new password"
                />
              </div>
              <Button type="submit" disabled={isPasswordPending} className="w-full">
                {isPasswordPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Update Password
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Activity Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your recent account activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activityLogs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No activity logs found
              </p>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {activityLogs.slice(0, 10).map((log, index) => (
                  <div key={log.id}>
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border ${getActivityColor(
                          log.action
                        )}`}
                      >
                        {getActivityIcon(log.action)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">
                            {formatActivityAction(log.action)}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(log.timestamp), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        {log.ipAddress && (
                          <p className="text-xs text-muted-foreground">
                            IP: {log.ipAddress}
                          </p>
                        )}
                      </div>
                    </div>
                    {index < Math.min(activityLogs.length, 10) - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Security Tips Card - Full Width */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Tips
          </CardTitle>
          <CardDescription>
            Best practices for keeping your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3 sm:grid-cols-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Use a strong, unique password with at least 8 characters</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Include a mix of uppercase, lowercase, numbers, and symbols</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Don&apos;t reuse passwords from other accounts</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Change your password regularly for better security</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
