'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 py-4 text-center">
      <p className="text-sm text-gray-500">
        Powered by{' '}
        <Link
          href="https://betterludev.nl"
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          betterludev
        </Link>
      </p>
    </footer>
  );
}
