'use client';

import { Fragment } from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/magicui/text-animate';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check, X } from 'lucide-react';
import content from './content.json';

export function FeatureComparison() {
  const { featureComparison } = content;

  const renderValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-primary mx-auto" />
      ) : (
        <X className="w-5 h-5 text-muted-foreground/40 mx-auto" />
      );
    }
    return <span className="text-sm font-medium text-foreground">{value}</span>;
  };

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <BlurFade delay={0.1}>
              <Badge variant="outline" className="px-4 py-2 bg-background/60 backdrop-blur-sm border-primary/20">
                {featureComparison.badge}
              </Badge>
            </BlurFade>
            <BlurFade delay={0.2}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                <TextAnimate
                  animation="blurInUp"
                  by="word"
                  className="text-foreground"
                >
                  {featureComparison.title}
                </TextAnimate>
              </h2>
            </BlurFade>
            <BlurFade delay={0.3}>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {featureComparison.description}
              </p>
            </BlurFade>
          </div>

          {/* Comparison Table */}
          <BlurFade delay={0.4}>
            <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-xl">
              {/* Mobile scroll hint */}
              <div className="lg:hidden px-4 py-2 text-xs text-muted-foreground text-center border-b border-border/50 bg-muted/20">
                {featureComparison.mobileScrollHint}
              </div>

              <div className="overflow-x-auto relative">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b-2 border-border/50">
                      <TableHead className="w-[200px] sm:w-[240px] sticky left-0 bg-card z-20 py-5 sm:py-6 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                        <span className="text-base sm:text-lg font-bold text-foreground">{featureComparison.tableHeaders.featuresColumn}</span>
                      </TableHead>
                      {featureComparison.tierNames.map((tierName, index) => (
                        <TableHead key={index} className="text-center min-w-[140px] sm:min-w-[160px] py-5 sm:py-6 bg-card">
                          <div className="font-bold text-base sm:text-lg text-foreground">{tierName}</div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {featureComparison.featureCategories.map((category, categoryIndex) => (
                      <Fragment key={`category-${categoryIndex}`}>
                        {/* Category Header */}
                        <TableRow className="bg-primary/5 hover:bg-primary/5 border-y border-border/50">
                          <TableCell className="sticky left-0 bg-primary/5 z-20 py-3 sm:py-4 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                            <span className="font-bold text-sm sm:text-base uppercase tracking-wider text-primary">
                              {category.name}
                            </span>
                          </TableCell>
                          <TableCell colSpan={3} className="bg-primary/5 py-3 sm:py-4"></TableCell>
                        </TableRow>

                        {/* Category Features */}
                        {category.features.map((feature, featureIndex) => (
                          <TableRow
                            key={`feature-${categoryIndex}-${featureIndex}`}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            <TableCell className="sticky left-0 bg-card z-20 font-medium text-foreground py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                              {feature.name}
                            </TableCell>
                            {feature.values.map((value, valueIndex) => (
                              <TableCell key={valueIndex} className="text-center py-3 sm:py-4 bg-card">
                                {renderValue(value)}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
