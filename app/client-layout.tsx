'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from '@/components/core/navbar/NavBar';
import Footer from '@/components/core/footer';
import { I18nProvider } from '@/lib/i18n';
import { useAuth } from '../hooks/use-auth';
import { usePathname } from 'next/navigation';
import { GENERAL_SETTINGS_STORAGE_KEY } from '@/lib/constants';
import { DEFAULT_YOUTUBE_URL, toEmbedUrl } from '@/lib/youtube';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const showLayoutFooter = pathname !== '/';
  const [easterEggVisible, setEasterEggVisible] = useState(false);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const keyBufferRef = useRef('');
  const lastKeyTimeRef = useRef(0);
  const isDesktopRef = useRef(true);

  const updateEmbedUrl = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const stored = localStorage.getItem(GENERAL_SETTINGS_STORAGE_KEY);
      let link = DEFAULT_YOUTUBE_URL;
      if (stored) {
        const parsed = JSON.parse(stored) as { youtubeLink?: string };
        if (parsed.youtubeLink && parsed.youtubeLink.trim().length > 0) {
          link = parsed.youtubeLink.trim();
        }
      }
      const embed = toEmbedUrl(link) ?? toEmbedUrl(DEFAULT_YOUTUBE_URL);
      setEmbedUrl(embed);
    } catch (error) {
      console.error('Failed to read general settings:', error);
      setEmbedUrl(toEmbedUrl(DEFAULT_YOUTUBE_URL));
    }
  }, []);

  useEffect(() => {
    updateEmbedUrl();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === GENERAL_SETTINGS_STORAGE_KEY) {
        updateEmbedUrl();
      }
    };

    const handleCustom: EventListener = () => {
      updateEmbedUrl();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('general-settings-updated', handleCustom);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('general-settings-updated', handleCustom);
    };
  }, [updateEmbedUrl]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      isDesktopRef.current = !coarse;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isDesktopRef.current) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }

      if (event.key.length !== 1) {
        return;
      }

      const char = event.key.toLowerCase();
      if (!/[a-z]/.test(char)) {
        return;
      }

      const now = performance.now();
      if (now - lastKeyTimeRef.current > 1200) {
        keyBufferRef.current = '';
      }
      lastKeyTimeRef.current = now;

      keyBufferRef.current = (keyBufferRef.current + char).slice(-5);
      if (keyBufferRef.current === 'liacs') {
        setEasterEggVisible(true);
        keyBufferRef.current = '';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <I18nProvider>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <Navbar user={user} loading={loading} />
        <main className="flex-1">
          <div className="w-full">{children}</div>
        </main>
        {showLayoutFooter && <Footer />}
        {easterEggVisible && embedUrl ? (
          <div className="pointer-events-auto fixed bottom-4 right-4 z-[100]">
            <div
              className="relative w-[190px] overflow-hidden rounded-2xl border border-white/20 bg-slate-950/90 shadow-2xl"
              style={{ aspectRatio: '9 / 20' }}
            >
              <button
                type="button"
                onClick={() => setEasterEggVisible(false)}
                className="absolute right-2 top-2 z-10 rounded-full bg-black/70 px-2 py-1 text-xs text-white transition hover:bg-black/90"
                aria-label="Close LIACS easter egg"
              >
                Close
              </button>
              <iframe
                title="LIACS Easter Egg"
                src={embedUrl}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        ) : null}
      </div>
    </I18nProvider>
  );
}
