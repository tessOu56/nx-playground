'use client';

import { EventListError } from '@/app/[locale]/vendors/[vendorId]/components/events/EventListError';
import { EventListSkeleton } from '@/app/[locale]/vendors/[vendorId]/components/events/EventListSkeleton';
import { NoEvents } from '@/app/[locale]/vendors/[vendorId]/components/events/NoEvents';
import { useEvents } from '@/libs/api/hooks/useEvents';
import { useLocalizedRouter } from '@/libs/i18n';

export function EventStackList() {
  const router = useLocalizedRouter();
  const { data: events, isLoading, isError, refetch } = useEvents();

  if (isError) {
    return <EventListError onRetry={() => void refetch()} />;
  }

  if (isLoading) {
    return <EventListSkeleton />;
  }

  if (!events?.length) {
    return <NoEvents />;
  }

  return (
    <ul className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      {events.map(event => (
        <li key={event.id}>
          <button
            type='button'
            className='w-full rounded-lg bg-white p-5 text-left shadow-md hover:shadow-lg'
            onClick={() => router.push(`/events/${event.id}`)}
          >
            <h2 className='text-lg font-semibold text-gray-900'>{event.title}</h2>
            <p className='mt-1 text-sm text-gray-600'>
              {event.date} · {event.location}
            </p>
            <p className='mt-2 text-sm text-gray-500 line-clamp-2'>
              {event.description}
            </p>
          </button>
        </li>
      ))}
    </ul>
  );
}
