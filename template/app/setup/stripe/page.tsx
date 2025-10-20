'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  XCircle,
  Loader2,
  Info,
  DollarSign,
  Zap,
  Plus,
  Trash2,
  Edit,
  Save,
  X as XIcon,
} from 'lucide-react';
import { useState, useEffect, useTransition } from 'react';
import { toast } from 'sonner';
import {
  listStripeProducts,
  syncStripeProducts,
  syncUserProducts,
  verifyStripeConnection,
  saveProfitMargin,
} from '@/lib/actions/stripe-actions';
import { calculateAICredits } from '@/lib/utils/stripe-utils';
import { ProductForm } from './product-form';

type StripeStatus = {
  connected: boolean;
  account?: any;
  products: any[];
  productsCount: number;
};

type PriceInterval = 'month' | 'year';

type ProductPrice = {
  nickname: string;
  unitAmount: number;
  currency: string;
  interval: PriceInterval;
};

type Product = {
  id?: string;
  name: string;
  description: string;
  features: string[];
  prices: ProductPrice[];
  metadata: {
    tier: string;
    ai_credits_amount: string;
    recommended?: string;
  };
};

export default function StripePage() {
  const [status, setStatus] = useState<StripeStatus | null>(null);
  const [profitMargin, setProfitMargin] = useState<number>(12);
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isChecking, startCheckTransition] = useTransition();
  const [isSyncing, startSyncTransition] = useTransition();
  const [isSavingProfit, startSaveProfitTransition] = useTransition();

  // Auto-check Stripe status on mount
  useEffect(() => {
    checkStripeStatus();
  }, []);

  const checkStripeStatus = () => {
    startCheckTransition(async () => {
      toast.info('Checking Stripe status...', {
        description: 'Verifying connection and products',
      });

      try {
        // Verify connection
        const connectionResult = await verifyStripeConnection();

        if (!connectionResult.success) {
          toast.error('Stripe connection failed', {
            description: connectionResult.message,
          });
          setStatus({
            connected: false,
            products: [],
            productsCount: 0,
          });
          return;
        }

        // List products
        const productsResult = await listStripeProducts();

        setStatus({
          connected: true,
          account: connectionResult.account,
          products: productsResult.products,
          productsCount: productsResult.products.length,
        });

        toast.success('Stripe connected!', {
          description: `Found ${productsResult.products.length} products in your account`,
        });
      } catch (error) {
        toast.error('Failed to check Stripe status', {
          description: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });
  };

  const handleSyncProducts = () => {
    if (products.length === 0) {
      toast.error('No products to sync', {
        description: 'Please add at least one product before syncing',
      });
      return;
    }

    startSyncTransition(async () => {
      toast.info('Syncing products...', {
        description: `Creating/updating ${products.length} product(s) in Stripe`,
      });

      const result = await syncUserProducts(JSON.stringify(products));

      if (result.success) {
        toast.success('Products synced!', {
          description: result.message,
        });
        // Refresh status
        checkStripeStatus();
      } else {
        toast.error('Failed to sync products', {
          description: result.message,
        });
      }
    });
  };

  const handleSaveProfitMargin = () => {
    startSaveProfitTransition(async () => {
      const result = await saveProfitMargin(profitMargin);

      if (result.success) {
        toast.success('Profit margin saved!', {
          description: result.message,
        });
      } else {
        toast.error('Failed to save profit margin', {
          description: result.message,
        });
      }
    });
  };

  const handleAddProduct = () => {
    setIsAddingProduct(true);
  };

  const handleSaveNewProduct = (product: Product) => {
    setProducts([...products, product]);
    setIsAddingProduct(false);
    toast.success('Product added!', {
      description: 'Product has been added to the list. Click "Sync to Stripe" to create it.',
    });
  };

  const handleEditProduct = (index: number) => {
    setEditingIndex(index);
  };

  const handleUpdateProduct = (index: number, product: Product) => {
    const updated = [...products];
    updated[index] = product;
    setProducts(updated);
    setEditingIndex(null);
    toast.success('Product updated!', {
      description: 'Product has been updated. Click "Sync to Stripe" to save changes.',
    });
  };

  const handleDeleteProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
    toast.success('Product removed!', {
      description: 'Product has been removed from the list.',
    });
  };

  const handleCancelEdit = () => {
    setIsAddingProduct(false);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Stripe Configuration</h2>
        <p className="text-muted-foreground">
          Sync products, configure pricing, and setup webhooks for payment processing.
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Product Configuration</AlertTitle>
        <AlertDescription>
          Create your subscription products below. Add pricing tiers, features, and AI token limits.
          Click "Sync to Stripe" to create/update products in your Stripe account.
        </AlertDescription>
      </Alert>

      {/* Product Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Products</CardTitle>
              <CardDescription>Configure your subscription plans (AI credits auto-calculated from monthly price - ${profitMargin.toFixed(2)})</CardDescription>
            </div>
            {!isAddingProduct && editingIndex === null && (
              <Button onClick={handleAddProduct} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Product Form */}
          {isAddingProduct && (
            <ProductForm
              profitMargin={profitMargin}
              onSave={handleSaveNewProduct}
              onCancel={handleCancelEdit}
            />
          )}

          {/* Product List */}
          {products.length === 0 && !isAddingProduct ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No products configured yet.</p>
              <p className="text-sm">Click "Add Product" to create your first subscription plan.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product, index) => (
                <div key={index}>
                  {editingIndex === index ? (
                    <ProductForm
                      product={product}
                      profitMargin={profitMargin}
                      onSave={(updated) => handleUpdateProduct(index, updated)}
                      onCancel={handleCancelEdit}
                    />
                  ) : (
                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{product.name}</h3>
                            {product.metadata.recommended === 'true' && (
                              <Badge variant="default" className="text-xs">Recommended</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{product.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{product.metadata.tier}</Badge>
                            <Badge variant="outline">${product.metadata.ai_credits_amount} AI credits</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditProduct(index)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProduct(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Features:</p>
                        <ul className="text-sm space-y-1">
                          {product.features.map((feature, fIndex) => (
                            <li key={fIndex} className="flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3 text-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Pricing:</p>
                        <div className="flex gap-2">
                          {product.prices.map((price, pIndex) => (
                            <Badge key={pIndex} variant="secondary">
                              {price.nickname}: ${(price.unitAmount / 100).toFixed(2)}/{price.interval}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connection Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Stripe Account</CardTitle>
                <CardDescription>Connection status and details</CardDescription>
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
          ) : status.connected && status.account ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-medium">Stripe account connected</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col p-3 bg-muted/50 rounded-lg">
                  <span className="text-xs text-muted-foreground">Account ID</span>
                  <span className="text-sm font-mono">{status.account.id}</span>
                </div>
                {status.account.email && (
                  <div className="flex flex-col p-3 bg-muted/50 rounded-lg">
                    <span className="text-xs text-muted-foreground">Email</span>
                    <span className="text-sm font-mono">{status.account.email}</span>
                  </div>
                )}
                <div className="flex flex-col p-3 bg-muted/50 rounded-lg">
                  <span className="text-xs text-muted-foreground">Country</span>
                  <span className="text-sm">{status.account.country?.toUpperCase()}</span>
                </div>
                <div className="flex flex-col p-3 bg-muted/50 rounded-lg">
                  <span className="text-xs text-muted-foreground">Type</span>
                  <span className="text-sm capitalize">{status.account.type}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="w-4 h-4" />
              <span className="font-medium">Stripe connection failed</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Products & Pricing</CardTitle>
                <CardDescription>Current products in Stripe</CardDescription>
              </div>
            </div>
            {status !== null && (
              <Badge variant="outline">{status.productsCount} Products</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === null ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading products...</span>
            </div>
          ) : status.productsCount > 0 ? (
            <div className="space-y-3">
              {status.products.map((product: any) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{product.name}</h4>
                      {product.metadata?.recommended === 'true' && (
                        <Badge variant="default" className="text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                    {product.metadata?.ai_credits_amount && (
                      <p className="text-xs text-muted-foreground">
                        AI Credits: ${product.metadata.ai_credits_amount}/month
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary">{product.active ? 'Active' : 'Inactive'}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                No products found in Stripe. Click "Sync Products" to create them from your configuration.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profit Margin Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Profit Margin</CardTitle>
              <CardDescription>Configure your monthly profit per user</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profit-margin">Profit Per User (Monthly)</Label>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-muted-foreground">$</span>
              <Input
                id="profit-margin"
                type="number"
                min="0"
                step="0.01"
                value={profitMargin}
                onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)}
                className="max-w-[200px]"
              />
              <Button
                onClick={handleSaveProfitMargin}
                disabled={isSavingProfit}
                size="sm"
              >
                {isSavingProfit && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSavingProfit ? 'Saving...' : 'Save'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This amount is subtracted from subscription prices to calculate AI credits. Recommended: $12.00
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Credit Calculator</CardTitle>
              <CardDescription>AI credit allocation formula</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <p className="text-sm font-medium">Formula:</p>
            <code className="text-xs block font-mono">
              AI Credits = Subscription Price - ${profitMargin.toFixed(2)} (Profit Margin)
            </code>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Example: Base Plan ($30/month)</p>
                <p className="text-sm">
                  Credits: <span className="font-mono">${calculateAICredits(3000, profitMargin).toFixed(2)}</span>
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Example: Plus Plan ($50/month)</p>
                <p className="text-sm">
                  Credits: <span className="font-mono">${calculateAICredits(5000, profitMargin).toFixed(2)}</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          size="lg"
          variant="outline"
          className="flex-1"
          onClick={checkStripeStatus}
          disabled={isChecking}
        >
          {isChecking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isChecking ? 'Checking...' : 'Refresh Status'}
        </Button>
        <Button
          size="lg"
          className="flex-1"
          onClick={handleSyncProducts}
          disabled={isSyncing || !status?.connected}
        >
          {isSyncing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSyncing ? 'Syncing...' : 'Sync Products'}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <Button asChild variant="outline" className="gap-2" type="button">
          <Link href="/setup/prompts">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </Button>
        <Button
          asChild
          className="gap-2"
          type="button"
          disabled={!status?.connected || status.productsCount === 0}
        >
          <Link href="/setup/finalize">
            Next: Finalize
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
