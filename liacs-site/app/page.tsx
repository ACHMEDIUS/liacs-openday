"use client";

import Image from "next/image";

export default function HomePage() {
  return (
    <section className="flex items-center justify-center p-8 bg-white">
      <section className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-2 text-black drop-shadow-xl max-w-[600px] leading-[1.2]">
          Leiden Institute of Advanced Computer Science
        </h1>
        <p className="mb-6 text-black drop-shadow-xl">
          Answer the questionnaire below for some awesome Merch!
        </p>
        <Image 
          src="/qr-code.png"
          alt="QR Code"
          className="mx-auto mb-6"
          width={200}
          height={200}
        />

        {/* <Link
          href="https://www.universiteitleiden.nl/onderwijs/opleidingen/bachelor/informatica/voorlichtingsactiviteiten"
          className="inline-block bg-leiden hover:bg-blue-900 transition-colors text-white font-semibold py-3 px-5 rounded"
          target="_blank"
          rel="noopener noreferrer"
        >
          More Info
        </Link> */}
      </section>
    </section>
  );
}
