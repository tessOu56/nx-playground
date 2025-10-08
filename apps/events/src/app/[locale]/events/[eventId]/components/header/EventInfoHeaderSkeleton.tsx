import { Skeleton } from '@/components/core';

export function EventInfoHeaderSkeleton() {
  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden'>
      {/* 活動封面 skeleton */}
      <Skeleton className='h-64 w-full' />

      {/* 活動資訊 skeleton */}
      <div className='p-6'>
        {/* 標題 skeleton */}
        <Skeleton className='h-8 w-3/4 mb-4' />

        {/* 描述 skeleton */}
        <div className='space-y-2 mb-6'>
          <Skeleton className='h-5 w-full' />
          <Skeleton className='h-5 w-5/6' />
          <Skeleton className='h-5 w-4/6' />
        </div>

        {/* 活動基本資訊 skeleton */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
          {Array.from({ length: 4 }, (_, index) => (
            <div key={`info-${index}`} className='flex items-center space-x-3'>
              <Skeleton className='w-6 h-6' />
              <Skeleton className='h-5 w-32' />
            </div>
          ))}
        </div>

        {/* 按鈕 skeleton */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <Skeleton className='h-12 flex-1' />
          <Skeleton className='h-12 flex-1' />
        </div>
      </div>
    </div>
  );
}
