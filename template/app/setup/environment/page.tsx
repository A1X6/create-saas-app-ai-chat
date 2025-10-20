'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, Database, CreditCard, Mail, Sparkles, Info, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { saveEnvironmentVariables, testAllConnections } from '@/lib/actions/environment-actions';

export default function EnvironmentPage() {
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [isSaving, startSaveTransition] = useTransition();
  const [isTesting, startTestTransition] = useTransition();

  const toggleSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (formData: FormData) => {
    startSaveTransition(async () => {
      const result = await saveEnvironmentVariables(formData);

      if (result.success) {
        toast.success('Configuration saved!', {
          description: result.message,
        });
      } else {
        toast.error('Failed to save configuration', {
          description: result.message,
        });
      }
    });
  };

  const handleTest = async (formData: FormData) => {
    startTestTransition(async () => {
      toast.info('Testing connections...', {
        description: 'Please wait while we validate your API keys',
      });

      const results = await testAllConnections(formData);

      // Show individual results
      if (results.supabase.valid) {
        toast.success('Supabase', { description: results.supabase.message });
      } else {
        toast.error('Supabase', { description: results.supabase.message });
      }

      if (results.stripe.valid) {
        toast.success('Stripe', { description: results.stripe.message });
      } else {
        toast.error('Stripe', { description: results.stripe.message });
      }

      if (results.resend.valid) {
        toast.success('Resend', { description: results.resend.message });
      } else {
        toast.error('Resend', { description: results.resend.message });
      }

      if (results.openrouter.valid) {
        toast.success('OpenRouter', { description: results.openrouter.message });
      } else {
        toast.error('OpenRouter', { description: results.openrouter.message });
      }

      // Overall summary
      const allValid = results.supabase.valid && results.stripe.valid && results.resend.valid && results.openrouter.valid;
      if (allValid) {
        toast.success('All connections validated!', {
          description: 'Your configuration is ready to use',
        });
      }
    });
  };

  return (
    <form className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">
          Environment Variables
        </h2>
        <p className="text-muted-foreground">
          Configure your environment variables for Supabase, Stripe, email, and AI services.
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          These values will be saved to your <code className="text-xs bg-muted px-1 rounded">.env.local</code> file.
          Make sure to restart your development server after saving.
        </AlertDescription>
      </Alert>

      {/* Supabase Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Supabase</CardTitle>
                <CardDescription>Database and authentication</CardDescription>
              </div>
            </div>
            <Badge variant="secondary">Required</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="supabase-url">Project URL</Label>
            <Input
              id="supabase-url"
              name="supabase-url"
              placeholder="https://xxxxx.supabase.co"
              type="url"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supabase-anon-key">Anon Key (Public)</Label>
            <div className="relative">
              <Input
                id="supabase-anon-key"
                name="supabase-anon-key"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                type={showSecrets['supabase-anon'] ? 'text' : 'password'}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => toggleSecret('supabase-anon')}
              >
                {showSecrets['supabase-anon'] ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="supabase-service-key">Service Role Key (Secret)</Label>
            <div className="relative">
              <Input
                id="supabase-service-key"
                name="supabase-service-key"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                type={showSecrets['supabase-service'] ? 'text' : 'password'}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => toggleSecret('supabase-service')}
              >
                {showSecrets['supabase-service'] ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="database-url">Database URL (Direct Connection)</Label>
            <div className="relative">
              <Input
                id="database-url"
                name="database-url"
                placeholder="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres"
                type={showSecrets['database-url'] ? 'text' : 'password'}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => toggleSecret('database-url')}
              >
                {showSecrets['database-url'] ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stripe Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Stripe</CardTitle>
                <CardDescription>Payment processing</CardDescription>
              </div>
            </div>
            <Badge variant="secondary">Required</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stripe-secret-key">Secret Key</Label>
            <div className="relative">
              <Input
                id="stripe-secret-key"
                name="stripe-secret-key"
                placeholder="sk_test_51..."
                type={showSecrets['stripe-secret'] ? 'text' : 'password'}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => toggleSecret('stripe-secret')}
              >
                {showSecrets['stripe-secret'] ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stripe-publishable-key">Publishable Key</Label>
            <Input
              id="stripe-publishable-key"
              name="stripe-publishable-key"
              placeholder="pk_test_51..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stripe-webhook-secret">Webhook Secret</Label>
            <div className="relative">
              <Input
                id="stripe-webhook-secret"
                name="stripe-webhook-secret"
                placeholder="whsec_..."
                type={showSecrets['stripe-webhook'] ? 'text' : 'password'}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => toggleSecret('stripe-webhook')}
              >
                {showSecrets['stripe-webhook'] ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Resend (Email)</CardTitle>
                <CardDescription>Transactional emails</CardDescription>
              </div>
            </div>
            <Badge variant="secondary">Required</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resend-api-key">API Key</Label>
            <div className="relative">
              <Input
                id="resend-api-key"
                name="resend-api-key"
                placeholder="re_..."
                type={showSecrets['resend'] ? 'text' : 'password'}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => toggleSecret('resend')}
              >
                {showSecrets['resend'] ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="resend-from">From Email</Label>
            <Input
              id="resend-from"
              name="resend-from"
              placeholder="noreply@yourdomain.com"
              type="email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resend-to">To Email (Admin)</Label>
            <Input
              id="resend-to"
              name="resend-to"
              placeholder="admin@yourdomain.com"
              type="email"
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">OpenRouter (AI Chat)</CardTitle>
                <CardDescription>AI-powered chatbot</CardDescription>
              </div>
            </div>
            <Badge variant="secondary">Required</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openrouter-api-key">API Key</Label>
            <div className="relative">
              <Input
                id="openrouter-api-key"
                name="openrouter-api-key"
                placeholder="sk-or-v1-..."
                type={showSecrets['openrouter'] ? 'text' : 'password'}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => toggleSecret('openrouter')}
              >
                {showSecrets['openrouter'] ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ai-temperature">AI Temperature (0.0 - 2.0)</Label>
            <Input
              id="ai-temperature"
              name="ai-temperature"
              placeholder="0.7"
              type="number"
              min="0"
              max="2"
              step="0.1"
              defaultValue="0.7"
              required
            />
            <p className="text-sm text-muted-foreground">
              Controls creativity: 0.0 = deterministic, 2.0 = very creative. Recommended: 0.7 for balanced responses.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1"
          type="submit"
          disabled={isSaving}
          formAction={handleSave}
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </Button>
        <Button
          size="lg"
          variant="outline"
          type="button"
          disabled={isTesting}
          onClick={(e) => {
            const form = e.currentTarget.closest('form');
            if (form) {
              const formData = new FormData(form);
              handleTest(formData);
            }
          }}
        >
          {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isTesting ? 'Testing...' : 'Test Connections'}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <Button asChild variant="outline" className="gap-2" type="button">
          <Link href="/setup">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </Button>
        <Button asChild className="gap-2" type="button">
          <Link href="/setup/database">
            Next: Database
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </form>
  );
}
