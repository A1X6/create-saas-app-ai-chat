"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { TextAnimate } from "@/components/magicui/text-animate";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { Badge } from "@/components/ui/badge";
import { NumberTicker } from "@/components/magicui/number-ticker";
import {
  TrendingUp,
  Users,
  Sparkles,
  Globe,
  Award,
  Star,
  BarChart,
  Zap,
} from "lucide-react";
import content from "./stats-section-content.json";

export function StatsSection() {
  // Icon mapping
  const iconMap: Record<string, React.ComponentType<any>> = {
    TrendingUp,
    Users,
    Sparkles,
    Globe,
    Award,
    Star,
    BarChart,
    Zap,
  };

  const stats = content.stats.map((stat) => ({
    ...stat,
    icon: iconMap[stat.icon],
  }));

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="px-4 py-2 bg-background/60 backdrop-blur-sm border-primary/20">
              {content.sectionBadge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              <TextAnimate
                animation="blurInUp"
                by="word"
                className="text-foreground"
              >
                {content.sectionHeading}
              </TextAnimate>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {content.sectionDescription}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <BlurFade key={index} delay={0.1 + index * 0.05}>
                <div className="group relative overflow-hidden rounded-xl bg-card border border-border p-6 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="relative space-y-4">
                    {/* Icon */}
                    <div className="p-3 rounded-xl bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>

                    {/* Stat Number */}
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-foreground">
                          {stat.value >= 1000000 ? (
                            <>
                              <NumberTicker value={Math.floor(stat.value / 1000000)} />M
                            </>
                          ) : stat.value >= 1000 ? (
                            <>
                              <NumberTicker value={Math.floor(stat.value / 1000)} />K
                            </>
                          ) : (
                            <NumberTicker value={stat.value} />
                          )}
                        </span>
                        <span className="text-2xl font-bold text-primary">
                          {stat.suffix}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {stat.label}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>

          {/* Featured Stat Callout */}
          <BlurFade delay={0.6}>
            <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <AnimatedGradientText className="text-5xl sm:text-6xl lg:text-7xl font-bold">
                  {content.featuredCallout.heading}
                </AnimatedGradientText>
                <p className="text-xl text-muted-foreground">
                  {content.featuredCallout.description} {'{{APP_NAME}}'}
                </p>
                <div className="flex items-center justify-center gap-1 pt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-8 h-8 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {content.featuredCallout.rating}
                </p>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
