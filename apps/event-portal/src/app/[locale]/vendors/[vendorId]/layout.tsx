import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';

import {
  PageConfigs,
  prefetchVendorPage,
  generateVendorMetadata,
} from '@/libs';

// 使用主辦方詳情頁面配置，包含動態 metadata 生成
export const { dynamic, revalidate, fetchCache, ssr } =
  PageConfigs.vendorDetail;
export const generateMetadata = generateVendorMetadata;

export default async function VendorDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ vendorId: string }>;
}) {
  const { vendorId } = await params;

  // 1. 創建 QueryClient 實例
  const queryClient = new QueryClient();

  // 2. 預取頁面所需的資料
  await prefetchVendorPage(queryClient, vendorId);

  // 3. 序列化資料
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className='min-h-screen bg-gray-50'>
        <div className='page-container'>
          {/* 頁面標題 */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              主辦方詳情
            </h1>
            <p className='text-gray-600'>查看主辦方資訊和相關活動</p>
          </div>

          {/* 子頁面內容 */}
          {children}
        </div>
      </div>
    </HydrationBoundary>
  );
}
