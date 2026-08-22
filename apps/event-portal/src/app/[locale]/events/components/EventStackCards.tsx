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
    return <NoEvents />;
  }

  return (
    <ul className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      {events.map(event => {
        const kind = eventListKind(event);
        const dateRange = formatListDateRange(event);
        const venueLine = [event.location, event.venueHint]
          .filter(Boolean)
          .join(' · ');

        return (
          <li key={event.id}>
            <Link
              href={`/${locale}/events/${event.id}`}
              className='block w-full overflow-hidden rounded-lg bg-white text-left shadow-md hover:shadow-lg transition-shadow duration-[var(--motion-duration-fast,150ms)]'
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
                <dl className='mt-3 space-y-1.5 text-sm text-gray-600'>
                  <div className='flex flex-wrap gap-x-2'>
                    <dt className='sr-only'>時間</dt>
                    <dd>{dateRange}</dd>
                  </div>
                  {event.organizerName ? (
                    <div>
                      <dt className='text-xs uppercase tracking-wide text-gray-400'>
                        主辦
                      </dt>
                      <dd>{event.organizerName}</dd>
                    </div>
                  ) : null}
                  {venueLine ? (
                    <div>
                      <dt className='text-xs uppercase tracking-wide text-gray-400'>
                        地點
                      </dt>
                      <dd className='line-clamp-1'>{venueLine}</dd>
                    </div>
                  ) : null}
                  {typeof event.speakerCount === 'number' &&
                  event.speakerCount > 0 ? (
                    <div>
                      <dt className='text-xs uppercase tracking-wide text-gray-400'>
                        講者
                      </dt>
                      <dd>{event.speakerCount} 位</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt className='text-xs uppercase tracking-wide text-gray-400'>
                      票價
                    </dt>
                    <dd className='font-medium text-blue-700'>
                      {priceFromLabel(event.price)}
                    </dd>
                  </div>
                </dl>
                <p className='mt-2 line-clamp-2 text-sm text-gray-500'>
                  {event.description}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
