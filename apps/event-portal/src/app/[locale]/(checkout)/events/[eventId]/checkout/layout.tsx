import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';

import { BackLink } from '@/components/nav/BackLink';
import { PageConfigs, prefetchEventPage } from '@/libs';

// 使用結帳頁面配置，需要即時處理付款
export const { dynamic, revalidate, fetchCache, ssr } = PageConfigs.checkout;

export default async function CheckoutLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; eventId: string }>;
}) {
  const { locale, eventId } = await params;

  // 1. 創建 QueryClient 實例
  const queryClient = new QueryClient();

  // 2. 預取頁面所需的資料
  await prefetchEventPage(queryClient, eventId);

  // 3. 序列化資料
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className='min-h-screen bg-gray-50'>
        <div className='page-container'>
          {/* 頁面標題 - 結帳專用 */}
          <div className='mb-8'>
            <BackLink href={`/${locale}/events/${eventId}`} />
            <div
              className='mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900'
              role='note'
              data-testid='checkout-mock-payment-banner'
            >
              <strong className='font-semibold'>示範結帳</strong>
              <span className='mx-1'>—</span>
              付款與金流為 mock，不會扣款；完成後可在訂單頁查看狀態與後續步驟。
            </div>
            <div className='text-center'>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>選擇票券</h1>
              <p className='text-gray-600'>請選擇您想要的票券類型和付款方式</p>
            </div>
          </div>

          {/* 子頁面內容 */}
          <div className='space-y-6'>{children}</div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
