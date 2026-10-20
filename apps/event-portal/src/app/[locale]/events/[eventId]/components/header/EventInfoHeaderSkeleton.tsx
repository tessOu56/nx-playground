import { Skeleton } from '@/components/core';

export function EventInfoHeaderSkeleton() {
  return (
    <div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm'>
      <Skeleton className='aspect-[16/9] w-full sm:h-72 sm:aspect-auto' />
      <div className='p-5 sm:p-6'>
        <div className='mb-3 flex gap-2'>
          <Skeleton className='h-5 w-14 rounded-full' />
          <Skeleton className='h-5 w-16 rounded-full' />
          <Skeleton className='h-5 w-12 rounded-full' />
        </div>
        <Skeleton className='h-8 w-3/4' />
        <div className='mt-4 grid grid-cols-1 gap-4 border-y border-gray-100 py-4 sm:grid-cols-2'>
          {Array.from({ length: 4 }, (_, index) => (
            <div key={`info-${index}`} className='space-y-2'>
              <Skeleton className='h-3 w-16' />
              <Skeleton className='h-5 w-32' />
            </div>
          ))}
        </div>
        <div className='mt-5 space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-5/6' />
          <Skeleton className='h-4 w-4/6' />
        </div>
      </div>
    </div>
  );
}
