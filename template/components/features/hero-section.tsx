"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TextAnimate } from "@/components/magicui/text-animate";
import { SparklesText } from "@/components/ui/sparkles-text";
import content from "./content.json";

const { heroSection } = content;

export function HeroSection() {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center">
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <TextAnimate
            animation="blurInUp"
            by="character"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
          >
            {heroSection.badge}
          </TextAnimate>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold">
              <TextAnimate
                animation="blurInUp"
                by="word"
                className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text"
              >
                {heroSection.heading.line1}
              </TextAnimate>
            </h1>
            <SparklesText
              className="text-4xl sm:text-5xl lg:text-7xl font-bold text-secondary-foreground"
              sparklesCount={10}
              colors={{
                first: "#2b7fff",
                second: "#1e6eef",
              }}
            >
              {heroSection.heading.line2}
            </SparklesText>
          </div>

          {/* Description */}
          <TextAnimate
            animation="blurInUp"
            by="word"
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            {heroSection.description}
          </TextAnimate>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" asChild className="group">
              <Link href={heroSection.cta.primary.href}>
                {heroSection.cta.primary.text}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={heroSection.cta.secondary.href}>{heroSection.cta.secondary.text}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
