'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-leiden py-4 text-center">
      <p className="text-sm text-white">
        Powered by{' '}
        <Link
          href="https://betterludev.nl"
          className="text-science hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          betterludev
        </Link>
      </p>
    </footer>
  );
}
