import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { headers } from 'next/headers';

import { BackLink } from '@/components/nav/BackLink';
import { LabelledDemoBanner } from '@/components/demo/LabelledDemoBanner';
import { prefetchEventPage, generateEventMetadata } from '@/libs';
import { demoCopy } from '@/libs/i18n/demo-copy';

export const dynamic = 'force-dynamic';
export const generateMetadata = generateEventMetadata;

export default async function EventDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; eventId: string }>;
}) {
  const { locale, eventId } = await params;
  const copy = demoCopy(locale);

  // 檢查當前路由是否為 checkout
  // 使用更簡單的方法：直接檢查 URL 中的路徑段
  const headersList = await headers();
  const pathname =
    headersList.get('x-pathname') ?? headersList.get('x-url') ?? '';

  // 檢查當前路由是否為 checkout 頁面 - 確保 pathname 是字串且不為空
  const isCheckoutPage = pathname
    ? pathname.includes('/checkout') ||
      pathname.endsWith('/checkout') ||
      pathname.match(/\/[^/]+\/checkout$/) !== null
    : false;

  // 1. 創建 QueryClient 實例
  const queryClient = new QueryClient();

  try {
    await prefetchEventPage(queryClient, eventId);
  } catch {
    // Missing or failed events still render the not-found / error UI.
  }
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className='min-h-screen bg-gray-50'>
        <div className='page-container'>
          {/* 頁面標題 - 只在非 checkout 頁面顯示 */}
          {!isCheckoutPage && (
            <div className='mb-4'>
              <BackLink
                href={`/${locale}/events`}
                label={copy.backToEvents}
              />
              <div className='mt-3'>
                <LabelledDemoBanner locale={locale} />
              </div>
            </div>
          )}

          {/* 子頁面內容 */}
          {children}
        </div>
      </div>
    </HydrationBoundary>
  );
}
