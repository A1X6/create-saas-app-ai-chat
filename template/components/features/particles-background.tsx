'use client';

import { Particles } from '@/components/ui/particles';

export function ParticlesBackground() {
  return (
    <Particles
      className="absolute inset-0 z-0"
      quantity={100}
      ease={80}
      color="#2b7fff"
      refresh
    />
  );
}
