import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { EventsSidebar, ToastProvider } from '@/components';
import { PublicSiteHeader } from '@/components/header/PublicSiteHeader';
import { LiffProvider, ErrorBoundary, QueryProvider } from '@/libs';
import { SUPPORTED_LOCALES } from '@/libs/constants';
import { demoCopy } from '@/libs/i18n/demo-copy';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map(locale => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as (typeof SUPPORTED_LOCALES)[number])) {
    notFound();
  }

  const messages = await getMessages();
  const copy = demoCopy(locale);
  const showDevSidebar = process.env.NODE_ENV !== 'production';

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={locale === 'ja' ? 'Asia/Tokyo' : 'Asia/Taipei'}
    >
      <QueryProvider>
        <ErrorBoundary>
          <ToastProvider>
            <LiffProvider>
              <a href='#main-content' className='skip-link'>
                {copy.skipToContent}
              </a>
              <PublicSiteHeader locale={locale} />
              <main id='main-content' className='min-h-screen bg-gray-50'>
                {children}
              </main>
              {showDevSidebar ? <EventsSidebar /> : null}
            </LiffProvider>
          </ToastProvider>
        </ErrorBoundary>
      </QueryProvider>
    </NextIntlClientProvider>
  );
}
