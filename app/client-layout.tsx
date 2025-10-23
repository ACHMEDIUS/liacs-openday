'use client';

import Navbar from '@/components/core/navbar/NavBar';
import Footer from '@/components/core/footer';
import { I18nProvider } from '@/lib/i18n';
import { useAuth } from '../hooks/use-auth';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const showLayoutFooter = pathname !== '/';

  return (
    <I18nProvider>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <Navbar user={user} loading={loading} />
        <main className="flex-1">
          <div className="w-full">{children}</div>
        </main>
        {showLayoutFooter && <Footer />}
      </div>
    </I18nProvider>
  );
}
