'use client';

import Plasma from '@/components/home/Plasma';

export function PlasmaBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Plasma
        color="#2b7fff"
        speed={0.5}
        direction="forward"
        scale={1.2}
        opacity={0.35}
        mouseInteractive={false}
      />
    </div>
  );
}
