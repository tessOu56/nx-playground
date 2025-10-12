import { Skeleton, SkeletonCard } from '@nx-playground/ui-components';

export function CheckInSkeleton() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='page-container'>
        <div className='space-y-6'>
          {/* 票券資訊骨架 */}
          <SkeletonCard className='bg-white rounded-lg shadow-md p-6'>
            <div className='text-center'>
              <Skeleton size='md' className='w-1/2 mx-auto mb-4' />
              <Skeleton size='sm' className='w-3/4 mx-auto mb-6' />
            </div>
          </SkeletonCard>

          {/* 票券詳細資訊骨架 */}
          <SkeletonCard className='bg-white rounded-lg shadow-md p-6'>
            <div className='bg-gray-50 rounded-lg p-4 mb-6'>
              <div className='grid grid-cols-2 gap-4'>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={`info-${i}`}>
                    <Skeleton size='sm' className='w-1/2 mb-1' />
                    <Skeleton size='sm' className='w-3/4' />
                  </div>
                ))}
              </div>
            </div>
          </SkeletonCard>

          {/* QR Code 骨架 */}
          <SkeletonCard className='bg-white rounded-lg shadow-md p-6'>
            <div className='text-center'>
              <div className='w-[200px] h-[200px] mx-auto mb-4'>
                <Skeleton size='xl' className='w-full h-full rounded-lg' />
              </div>
              <Skeleton size='sm' className='w-1/3 mx-auto' />
            </div>
          </SkeletonCard>

          {/* 按鈕骨架 */}
          <SkeletonCard className='bg-white rounded-lg shadow-md p-6'>
            <div className='space-y-3'>
              <div className='grid grid-cols-2 gap-3'>
                <Skeleton size='xl' className='h-12' />
                <Skeleton size='xl' className='h-12' />
              </div>
              <Skeleton size='xl' className='h-12' />
            </div>
          </SkeletonCard>
        </div>
      </div>
    </div>
  );
}
