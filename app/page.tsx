'use client';

import QRCode from '@/components/common/qr-code';
import SimpleGradientBackground from '@/components/common/simple-gradient-background';
import Footer from '@/components/core/footer';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { SquareArrowOutUpRight } from 'lucide-react';

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <SimpleGradientBackground />

      <main className="relative z-10 flex h-screen w-screen items-center justify-center p-8">
        <section className="max-w-3xl text-center">
          <h1 className="mb-2 max-w-[600px] font-domine text-4xl font-bold leading-[1.2] text-white drop-shadow-2xl">
            {t.home.title}
          </h1>
          <p className="mb-8 font-domine text-white drop-shadow-xl">{t.home.subtitle}</p>

          {/* QR Code */}
          <div className="relative mx-auto mb-8 flex justify-center">
            <div className="relative z-10 rounded-lg p-4">
              <QRCode
                data="https://becomeastudent.dev"
                width={250}
                height={250}
                dotsOptions={{
                  color: '#001158',
                  type: 'rounded',
                }}
                backgroundOptions={{
                  color: 'transparent',
                }}
                cornersSquareOptions={{
                  color: '#001158',
                  type: 'extra-rounded',
                }}
                cornersDotOptions={{
                  color: '#001158',
                  type: 'dot',
                }}
              />
            </div>
          </div>

          {/* CTA Button */}
          <div className="relative mx-auto mt-6 flex justify-center">
            <Link
              href="https://becomeastudent.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg border-2 bg-white px-8 py-4 font-domine text-lg font-semibold text-leiden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{
                animation: 'breathingGlowBorder 2.5s ease-in-out infinite',
              }}
            >
              {/* Breathing background glow */}
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  animation: 'breathingGlow 3s ease-in-out infinite',
                }}
              ></div>

              {/* Breathing ripple effects */}
              <div
                className="absolute inset-0 rounded-lg border-2"
                style={{
                  animation: 'breathingRipple 4s ease-in-out infinite',
                }}
              ></div>
              <div
                className="absolute inset-0 rounded-lg border-2"
                style={{
                  animation: 'breathingRipple 4s ease-in-out infinite',
                  animationDelay: '2s',
                }}
              ></div>

              {/* Breathing border glow */}
              <div
                className="absolute inset-0 rounded-lg border"
                style={{
                  animation: 'breathingBorder 3.5s ease-in-out infinite',
                }}
              ></div>

              {/* Button content */}
              <span className="relative z-10">Become a Student Dev</span>
              <SquareArrowOutUpRight className="relative z-10 h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Footer />
      </div>
    </div>
  );
}
