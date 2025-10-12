import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { headers } from 'next/headers';

import { PageConfigs, prefetchEventPage, generateEventMetadata } from '@/libs';

// 使用活動詳情頁面配置，包含動態 metadata 生成
export const { dynamic, revalidate, fetchCache, ssr } = PageConfigs.eventDetail;
export const generateMetadata = generateEventMetadata;

export default async function EventDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

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

  // 2. 預取頁面所需的資料
  await prefetchEventPage(queryClient, eventId);

  // 3. 序列化資料
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className='min-h-screen bg-gray-50'>
        <div className='page-container'>
          {/* 頁面標題 - 只在非 checkout 頁面顯示 */}
          {!isCheckoutPage && (
            <div className='text-center mb-8'>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                活動詳情
              </h1>
              <p className='text-gray-600'>查看活動資訊和報名詳情</p>
            </div>
          )}

          {/* 子頁面內容 */}
          {children}
        </div>
      </div>
    </HydrationBoundary>
  );
}
