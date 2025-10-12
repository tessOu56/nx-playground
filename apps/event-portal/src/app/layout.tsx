import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { type ReactNode } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'NX Playground Events - 活動管理平台',
    template: '%s | NX Playground Events',
  },
  description: '基於 LIFF 的活動管理平台，提供豐富的活動體驗',
  keywords: ['活動管理', 'LIFF', 'LINE', 'NX Playground'],
  authors: [{ name: 'NX Playground Team' }],
  creator: 'NX Playground',
  publisher: 'NX Playground',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://events.nx-playground.local'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://events.nx-playground.local',
    siteName: 'NX Playground Events',
    title: 'NX Playground Events - 活動管理平台',
    description: '基於 LIFF 的活動管理平台，提供豐富的活動體驗',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NX Playground Events',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NX Playground Events - 活動管理平台',
    description: '基於 LIFF 的活動管理平台，提供豐富的活動體驗',
    images: ['/og-image.jpg'],
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
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='zh-TW'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
