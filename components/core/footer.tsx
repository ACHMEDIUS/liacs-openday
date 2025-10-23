'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/95 py-4 text-center backdrop-blur-md">
      <p className="text-sm text-slate-300">
        Powered by{' '}
        <Link
          href="https://betterludev.nl"
          className="font-medium text-emerald-400 transition hover:text-emerald-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          betterludev
        </Link>
      </p>
    </footer>
  );
}
