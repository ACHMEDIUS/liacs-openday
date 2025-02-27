import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navigation/Navbar";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Open Day",
  description: "LIACS Open Dat Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="m-0 p-0 overflow-x-hidden max-w-svw">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white flex flex-col min-h-screen m-0 p-0 max-w-svw`}
      >
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          {children}
        </main>
        <footer className="bg-gray-100 py-4 text-center w-full">
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
      </body>
    </html>
  );
}
