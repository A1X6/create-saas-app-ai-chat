'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

interface OrbProps {
  colors?: [string, string];
  agentState?: 'idle' | 'thinking' | 'speaking';
}

// Lazy load the heavy 3D Orb component
const OrbDynamic = dynamic(() => import('./orb').then(mod => ({ default: mod.Orb })), {
  ssr: false, // Don't render on server (3D canvas requires browser)
  loading: () => (
    <div className="flex items-center justify-center w-full h-full min-h-[100px]">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  ),
});

export function OrbLazy({ colors, agentState }: OrbProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center w-full h-full min-h-[100px]">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <OrbDynamic colors={colors} agentState={agentState} />
    </Suspense>
  );
}
