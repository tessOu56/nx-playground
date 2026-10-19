import { Skeleton } from '@/components/core';

export default function EventsLoading() {
  return (
    <div className='mx-auto max-w-6xl px-4 py-8 sm:py-10' aria-busy='true'>
      <Skeleton className='mb-4 h-16 w-full rounded-lg' />
      <Skeleton className='mb-3 h-9 w-40' />
      <Skeleton className='mb-8 h-5 w-80 max-w-full' />
      <div className='mb-6 space-y-3'>
        <Skeleton className='h-10 w-full' />
        <div className='flex gap-2'>
          <Skeleton className='h-8 w-20 rounded-full' />
          <Skeleton className='h-8 w-16 rounded-full' />
          <Skeleton className='h-8 w-16 rounded-full' />
        </div>
      </div>
      <div className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3'>
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={`catalog-skeleton-${index}`}
            className='overflow-hidden rounded-xl border border-gray-200 bg-white'
          >
            <Skeleton className='aspect-[16/9] w-full' />
            <div className='space-y-2 p-4'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-5 w-3/4' />
              <Skeleton className='h-4 w-1/2' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
