'use client';
import Navbar from '@/components/core/navbar';
import Footer from '@/components/core/footer';
import { useAuth } from '../hooks/use-auth';
import { I18nProvider } from '@/lib/i18n';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  return (
    <I18nProvider>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <Navbar user={user} loading={loading} />
        <main className="flex-1">
          <div className="w-full">{children}</div>
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
}
