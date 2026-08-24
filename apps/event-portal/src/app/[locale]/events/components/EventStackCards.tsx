import Link from 'next/link';

import { NoEvents } from '@/app/[locale]/vendors/[vendorId]/components/events/NoEvents';
import {
  eventDisplayLabel,
  eventListKind,
} from '@/libs/api/event-stack-map';
import type { Event } from '@/types';

const taipeiDate = new Intl.DateTimeFormat('zh-TW', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'Asia/Taipei',
});

function formatListDateRange(event: Event): string {
  const start = new Date(`${event.date}T00:00:00.000Z`);
  if (Number.isNaN(start.getTime())) {
    return event.date;
  }
  if (!event.endsAt) {
    return taipeiDate.format(start);
  }
  const end = new Date(event.endsAt);
  if (Number.isNaN(end.getTime())) {
    return taipeiDate.format(start);
  }
  const startLabel = taipeiDate.format(start);
  const endLabel = taipeiDate.format(end);
  return startLabel === endLabel ? startLabel : `${startLabel} – ${endLabel}`;
}

function priceFromLabel(price: number): string {
  return price > 0 ? `NT$ ${price.toLocaleString('zh-TW')} 起` : '免費';
}

export function EventStackCards({
  events,
  locale,
}: {
  events: Event[];
  locale: string;
}) {
  if (!events.length) {
    return <NoEvents variant='catalog' />;
  }

  return (
    <ul className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {events.map(event => {
        const kind = eventListKind(event);
        const dateRange = formatListDateRange(event);
        const venueLine = [event.location, event.venueHint]
          .filter(Boolean)
          .join(' · ');
        const meta = [dateRange, venueLine, priceFromLabel(event.price)]
          .filter(Boolean)
          .join(' · ');

        return (
          <li key={event.id}>
            <Link
              href={`/${locale}/events/${event.id}`}
              className='block w-full overflow-hidden rounded-lg bg-white text-left shadow-md hover:shadow-lg transition-shadow duration-[var(--motion-duration-fast,150ms)]'
            >
              <div
                className='aspect-[16/9] bg-cover bg-center'
                style={{ backgroundImage: `url(${event.image})` }}
              />
              <div className='p-4'>
                <div className='mb-2 flex items-center justify-between gap-2'>
                  <span className='text-xs font-medium text-gray-500'>
                    {event.category}
                  </span>
                  <span className='rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700'>
                    {eventDisplayLabel(kind)}
                  </span>
                </div>
                <h2 className='line-clamp-2 text-base font-semibold text-gray-900'>
                  {event.title}
                </h2>
                <p className='mt-2 line-clamp-1 text-sm text-gray-600'>
                  {meta}
                </p>
                {event.organizerName ? (
                  <p className='mt-1 line-clamp-1 text-xs text-gray-500'>
                    {event.organizerName}
                    {typeof event.speakerCount === 'number' &&
                    event.speakerCount > 0
                      ? ` · ${event.speakerCount} 位講者`
                      : ''}
                  </p>
                ) : null}
                <p className='mt-3 text-sm font-medium text-blue-700'>
                  查看場次
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
