'use client';
import Navbar from '../components/core/navbar';
import Link from 'next/link';
import { useAuth } from '../hooks/use-auth';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  return (
    <>
      <Navbar user={user} loading={loading} />
      <main className="flex flex-grow items-center justify-center">{children}</main>
      <footer className="w-full bg-gray-100 py-4 text-center">
        <p className="text-sm text-gray-500">
          Powered by{' '}
          <Link
            href="https://codenecting.com"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            codenecting
          </Link>
        </p>
      </footer>
    </>
  );
}
