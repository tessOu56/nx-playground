import Link from 'next/link';

import { NoEvents } from '@/app/[locale]/vendors/[vendorId]/components/events/NoEvents';
import {
  eventDisplayLabel,
  eventListKind,
} from '@/libs/api/event-stack-map';
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
      {events.map(event => {
        const kind = eventListKind(event);
        return (
          <li key={event.id}>
            <Link
              href={`/${locale}/events/${event.id}`}
              className='block w-full overflow-hidden rounded-lg bg-white text-left shadow-md hover:shadow-lg'
            >
              <div
                className='h-40 bg-cover bg-center'
                style={{ backgroundImage: `url(${event.image})` }}
              />
              <div className='p-5'>
                <div className='mb-2 flex items-center justify-between gap-2'>
                  <span className='text-xs font-medium text-gray-500'>
                    {event.category}
                  </span>
                  <span className='rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700'>
                    {eventDisplayLabel(kind)}
                  </span>
                </div>
                <h2 className='text-lg font-semibold text-gray-900'>
                  {event.title}
                </h2>
                <p className='mt-1 text-sm text-gray-600'>
                  {event.date} · {event.location}
                </p>
                <p className='mt-2 line-clamp-2 text-sm text-gray-500'>
                  {event.description}
                </p>
                <p className='mt-3 text-sm font-medium text-blue-700'>
                  {event.price > 0
                    ? `NT$ ${event.price.toLocaleString()} 起`
                    : '免費'}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
