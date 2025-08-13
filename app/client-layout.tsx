'use client';
import Navbar from '@/components/core/navbar';
import Footer from '@/components/core/footer';
import { useAuth } from '../hooks/use-auth';
import { I18nProvider } from '@/lib/i18n';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  return (
    <I18nProvider>
      <Navbar user={user} loading={loading} />
      <main className="flex flex-grow items-center justify-center">{children}</main>
      <Footer />
    </I18nProvider>
  );
}
