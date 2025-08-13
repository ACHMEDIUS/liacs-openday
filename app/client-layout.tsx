'use client';
import Navbar from '@/components/core/navbar';
import Footer from '@/components/core/footer';
import { useAuth } from '../hooks/use-auth';
import { I18nProvider } from '@/lib/i18n';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  return (
    <I18nProvider>
      <div className="flex h-screen w-screen flex-col overflow-hidden">
        <Navbar user={user} loading={loading} />
        <main className="flex-1 overflow-auto p-4 lg:flex lg:items-center lg:justify-center lg:p-0">
          {children}
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
}
