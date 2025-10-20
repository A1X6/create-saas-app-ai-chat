"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle2,
  Rocket,
  Loader2,
  Info,
  Database,
  CreditCard,
  Settings,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { completeSetup } from "@/lib/actions/finalize-actions";
import { useRouter } from "next/navigation";

export default function FinalizePage() {
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);

  const handleCompleteSetup = async () => {
    try {
      setIsCompleting(true);

      toast.info("Completing setup...", {
        description: "Generating pages and finalizing configuration",
      });

      const result = await completeSetup();

      if (result.success) {
        toast.success("Setup complete!", {
          description: result.message,
          duration: 3000,
        });

        // Wait briefly so the user sees the success toast and loader
        await new Promise((res) => setTimeout(res, 1500));

        // Navigate to homepage
        await router.push("/");
      } else {
        toast.error("Failed to complete setup", {
          description: result.message,
        });
        setIsCompleting(false);
      }
    } catch (error) {
      toast.error("An unexpected error occurred", {
        description: error instanceof Error ? error.message : String(error),
      });
      setIsCompleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Setup Complete!</h2>
          <p className="text-muted-foreground">
            Review your configuration and finalize the setup process.
          </p>
        </div>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Ready to Launch</AlertTitle>
        <AlertDescription>
          All setup steps have been completed. Click "Complete Setup" to
          finalize the configuration and start using your application.
        </AlertDescription>
      </Alert>

      {/* Setup Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configuration Summary</CardTitle>
          <CardDescription>Review what you've configured</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Environment Variables</p>
                <p className="text-sm text-muted-foreground">
                  Supabase, Stripe, Email, AI
                </p>
              </div>
            </div>
            <Badge>Configured</Badge>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Database Schema</p>
                <p className="text-sm text-muted-foreground">
                  4 tables created
                </p>
              </div>
            </div>
            <Badge>Ready</Badge>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Stripe Products</p>
                <p className="text-sm text-muted-foreground">
                  Synced with pricing
                </p>
              </div>
            </div>
            <Badge>Synced</Badge>
          </div>
        </CardContent>
      </Card>

      {/* What Happens Next */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Rocket className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">What Happens Next</CardTitle>
              <CardDescription>When you click "Complete Setup"</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium mt-0.5">
              1
            </div>
            <div className="flex-1">
              <p className="font-medium">Update Environment Configuration</p>
              <p className="text-sm text-muted-foreground">
                Set{" "}
                <code className="text-xs bg-muted px-1 rounded">
                  SETUP_COMPLETE=true
                </code>{" "}
                in .env.local
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium mt-0.5">
              2
            </div>
            <div className="flex-1">
              <p className="font-medium">Setup Complete</p>
              <p className="text-sm text-muted-foreground">
                Your application is ready to use! You can now customize your
                landing page, legal pages, and start building your features.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complete Button */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1 gap-2"
          onClick={handleCompleteSetup}
          disabled={isCompleting}
        >
          {isCompleting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Completing Setup...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Complete Setup
            </>
          )}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex justify-start pt-4 border-t">
        <Button asChild variant="outline" className="gap-2" type="button">
          <Link href="/setup/stripe">
            <ArrowLeft className="w-4 h-4" />
            Back to Stripe
          </Link>
        </Button>
      </div>
    </div>
  );
}
