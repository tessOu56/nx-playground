import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';

import { Header, EventsSidebar, ToastProvider } from '@/components';
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

  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // 條件性使用 getMessages：只在非靜態導出時使用
  let messages = {};
  if (
    process.env.NODE_ENV !== 'production' ||
    !process.env.NEXT_PUBLIC_STATIC_EXPORT
  ) {
    try {
      const { getMessages } = await import('next-intl/server');
      messages = await getMessages();
    } catch (error) {
      console.warn('Failed to load messages:', error);
      messages = {};
    }
  }

  return (
    <NextIntlClientProvider messages={messages}>
      <QueryProvider>
        <ErrorBoundary>
          <ToastProvider>
            <LiffProvider>
              {/* 頁面流程導航 */}
              <Header />

              {/* 主要內容 */}
              <main className='min-h-screen bg-gray-50'>{children}</main>

              {/* 開發工具側邊欄 */}
              <EventsSidebar />
            </LiffProvider>
          </ToastProvider>
        </ErrorBoundary>
      </QueryProvider>
    </NextIntlClientProvider>
  );
}
