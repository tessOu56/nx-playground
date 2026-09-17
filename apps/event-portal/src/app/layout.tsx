import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Inter } from 'next/font/google';
import { type ReactNode } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const DEMO_TITLE = 'NX Playground Events — labelled Hobby demo';
const DEMO_DESCRIPTION =
  'Taiwan event-stack C-end labelled demo. Catalog and mock tickets use in-memory fixtures. Not the Nest funds API.';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: DEMO_TITLE,
      template: '%s | NX Playground Events',
    },
    description: DEMO_DESCRIPTION,
    keywords: ['labelled demo', 'event stack', 'NX Playground'],
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
      url: 'https://nx-event-portal.vercel.app',
      siteName: 'NX Playground Events',
      title: DEMO_TITLE,
      description: DEMO_DESCRIPTION,
      images: [
        {
          url: '/icon.svg',
          width: 512,
          height: 512,
          alt: 'NX Playground Events',
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: DEMO_TITLE,
      description: DEMO_DESCRIPTION,
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
    <html lang={locale === 'en' ? 'en' : 'zh-TW'} data-app='nx-event'>
      <head>
        <link rel='icon' href='/icon.svg' type='image/svg+xml' />
        <link rel='apple-touch-icon' href='/apple-icon.svg' />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
