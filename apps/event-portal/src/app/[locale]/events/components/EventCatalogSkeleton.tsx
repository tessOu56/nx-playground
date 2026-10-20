import { Skeleton } from '@/components/core';

export function EventCatalogSkeleton({
  showFilters = true,
}: {
  showFilters?: boolean;
}) {
  return (
    <div className='space-y-6' aria-busy='true'>
      {showFilters ? (
        <div className='space-y-3'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-11 w-full' />
          <div className='flex gap-2'>
            <Skeleton className='h-8 w-20 rounded-full' />
            <Skeleton className='h-8 w-16 rounded-full' />
            <Skeleton className='h-8 w-16 rounded-full' />
          </div>
        </div>
      ) : null}
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
