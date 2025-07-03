import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ClientLayout from './client-layout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'LIACS Open Day',
  description:
    'Interactive activities and information for the LIACS Open Day event at Leiden University. Explore computer science through programming challenges, Q&A sessions, and interactive games.',
  keywords:
    'LIACS, Leiden University, Open Day, Computer Science, Programming, Interactive, Education',
  authors: [{ name: 'LIACS' }],
  creator: 'LIACS - Leiden Institute of Advanced Computer Science',
  publisher: 'Leiden University',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://openday.betterludev.nl'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'LIACS Open Day',
    description:
      'Interactive activities and information for the LIACS Open Day event at Leiden University',
    url: 'https://openday.betterludev.nl',
    siteName: 'LIACS Open Day',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/building.jpg',
        width: 1200,
        height: 630,
        alt: 'LIACS Open Day',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LIACS Open Day',
    description:
      'Interactive activities and information for the LIACS Open Day event at Leiden University',
    images: ['/building.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="max-w-svw m-0 overflow-x-hidden p-0">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/UniLeidenLogo.png" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} max-w-svw m-0 flex min-h-screen flex-col bg-white p-0 antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
