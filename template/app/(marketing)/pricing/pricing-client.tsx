'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';
import { checkoutAction } from '@/lib/payments/actions';

interface Price {
  id: string;
  unitAmount: number;
  currency: string;
  interval: string;
  nickname: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  features: string[];
  isRecommended: boolean;
  usageMultiplier: number;
  prices: Price[];
}

interface PricingClientProps {
  products: Product[];
}

export function PricingClient({ products }: PricingClientProps) {
  const [isYearly, setIsYearly] = useState(false);

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  const handleSubscribe = async (priceId: string) => {
    const formData = new FormData();
    formData.append('priceId', priceId);
    await checkoutAction(formData);
  };

  return (
    <div className="container mx-auto px-4 py-20 md:px-6 lg:px-8 md:py-32 lg:py-40">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your needs. All plans include a free trial.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <Label htmlFor="billing-toggle" className={!isYearly ? 'font-semibold' : ''}>
          Monthly
        </Label>
        <Switch
          id="billing-toggle"
          checked={isYearly}
          onCheckedChange={setIsYearly}
        />
        <Label htmlFor="billing-toggle" className={isYearly ? 'font-semibold' : ''}>
          Yearly
          <Badge variant="secondary" className="ml-2">
            Save 20%
          </Badge>
        </Label>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {products.map((product) => {
          const price = product.prices.find((p) =>
            isYearly ? p.interval === 'year' : p.interval === 'month'
          );

          if (!price) return null;

          return (
            <Card
              key={product.id}
              className={`relative ${
                product.isRecommended
                  ? 'border-primary shadow-lg'
                  : 'border-border'
              }`}
            >
              {product.isRecommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="px-4 py-1">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">
                  {product.name}
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  {product.description}
                </CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-bold">
                    {formatPrice(price.unitAmount, price.currency)}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    / {isYearly ? 'year' : 'month'}
                  </span>
                  {isYearly && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Billed annually
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Usage Multiplier Display */}
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {product.usageMultiplier}x
                    </span>{' '}
                    base usage included
                  </p>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  variant={product.isRecommended ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(price.id)}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* FAQ or Additional Info */}
      <div className="mt-16 text-center">
        <p className="text-sm text-muted-foreground">
          All plans include a 7-day free trial for monthly subscriptions and 14-day free trial for yearly subscriptions.
          <br />
          Cancel anytime. No questions asked.
        </p>
      </div>
    </div>
  );
}
