"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen overflow-hidden">

      {/* Hero / Header Section */}
      <section className="relative w-full h-[60vh] bg-gray-200 flex items-center justify-center">
        {/* Background Image */}
        <Image
          src="/building.jpg"
          alt="LIACS Faculty Building"
          fill
          className="object-cover object-center opacity-80"
        />
        
        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col items-center text-white max-w-2xl p-4 text-center">
          {/* Logo */}
          <div className="mb-4">
            <Image
              src="/UniversiteitLeidenLogo.svg"
              alt="Leiden University Logo"
              width={200}
              height={88} // aspect ratio ~799x353
              priority
            />
          </div>

          <h1 className="text-4xl font-bold mb-2">LIACS Open Day</h1>
          <p className="mb-6">
            Discover the Leiden Institute of Advanced Computer Science.
          </p>
          <Link
            href="https://www.universiteitleiden.nl/onderwijs/opleidingen/bachelor/informatica/voorlichtingsactiviteiten"
            className="inline-block bg-leiden hover:bg-blue-900 transition-colors text-white font-semibold py-3 px-5 rounded"
          >
            More Info
          </Link>
        </div>
      </section>

      {/* Content Section (Optional) */}
      <section className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="max-w-3xl text-center">
          <h2 className="text-2xl font-semibold mb-4">Why Visit the Open Day?</h2>
          <p className="mb-6">
            Join us to explore our facilities, meet our professors, and learn
            about our cutting-edge research in computer science. Whether you&apos;re
            a prospective student or just curious about what we do, you&apos;ll find
            plenty of inspiration and information at LIACS.
          </p>
          <Link
            href="https://www.universiteitleiden.nl"
            className="text-leiden underline"
          >
            Visit Leiden University&apos;s Official Website
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 text-center">
        <p className="text-sm text-gray-500">
          Powered by{" "}
          <Link
            href="https://codenecting.com"
            className="text-leiden hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            codenecting
          </Link>
        </p>
      </footer>
    </main>
  );
}