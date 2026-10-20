import { EventCatalogSkeleton } from './components/EventCatalogSkeleton';
import { Skeleton } from '@/components/core';

export default function EventsLoading() {
  return (
    <div className='mx-auto max-w-6xl px-4 py-8 sm:py-10' aria-busy='true'>
      <Skeleton className='mb-4 h-16 w-full rounded-lg' />
      <Skeleton className='mb-3 h-9 w-40' />
      <Skeleton className='mb-8 h-5 w-80 max-w-full' />
      <EventCatalogSkeleton />
    </div>
  );
}
