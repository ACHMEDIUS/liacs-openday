'use client';

import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <section className="flex h-screen w-full items-center justify-center bg-white" role="status">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </section>
  );
}
