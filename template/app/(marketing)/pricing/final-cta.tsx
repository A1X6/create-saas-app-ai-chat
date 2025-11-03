'use client';

import { BlurFade } from '@/components/ui/blur-fade';
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text';
import { Button } from '@/components/ui/button';
import { Ripple } from '@/components/ui/ripple';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export function PricingFinalCTA() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <BlurFade delay={0.2}>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-1">
              {/* Ripple Background Effect */}
              <div className="absolute inset-0">
                <Ripple
                  mainCircleSize={250}
                  mainCircleOpacity={0.2}
                  numCircles={5}
                />
              </div>

              {/* Content */}
              <div className="relative z-10 px-8 sm:px-12 py-16 sm:py-20 bg-background/60 backdrop-blur-sm rounded-3xl">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <Sparkles className="h-4 w-4" />
                    Start Your Free Trial
                  </div>

                  {/* Heading */}
                  <div className="space-y-4">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                      Ready to Transform Your
                    </h2>
                    <AnimatedGradientText className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                      AI Workflow?
                    </AnimatedGradientText>
                  </div>

                  {/* Description */}
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Join thousands of professionals who are already mastering AI prompt
                    engineering. Start your free trial today.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <Button size="lg" asChild className="w-full sm:w-auto group">
                      <Link href="/auth/sign-up">
                        Start Free Trial
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      asChild
                      className="w-full sm:w-auto"
                    >
                      <Link href="/contact">Contact Sales</Link>
                    </Button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span>Transparent pricing</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span>7-day free trial</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span>Cancel anytime</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span>30-day money-back guarantee</span>
                    </div>
                  </div>

                  {/* Additional Links */}
                  <div className="pt-6 flex flex-wrap justify-center gap-6 text-sm">
                    <Link
                      href="/features"
                      className="text-primary hover:underline font-medium"
                    >
                      Explore Features
                    </Link>
                    <Link
                      href="/about"
                      className="text-primary hover:underline font-medium"
                    >
                      Learn About Us
                    </Link>
                    <Link
                      href="/dashboard/chat"
                      className="text-primary hover:underline font-medium"
                    >
                      Try the Platform
                    </Link>
                  </div>

                  {/* Money-back Guarantee Badge */}
                  <div className="pt-8">
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card/60 backdrop-blur-sm border border-border">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span className="font-semibold">30-Day Money-Back Guarantee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
