import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navigation/Navbar";
import Link from "next/link";
import YouTubeToggle from "../components/YouTubeToggle/YouTubeToggle";

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
  icons: {
    icon: [
      {
        url: "/design-1.0/assets/icons/icon-32px.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/design-1.0/assets/icons/icon-96px.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "/design-1.0/assets/icons/icon-195px.png",
        sizes: "195x195",
        type: "image/png",
      },
    ],
    shortcut: "/design-1.0/assets/icons/favicon.ico",
    apple: [
      {
        url: "/design-1.0/assets/icons/icon-120px.png",
        sizes: "120x120",
        type: "image/png",
      },
      {
        url: "/design-1.0/assets/icons/icon-152px.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        url: "/design-1.0/assets/icons/icon-167px.png",
        sizes: "167x167",
        type: "image/png",
      },
      {
        url: "/design-1.0/assets/icons/icon-180px.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
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
        {/* Include the YouTube toggle component */}
        <YouTubeToggle />
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
