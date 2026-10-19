import { Skeleton } from '@/components/core';

export function EventInfoHeaderSkeleton() {
  return (
    <div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm'>
      <Skeleton className='h-64 w-full sm:h-72' />
      <div className='p-6'>
        <div className='mb-4 flex gap-2'>
          <Skeleton className='h-5 w-14 rounded-full' />
          <Skeleton className='h-5 w-16 rounded-full' />
        </div>
        <Skeleton className='mb-4 h-8 w-3/4' />
        <div className='mb-6 space-y-2'>
          <Skeleton className='h-5 w-full' />
          <Skeleton className='h-5 w-5/6' />
          <Skeleton className='h-5 w-4/6' />
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {Array.from({ length: 4 }, (_, index) => (
            <div key={`info-${index}`} className='space-y-2'>
              <Skeleton className='h-3 w-16' />
              <Skeleton className='h-5 w-32' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
