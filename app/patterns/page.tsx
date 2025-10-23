'use client';

import { useEffect, useState } from 'react';
import { SierpinskiSection } from '@/components/app/patterns/sierpinski';
import { TruchetSection } from '@/components/app/patterns/truchet';
import { SpirographSection } from '@/components/app/patterns/spirograph';
import { UlamSpiralSection } from '@/components/app/patterns/ulam';
import { FibonacciSection } from '@/components/app/patterns/fibonacci';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileUnsupportedNotice } from '@/components/common/MobileNotice';

export default function PatternsPage() {
  const isMobile = useIsMobile();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return null;
  }

  if (isMobile) {
    return (
      <div className="container mx-auto px-4 py-12">
        <MobileUnsupportedNotice
          title="Interesting Patterns"
          description="The generative art gallery is desktop-only right now. Try again on a larger screen to watch the patterns unfold."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-12 px-4 py-12">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold text-leiden">Interesting Patterns</h1>
        <p className="max-w-3xl text-lg text-muted-foreground">
          A gallery of algorithmic art—each section animates slowly so you can watch the structure
          unfold. Adjust the controls to explore different tempos.
        </p>
      </header>

      <div className="flex flex-col gap-12">
        <SierpinskiSection />
        <TruchetSection />
        <SpirographSection />
        <UlamSpiralSection />
        <FibonacciSection />
      </div>
    </div>
  );
}
