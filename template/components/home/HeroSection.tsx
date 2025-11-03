'use client';

import { useRef } from 'react';
import VariableProximity from '@/components/home/VariableProximity';

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={heroRef} className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
      <VariableProximity
        label="Access 15+ premium AI models from one unified interface. Track usage with advanced analytics, manage conversations seamlessly, and optimize your AI costs with transparent credit-based pricing."
        fromFontVariationSettings="'wght' 400, 'wdth' 100"
        toFontVariationSettings="'wght' 700, 'wdth' 125"
        containerRef={heroRef}
        radius={120}
        falloff="exponential"
      />
    </div>
  );
}
