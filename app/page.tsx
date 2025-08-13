'use client';

import QRCode from '@/components/common/qr-code';
import AnimatedGridBackground from '@/components/common/animated-grid-background';
import { useI18n } from '@/lib/i18n';

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden">
      <AnimatedGridBackground />

      <main className="relative z-10 flex h-screen w-screen items-center justify-center p-8">
        <section className="max-w-3xl text-center">
          <h1 className="mb-2 max-w-[600px] text-4xl font-bold leading-[1.2] text-white drop-shadow-2xl">
            {t.home.title}
          </h1>
          <p className="mb-8 text-white drop-shadow-xl">{t.home.subtitle}</p>

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
        </section>
      </main>
    </div>
  );
}
