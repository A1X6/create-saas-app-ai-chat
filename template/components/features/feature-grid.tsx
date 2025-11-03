'use client';

import {
  Sparkles,
  Zap,
  Shield,
  TrendingUp,
  Users,
  BookOpen,
  LucideIcon
} from 'lucide-react';
import { MagicCard } from '@/components/ui/magic-card';
import { BlurFade } from '@/components/ui/blur-fade';
import content from './content.json';

const { featureGrid } = content;

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  Zap,
  Shield,
  TrendingUp,
  Users,
  BookOpen,
};

export function FeatureGrid() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <BlurFade delay={0.2}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Core <span className="text-primary">{featureGrid.sectionHeader.titleHighlight}</span>
            </h2>
          </BlurFade>
          <BlurFade delay={0.3}>
            <p className="text-xl text-muted-foreground">
              {featureGrid.sectionHeader.description}
            </p>
          </BlurFade>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureGrid.features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon];
            return (
              <BlurFade key={feature.title} delay={0.2 + index * 0.1}>
                <MagicCard
                  className="h-full cursor-pointer group"
                >
                  <div className="p-6 space-y-4">
                    {/* Icon */}
                    <div className="p-3 rounded-xl bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </MagicCard>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
