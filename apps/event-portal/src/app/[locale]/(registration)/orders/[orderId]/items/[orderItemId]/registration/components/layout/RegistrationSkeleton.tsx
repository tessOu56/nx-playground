import { Skeleton, SkeletonCard } from '@nx-playground/ui-components';

export function RegistrationSkeleton() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='page-container'>
        <div className='space-y-6'>
          {/* 頁面標題骨架 */}
          <SkeletonCard className='bg-white rounded-lg shadow-md p-6'>
            <Skeleton size='lg' className='w-1/3 mb-2' />
            <Skeleton size='sm' className='w-1/2' />
          </SkeletonCard>

          {/* 票券資訊骨架 */}
          <SkeletonCard className='bg-white rounded-lg shadow-md p-6'>
            <Skeleton size='md' className='w-1/4 mb-4' />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`field-${i}`}>
                  <Skeleton size='sm' className='w-1/3 mb-2' />
                  <Skeleton size='sm' className='w-2/3' />
                </div>
              ))}
            </div>
          </SkeletonCard>

          {/* 報名表骨架 */}
          <SkeletonCard className='bg-white rounded-lg shadow-md p-6'>
            <Skeleton size='md' className='w-1/3 mb-4' />
            <div className='space-y-4'>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`input-${i}`}>
                  <Skeleton size='sm' className='w-1/4 mb-2' />
                  <Skeleton size='xl' className='w-full' />
                </div>
              ))}
            </div>
          </SkeletonCard>

          {/* 按鈕骨架 */}
          <SkeletonCard className='bg-white rounded-lg shadow-md p-6'>
            <div className='flex flex-col sm:flex-row gap-3'>
              <Skeleton size='xl' className='flex-1' />
              <Skeleton size='xl' className='flex-1' />
            </div>
          </SkeletonCard>
        </div>
      </div>
    </div>
  );
}
