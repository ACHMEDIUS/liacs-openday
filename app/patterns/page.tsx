'use client';

import { SierpinskiSection } from '@/components/app/patterns/sierpinski';
import { TruchetSection } from '@/components/app/patterns/truchet';
import { SpirographSection } from '@/components/app/patterns/spirograph';
import { UlamSpiralSection } from '@/components/app/patterns/ulam';
import { FibonacciSection } from '@/components/app/patterns/fibonacci';

export default function PatternsPage() {
  return (
    <div className="container mx-auto max-w-6xl space-y-12 px-4 py-12">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold text-leiden">Interesting Patterns</h1>
        <p className="max-w-3xl text-lg text-muted-foreground">
          A gallery of algorithmic art—each section animates slowly so you can watch the structure unfold. Adjust the controls to explore different tempos.
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
