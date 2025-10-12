import { Skeleton } from '@/components/core';

export function EventSessionListSkeleton() {
  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      {/* 標題 skeleton */}
      <Skeleton className='h-6 w-32 mb-4' />
      <Skeleton className='h-5 w-2/3 mb-6' />

      {/* 場次列表 skeleton */}
      <div className='space-y-4'>
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={`session-skeleton-${index}`}
            className='border rounded-lg p-4'
          >
            <div className='flex items-center justify-between'>
              <div className='flex-1'>
                {/* 場次名稱 skeleton */}
                <Skeleton className='h-6 w-48 mb-2' />

                {/* 場次資訊 skeleton */}
                <div className='space-y-2'>
                  <div className='flex items-center space-x-2'>
                    <Skeleton className='w-4 h-4' />
                    <Skeleton className='h-4 w-32' />
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Skeleton className='w-4 h-4' />
                    <Skeleton className='h-4 w-24' />
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Skeleton className='w-4 h-4' />
                    <Skeleton className='h-4 w-20' />
                  </div>
                </div>
              </div>
              <div className='ml-4'>
                <Skeleton className='h-8 w-24' />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
