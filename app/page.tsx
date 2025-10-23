'use client';

import QRCode from '@/components/common/qr-code';
import SimpleGradientBackground from '@/components/common/HeroBackground';
import Footer from '@/components/core/footer';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { SquareArrowOutUpRight } from 'lucide-react';

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SimpleGradientBackground />

      <main className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 py-16">
        <section className="max-w-3xl text-center">
          <div className="flex flex-col items-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
              {t.home.badge}
            </span>
            <h1 className="mb-2 max-w-[600px] font-domine text-4xl font-bold leading-[1.2] text-white drop-shadow-2xl">
              {t.home.title}
            </h1>
            <p className="mb-8 max-w-xl font-domine text-white drop-shadow-xl">{t.home.subtitle}</p>

            <div className="relative mx-auto mb-8 flex justify-center">
              <QRCode
                data="https://becomeastudent.dev"
                width={240}
                height={240}
                dotsOptions={{
                  color: '#f8fafc',
                  type: 'rounded',
                }}
                backgroundOptions={{
                  color: 'transparent',
                }}
                cornersSquareOptions={{
                  color: '#f8fafc',
                  type: 'extra-rounded',
                }}
                cornersDotOptions={{
                  color: '#f8fafc',
                  type: 'dot',
                }}
              />
            </div>

            <div className="relative mx-auto mt-2 flex justify-center">
              <Link
                href="https://becomeastudent.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-blue-500 px-8 py-3 font-semibold text-white shadow-[0px_25px_65px_-30px_rgba(56,189,248,0.6)] transition duration-300 hover:scale-105 hover:shadow-[0px_35px_85px_-35px_rgba(56,189,248,0.7)]"
              >
                <span>{t.home.ctaPrimary}</span>
                <SquareArrowOutUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-20">
        <Footer />
      </div>
    </div>
  );
}
