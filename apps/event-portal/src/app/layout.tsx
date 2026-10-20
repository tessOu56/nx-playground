import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google';
import { type ReactNode } from 'react';
import './globals.css';

const sans = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
});

const display = Noto_Serif_TC({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
  variable: '--font-display',
});

const SITE_TITLE = 'NX Playground — exhibitions in Taipei and Tokyo';
const SITE_DESCRIPTION =
  'Search exhibitions in Taipei and Tokyo, then confirm on the official page or LINE. The catalog includes sample rows and open-data summaries.';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: SITE_TITLE,
      template: '%s | NX Playground',
    },
    description: SITE_DESCRIPTION,
    keywords: ['Taipei', 'Tokyo', 'exhibition', 'LINE', 'NX Playground'],
    authors: [{ name: 'NX Playground' }],
    creator: 'NX Playground',
    publisher: 'NX Playground',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nx-event-portal.vercel.app'
    ),
    icons: {
      icon: [
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
      apple: [{ url: '/apple-icon.svg', type: 'image/svg+xml' }],
    },
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'zh_TW',
      alternateLocale: ['en_US', 'ja_JP'],
      url: 'https://nx-event-portal.vercel.app',
      siteName: 'NX Playground',
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      images: [
        {
          url: '/icon.svg',
          width: 512,
          height: 512,
          alt: 'NX Playground exhibitions',
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      images: ['/icon.svg'],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = (await cookies()).get('NEXT_LOCALE')?.value ?? 'zh-TW';
  return (
    <html
      lang={locale === 'en' ? 'en' : locale === 'ja' ? 'ja' : 'zh-TW'}
      data-app='nx-event'
      className={`${sans.variable} ${display.variable}`}
    >
      <head>
        <link rel='icon' href='/icon.svg' type='image/svg+xml' />
        <link rel='apple-touch-icon' href='/apple-icon.svg' />
      </head>
      <body className={`${sans.className} bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
