'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Captured error boundary exception:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-12 text-center text-slate-100">
      <div className="max-w-md space-y-6">
        <div>
          <p className="text-sm uppercase tracking-wide text-leiden/80">Something went wrong</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            We couldn&apos;t load that page
          </h1>
          <p className="mt-3 text-sm text-slate-300">
            Our error boundary caught an unexpected issue. You can try again, or hop back to the
            homepage and continue exploring the demos.
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-slate-500">Reference id: {error.digest}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={reset} className="bg-leiden text-white hover:bg-leiden/90">
            Try again
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <Link href="/">Go to homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
