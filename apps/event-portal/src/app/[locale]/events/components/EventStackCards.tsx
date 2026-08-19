import Link from 'next/link';

import { NoEvents } from '@/app/[locale]/vendors/[vendorId]/components/events/NoEvents';
import type { Event } from '@/types';

export function EventStackCards({
  events,
  locale,
}: {
  events: Event[];
  locale: string;
}) {
  if (!events.length) {
    return <NoEvents />;
  }

  return (
    <ul className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      {events.map(event => (
        <li key={event.id}>
          <Link
            href={`/${locale}/events/${event.id}`}
            className='block w-full rounded-lg bg-white p-5 text-left shadow-md hover:shadow-lg'
          >
            <h2 className='text-lg font-semibold text-gray-900'>{event.title}</h2>
            <p className='mt-1 text-sm text-gray-600'>
              {event.date} · {event.location}
            </p>
            <p className='mt-2 line-clamp-2 text-sm text-gray-500'>
              {event.description}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
