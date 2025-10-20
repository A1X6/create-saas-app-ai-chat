'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  ArrowLeft,
  Database,
  CheckCircle2,
  XCircle,
  Loader2,
  Info,
  Table,
  AlertTriangle,
} from 'lucide-react';
import { useState, useEffect, useTransition } from 'react';
import { toast } from 'sonner';
import {
  testDatabaseConnection,
  checkTablesExist,
  getTableCounts,
  pushSchema,
  verifySchema,
} from '@/lib/actions/database-actions';

type DatabaseStatus = {
  connected: boolean;
  latency?: number;
  tablesExist: boolean;
  tables: string[];
  counts: Record<string, number>;
  schemaValid: boolean;
  issues: string[];
};

export default function DatabasePage() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [isChecking, startCheckTransition] = useTransition();
  const [isPushing, startPushTransition] = useTransition();

  // Auto-check connection on mount
  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = () => {
    startCheckTransition(async () => {
      toast.info('Checking database status...', {
        description: 'Testing connection and schema',
      });

      try {
        // Test connection
        const connectionResult = await testDatabaseConnection();

        if (!connectionResult.success) {
          toast.error('Database connection failed', {
            description: connectionResult.message,
          });
          setStatus({
            connected: false,
            tablesExist: false,
            tables: [],
            counts: {},
            schemaValid: false,
            issues: [connectionResult.message],
          });
          return;
        }

        // Check tables
        const tablesResult = await checkTablesExist();

        // Get counts if tables exist
        const countsResult = tablesResult.success
          ? await getTableCounts()
          : { success: false, counts: {}, message: 'Tables do not exist' };

        // Verify schema
        const schemaResult = await verifySchema();

        setStatus({
          connected: true,
          latency: connectionResult.latency,
          tablesExist: tablesResult.success,
          tables: tablesResult.tables,
          counts: countsResult.counts,
          schemaValid: schemaResult.success,
          issues: schemaResult.issues,
        });

        if (connectionResult.success && tablesResult.success && schemaResult.success) {
          toast.success('Database is ready!', {
            description: `Connected in ${connectionResult.latency}ms. All tables exist.`,
          });
        } else if (connectionResult.success && !tablesResult.success) {
          toast.warning('Database connected, but schema is missing', {
            description: 'Click "Push Schema" to create tables',
          });
        } else if (connectionResult.success && !schemaResult.success) {
          toast.warning('Schema issues detected', {
            description: schemaResult.message,
          });
        }
      } catch (error) {
        toast.error('Failed to check database', {
          description: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });
  };

  const handlePushSchema = () => {
    startPushTransition(async () => {
      toast.info('Pushing schema...', {
        description: 'This may take a few moments',
      });

      const result = await pushSchema();

      if (result.success) {
        toast.success('Schema pushed successfully!', {
          description: 'Your database is now ready to use',
        });
        // Refresh status after successful push
        checkDatabaseStatus();
      } else {
        toast.error('Failed to push schema', {
          description: result.message,
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Database Setup</h2>
        <p className="text-muted-foreground">
          Test your database connection and push the schema to Supabase.
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Database Configuration</AlertTitle>
        <AlertDescription>
          Your database connection is configured via the{' '}
          <code className="text-xs bg-muted px-1 rounded">DATABASE_URL</code> environment variable.
          Make sure you've completed the environment setup first.
        </AlertDescription>
      </Alert>

      {/* Connection Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Connection Status</CardTitle>
                <CardDescription>Database connectivity and latency</CardDescription>
              </div>
            </div>
            {status?.connected !== undefined && (
              <Badge variant={status.connected ? 'default' : 'destructive'}>
                {status.connected ? 'Connected' : 'Disconnected'}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === null ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Checking connection...</span>
            </div>
          ) : status.connected ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-medium">Database connection successful</span>
              </div>
              {status.latency && (
                <div className="text-sm text-muted-foreground">
                  Latency: <span className="font-mono">{status.latency}ms</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="w-4 h-4" />
                <span className="font-medium">Database connection failed</span>
              </div>
              {status.issues.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {status.issues[0]}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schema Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Table className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Schema Status</CardTitle>
                <CardDescription>Database tables and structure</CardDescription>
              </div>
            </div>
            {status?.tablesExist !== undefined && (
              <Badge variant={status.tablesExist ? 'default' : 'secondary'}>
                {status.tablesExist ? 'Ready' : 'Not Deployed'}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === null ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Checking schema...</span>
            </div>
          ) : status.tablesExist ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-medium">All required tables exist</span>
              </div>

              {/* Table Counts */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Table Statistics:</p>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(status.counts).map(([table, count]) => (
                    <div
                      key={table}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <span className="text-sm font-mono text-muted-foreground">
                        {table}
                      </span>
                      <Badge variant="outline">{count} rows</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schema Issues */}
              {!status.schemaValid && status.issues.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Schema Issues Detected</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      {status.issues.map((issue, i) => (
                        <li key={i} className="text-sm">
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Schema not deployed</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The database schema has not been pushed yet. Click "Push Schema" below to create the
                required tables.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          size="lg"
          variant="outline"
          className="flex-1"
          onClick={checkDatabaseStatus}
          disabled={isChecking}
        >
          {isChecking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isChecking ? 'Checking...' : 'Refresh Status'}
        </Button>
        <Button
          size="lg"
          className="flex-1"
          onClick={handlePushSchema}
          disabled={isPushing || !status?.connected}
        >
          {isPushing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPushing ? 'Pushing...' : 'Push Schema'}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <Button asChild variant="outline" className="gap-2" type="button">
          <Link href="/setup/environment">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </Button>
        <Button asChild className="gap-2" type="button" disabled={!status?.tablesExist}>
          <Link href="/setup/prompts">
            Next: Prompts
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
