"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { Button } from "@/components/ui/button";
import { Ripple } from "@/components/ui/ripple";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import content from "./final-cta-content.json";

export function FinalCTA() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <BlurFade delay={0.2}>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-1">
              {/* Ripple Background Effect */}
              <div className="absolute inset-0">
                <Ripple
                  mainCircleSize={200}
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
                    {content.badge}
                  </div>

                  {/* Heading */}
                  <div className="space-y-4">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                      {content.heading}
                    </h2>
                    <AnimatedGradientText className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                      {content.headingHighlight}
                    </AnimatedGradientText>
                  </div>

                  {/* Description */}
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    {content.description} {'{{APP_NAME}}'}{content.descriptionSuffix}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <Button size="lg" asChild className="w-full sm:w-auto group">
                      <Link href="/auth/sign-up">
                        {content.buttons.primary}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      asChild
                      className="w-full sm:w-auto"
                    >
                      <Link href="/contact">{content.buttons.secondary}</Link>
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

                  {/* Additional Links */}
                  <div className="pt-6 flex flex-wrap justify-center gap-6 text-sm">
                    {content.links.map((link, index) => (
                      <Link
                        key={index}
                        href={link.href}
                        className="text-primary hover:underline font-medium"
                      >
                        {link.text}
                      </Link>
                    ))}
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
