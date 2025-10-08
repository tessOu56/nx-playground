import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';

import { PageConfigs, prefetchEventPage } from '@/libs';

// 使用結帳頁面配置，需要即時處理付款
export const { dynamic, revalidate, fetchCache, ssr } = PageConfigs.checkout;

export default async function CheckoutLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

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
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>選擇票券</h1>
            <p className='text-gray-600'>請選擇您想要的票券類型和付款方式</p>
          </div>

          {/* 子頁面內容 */}
          <div className='space-y-6'>{children}</div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
