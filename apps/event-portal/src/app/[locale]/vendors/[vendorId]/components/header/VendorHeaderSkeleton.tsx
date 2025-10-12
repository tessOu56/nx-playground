import { Skeleton, SkeletonAvatar } from '@/components/core';

export function VendorHeaderSkeleton() {
  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      {/* 頭像和基本資訊區域 */}
      <div className='flex items-start space-x-4'>
        {/* 頭像 skeleton - 圓形 */}
        <SkeletonAvatar className='w-16 h-16' />

        <div className='flex-1'>
          {/* 主辦方名稱 skeleton - 大標題 */}
          <Skeleton className='h-6 w-48 mb-2' />

          {/* 描述文字 skeleton */}
          <Skeleton className='h-5 w-64' />
        </div>
      </div>

      {/* 聯絡資訊區域 skeleton */}
      <div className='bg-gray-50 rounded-lg p-4 flex items-center space-x-6 mt-4'>
        {/* 信箱 skeleton */}
        <div className='flex items-center'>
          <Skeleton className='h-4 w-8 mr-2' />
          <Skeleton className='h-4 w-32' />
        </div>

        {/* 轉帳帳戶 skeleton */}
        <div className='flex items-center'>
          <Skeleton className='h-4 w-16 mr-2' />
          <Skeleton className='h-4 w-24' />
        </div>

        {/* 戶名 skeleton */}
        <div className='flex items-center'>
          <Skeleton className='h-4 w-10 mr-2' />
          <Skeleton className='h-4 w-20' />
        </div>

        {/* LINE 按鈕 skeleton */}
        <Skeleton className='h-8 w-24' />
      </div>
    </div>
  );
}
