'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Meteors } from '@/components/ui/meteors';
import { BlurFade } from '@/components/ui/blur-fade';
import content from './cta-content.json';

export function CTASection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <BlurFade delay={0.2}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
            {/* Meteors Effect */}
            <Meteors number={20} />

            {/* Content */}
            <div className="relative z-10 px-8 sm:px-12 py-16 sm:py-20 text-center">
              <div className="max-w-3xl mx-auto space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Sparkles className="h-4 w-4" />
                  {content.badge.text}
                </div>

                {/* Heading */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                  {content.heading.line1}
                  <br />
                  <span className="text-primary">{content.heading.line2}</span>
                </h2>

                {/* Description */}
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {content.description}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                  <Button size="lg" asChild className="w-full sm:w-auto">
                    <Link href={content.cta.primary.href} className="flex items-center gap-2">
                      {content.cta.primary.text}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                    <Link href={content.cta.secondary.href}>
                      {content.cta.secondary.text}
                    </Link>
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-muted-foreground">
                  {content.trustIndicators.map((indicator, index) => (
                    <div key={index} className="flex items-center gap-2">
                      ✓ {indicator}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
