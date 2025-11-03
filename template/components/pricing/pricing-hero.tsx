'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/magicui/text-animate';
import { Meteors } from '@/components/ui/meteors';
import { MagicCard } from '@/components/ui/magic-card';
import { Ripple } from '@/components/ui/ripple';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { checkoutAction } from '@/lib/payments/actions';
import { cn } from '@/lib/utils';
import content from './content.json';

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

interface PricingHeroProps {
  products: Product[];
}

export function PricingHero({ products }: PricingHeroProps) {
  const [isYearly, setIsYearly] = useState(false);

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  const calculateSavings = (monthlyPrice: number, yearlyPrice: number) => {
    const monthlyCost = monthlyPrice * 12;
    const savings = monthlyCost - yearlyPrice;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { amount: savings, percentage };
  };

  const handleSubscribe = async (priceId: string) => {
    const formData = new FormData();
    formData.append('priceId', priceId);
    await checkoutAction(formData);
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Ripple Background */}
      <div className="absolute inset-0 -z-10">
        <Ripple
          mainCircleSize={300}
          mainCircleOpacity={0.15}
          numCircles={6}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* Hero Header */}
        <div className="text-center mb-16 space-y-6">
          <BlurFade delay={0.1}>
            <Badge variant="outline" className="px-4 py-2 bg-background/60 backdrop-blur-sm border-primary/20">
              <Sparkles className="w-4 h-4 mr-2 text-primary" />
              {content.hero.badge}
            </Badge>
          </BlurFade>

          <BlurFade delay={0.2}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              <TextAnimate
                animation="blurInUp"
                by="word"
                className="text-foreground"
              >
                {content.hero.title}
              </TextAnimate>
            </h1>
          </BlurFade>

          <BlurFade delay={0.3}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {content.hero.description}
            </p>
          </BlurFade>
        </div>

        {/* Billing Toggle */}
        <BlurFade delay={0.4}>
          <div className="flex items-center justify-center gap-4 mb-16">
            <Label htmlFor="billing-toggle" className={cn(
              "font-semibold text-lg transition-colors",
              !isYearly ? "text-foreground" : "text-muted-foreground"
            )}>
              {content.hero.billingToggle.monthly}
            </Label>
            <Switch
              id="billing-toggle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-primary"
            />
            <Label htmlFor="billing-toggle" className={cn(
              "font-semibold text-lg transition-colors",
              isYearly ? "text-foreground" : "text-muted-foreground"
            )}>
              {content.hero.billingToggle.yearly}
              <Badge variant="default" className="ml-2 animate-pulse">
                {content.hero.billingToggle.savingsBadge}
              </Badge>
            </Label>
          </div>
        </BlurFade>

        {/* Pricing Cards */}
        <div className="flex flex-wrap justify-center items-stretch gap-8 max-w-7xl mx-auto">
          {products.map((product, index) => {
            const price = product.prices.find((p) =>
              isYearly ? p.interval === 'year' : p.interval === 'month'
            );

            if (!price) return null;

            const monthlyPrice = product.prices.find(p => p.interval === 'month');
            const yearlyPrice = product.prices.find(p => p.interval === 'year');
            const savings = monthlyPrice && yearlyPrice
              ? calculateSavings(monthlyPrice.unitAmount, yearlyPrice.unitAmount)
              : null;

            return (
              <BlurFade key={product.id} delay={0.5 + index * 0.1} className="w-full sm:w-[380px] flex">
                <div className="relative w-full flex flex-col">
                  {product.isRecommended && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                      <Badge className="px-6 py-2 text-sm font-semibold shadow-lg">
                        {content.hero.card.mostPopularBadge}
                      </Badge>
                    </div>
                  )}

                  <MagicCard
                    className={cn(
                      "relative overflow-hidden flex-1 h-full",
                      product.isRecommended
                        ? "border-primary shadow-xl"
                        : "border-border"
                    )}
                  >
                    {/* Meteors Effect on Recommended Card */}
                    {product.isRecommended && (
                      <div className="absolute inset-0 overflow-hidden">
                        <Meteors number={12} />
                      </div>
                    )}

                    <div className="p-8 flex flex-col h-full relative z-10">
                      {/* Name at the Top */}
                      <div className="text-center mb-4">
                        <h3 className="text-2xl font-bold">
                          {product.name}
                        </h3>
                      </div>

                      {/* Price */}
                      <div className="text-center mb-6">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={isYearly ? 'yearly' : 'monthly'}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-2"
                          >
                            <div>
                              <span className="text-5xl font-bold">
                                {formatPrice(price.unitAmount, price.currency)}
                              </span>
                              <span className="text-muted-foreground ml-2 text-lg">
                                / {isYearly ? content.hero.card.priceInterval.year : content.hero.card.priceInterval.month}
                              </span>
                            </div>

                            {isYearly && savings && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-block"
                              >
                                <Badge variant="secondary" className="text-sm">
                                  {content.hero.card.savingsPrefix} {formatPrice(savings.amount, price.currency)}{content.hero.card.savingsSuffix}
                                </Badge>
                              </motion.div>
                            )}

                            {isYearly && (
                              <p className="text-sm text-muted-foreground">
                                {content.hero.card.billedAnnually}
                              </p>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {/* Description */}
                      <div className="text-center mb-6">
                        <p className="text-base text-muted-foreground">
                          {product.description}
                        </p>
                      </div>

                      {/* Trial Period Badge */}
                      <div className="flex justify-center mb-6">
                        <Badge variant="outline" className="px-4 py-2 bg-primary/5 border-primary/20">
                          <Sparkles className="w-3 h-3 mr-2" />
                          {isYearly ? content.hero.card.trialBadge.yearly : content.hero.card.trialBadge.monthly}
                        </Badge>
                      </div>

                      {/* Features List - with flex-grow to push button down */}
                      <div className="flex-grow mb-6">
                        <ul className="space-y-3">
                          {product.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-sm leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Button at the Bottom */}
                      <div className="mt-auto">
                        <Button
                          className="w-full"
                          size="lg"
                          variant={product.isRecommended ? 'default' : 'outline'}
                          onClick={() => handleSubscribe(price.id)}
                        >
                          {content.hero.card.ctaButton}
                        </Button>
                      </div>
                    </div>
                  </MagicCard>
                </div>
              </BlurFade>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <BlurFade delay={0.8}>
          <div className="mt-16 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
              {content.hero.trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>{indicator}</span>
                </div>
              ))}
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
