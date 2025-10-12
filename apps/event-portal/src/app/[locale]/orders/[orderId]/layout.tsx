import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';

import { PageConfigs, prefetchOrderPage, generateOrderMetadata } from '@/libs';

// 使用訂單詳情頁面配置，包含動態 metadata 生成
export const { dynamic, revalidate, fetchCache, ssr } = PageConfigs.orderDetail;
export const generateMetadata = generateOrderMetadata;

export default async function OrderLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  // 1. 創建 QueryClient 實例
  const queryClient = new QueryClient();

  // 2. 預取頁面所需的資料
  await prefetchOrderPage(queryClient, orderId);

  // 3. 序列化資料
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className='min-h-screen bg-gray-50'>
        <div className='page-container'>
          {/* 頁面標題 */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>訂單確認</h1>
            <p className='text-gray-600'>完成付款後即可使用票券</p>
          </div>

          {/* 子頁面內容 */}
          {children}
        </div>
      </div>
    </HydrationBoundary>
  );
}
