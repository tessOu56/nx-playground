import { Skeleton, SkeletonCard } from '@/components/core';

export function OrderSkeleton() {
  return (
    <div className='space-y-6'>
      {/* 訂單資訊骨架 */}
      <SkeletonCard className='p-6'>
        <Skeleton className='h-6 w-1/4 mb-4' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className='space-y-1'>
              <Skeleton className='h-3 w-1/3' />
              <Skeleton className='h-5 w-2/3' />
            </div>
          ))}
        </div>

        {/* 活動資訊骨架 */}
        <div className='border-t pt-4 mt-4'>
          <Skeleton className='h-5 w-1/4 mb-3' />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className='space-y-1'>
                <Skeleton className='h-3 w-1/3' />
                <Skeleton className='h-5 w-2/3' />
              </div>
            ))}
          </div>
        </div>
      </SkeletonCard>

      {/* 訂單 QR Code 骨架 */}
      <SkeletonCard className='p-6'>
        <div className='text-center mb-6'>
          <Skeleton className='h-5 w-1/3 mx-auto mb-2' />
          <Skeleton className='h-4 w-2/3 mx-auto' />
        </div>
        <div className='text-center'>
          <Skeleton className='w-64 h-64 mx-auto' />
          <Skeleton className='h-3 w-1/4 mx-auto mt-2' />
        </div>
      </SkeletonCard>

      {/* 報名表進度骨架 */}
      <SkeletonCard className='p-6'>
        <Skeleton className='h-5 w-1/3 mb-4' />
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-4 w-1/4' />
            <Skeleton className='h-4 w-1/6' />
          </div>
          <Skeleton className='w-full h-2.5' />
          <Skeleton className='h-4 w-3/4' />
        </div>
      </SkeletonCard>

      {/* 報名表顯示骨架 */}
      <SkeletonCard className='p-6'>
        <Skeleton className='h-5 w-1/4 mb-4' />
        <div className='space-y-4'>
          {[1, 2].map(i => (
            <div key={i} className='border border-gray-200 rounded-lg p-4'>
              <Skeleton className='h-5 w-1/3 mb-3' />
              <div className='space-y-3'>
                {[1, 2, 3].map(j => (
                  <div key={j} className='space-y-1'>
                    <Skeleton className='h-4 w-1/4' />
                    <Skeleton className='h-10' />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SkeletonCard>

      {/* 訂單管理按鈕骨架 */}
      <SkeletonCard className='p-6'>
        <div className='text-center'>
          <Skeleton className='h-5 w-1/3 mx-auto mb-4' />
          <Skeleton className='h-4 w-2/3 mx-auto mb-6' />
          <div className='space-y-3'>
            <Skeleton className='h-12' />
            <Skeleton className='h-12' />
          </div>
        </div>
      </SkeletonCard>
    </div>
  );
}
