'use client';

import Image from 'next/image';

export default function HomePage() {
  return (
    <section className="flex items-center justify-center bg-white p-8">
      <section className="max-w-3xl text-center">
        <h1 className="mb-2 max-w-[600px] text-4xl font-bold leading-[1.2] text-black drop-shadow-xl">
          Open Day of the Leiden Institute of Advanced Computer Science
        </h1>
        <p className="mb-6 text-black drop-shadow-xl">
          Answer the questionnaire below for some awesome Merch!
        </p>
        <Image src="/qr-code.png" alt="QR Code" className="mx-auto mb-6" width={200} height={200} />
      </section>
    </section>
  );
}
