'use client';

import { CheckCircle2, Sparkles, MessageSquare, BarChart3, LucideIcon } from 'lucide-react';
import { BlurFade } from '@/components/ui/blur-fade';
import content from './content.json';

const { detailedFeatures } = content;

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  MessageSquare,
  BarChart3,
  Sparkles,
};

export function DetailedFeatures() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="space-y-32">
          {detailedFeatures.features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon];
            return (
              <div
                key={feature.title}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <div
                  className={`space-y-6 ${
                    index % 2 === 1 ? 'lg:order-2' : ''
                  }`}
                >
                  <BlurFade delay={0.2}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                      {feature.badgePrefix} {index + 1}
                    </div>
                  </BlurFade>

                  <BlurFade delay={0.3}>
                    <h3 className="text-3xl sm:text-4xl font-bold">
                      {feature.title}
                    </h3>
                  </BlurFade>

                  <BlurFade delay={0.4}>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </BlurFade>

                  <BlurFade delay={0.5}>
                    <ul className="space-y-3">
                      {feature.featureList.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </BlurFade>
                </div>

                {/* Feature Showcase */}
                <div
                  className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}
                >
                  <BlurFade delay={0.3}>
                    <div className="relative p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                      {/* Icon */}
                      <div className="p-4 rounded-2xl bg-primary/10 w-fit mb-6">
                        <IconComponent className="h-12 w-12 text-primary" />
                      </div>

                      {/* Highlight Text */}
                      <div className="space-y-4">
                        <div className="text-2xl font-bold text-primary">
                          {feature.highlight}
                        </div>
                        <div className="h-1 w-20 bg-primary rounded-full" />
                      </div>
                    </div>
                  </BlurFade>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
