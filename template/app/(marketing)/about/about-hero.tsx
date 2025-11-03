"use client";

import { TextAnimate } from "@/components/magicui/text-animate";
import { SparklesText } from "@/components/ui/sparkles-text";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import content from "./about-hero-content.json";

export function AboutHero() {
  const stats = content.stats;

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-24">
      {/* Grid Background */}
      <GridPattern
        width={40}
        height={40}
        className={cn(
          "absolute inset-0 h-full w-full",
          "[mask-image:radial-gradient(ellipse_at_center,white,transparent_85%)]"
        )}
      />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="flex justify-center">
            <Badge variant="outline" className="px-4 py-2 bg-background/60 backdrop-blur-sm border-primary/20">
              <span className="font-medium">{content.badge} {'{{APP_NAME}}'}</span>
            </Badge>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold">
              <TextAnimate
                animation="blurInUp"
                by="word"
                className="text-foreground"
              >
                {content.heading}
              </TextAnimate>
            </h1>
            <SparklesText
              className="text-4xl sm:text-5xl lg:text-7xl font-bold"
              sparklesCount={8}
              colors={{
                first: "#2b7fff",
                second: "#1e6eef",
              }}
            >
              {content.headingHighlight}
            </SparklesText>
          </div>

          {/* Subheadline */}
          <div className="pt-4">
            <TextAnimate
              animation="blurInUp"
              by="word"
              className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              {content.description}
            </TextAnimate>
          </div>

          {/* Stats Banner */}
          <div className="pt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
                    {stat.label === "Founded" ? (
                      stat.value
                    ) : (
                      <NumberTicker value={stat.value} />
                    )}
                    {stat.label !== "Founded" && <span className="text-2xl">+</span>}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
