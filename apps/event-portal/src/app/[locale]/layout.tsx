import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { Header, EventsSidebar, ToastProvider } from '@/components';
import { PublicSiteHeader } from '@/components/header/PublicSiteHeader';
import { LiffProvider, ErrorBoundary, QueryProvider } from '@/libs';

const locales = ['zh-TW', 'en'] as const;

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone='Asia/Taipei'
    >
      <QueryProvider>
        <ErrorBoundary>
          <ToastProvider>
            <LiffProvider>
              {process.env.NODE_ENV !== 'production' ? (
                <>
                  <Header />
                  <main className='min-h-screen bg-gray-50'>{children}</main>
                  <EventsSidebar />
                </>
              ) : (
                <>
                  <PublicSiteHeader locale={locale} />
                  <main className='min-h-screen bg-gray-50'>{children}</main>
                </>
              )}
            </LiffProvider>
          </ToastProvider>
        </ErrorBoundary>
      </QueryProvider>
    </NextIntlClientProvider>
  );
}
