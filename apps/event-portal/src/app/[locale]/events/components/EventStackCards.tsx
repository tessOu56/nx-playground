import Link from 'next/link';

import { NoEvents } from '@/app/[locale]/vendors/[vendorId]/components/events/NoEvents';
import { eventListKind, regionTimeZone } from '@/libs/api/event-stack-map';
import { catalogPriceLabel, demoCopy } from '@/libs/i18n/demo-copy';
import type { Event } from '@/types';

function formatListDateRange(event: Event, locale: string): string {
  const timeZone = regionTimeZone(event.region, event.timezone);
  const dateLocale =
    locale === 'en' ? 'en-US' : locale === 'ja' ? 'ja-JP' : 'zh-TW';
  const start = new Date(`${event.date}T00:00:00.000Z`);
  const fmt = new Intl.DateTimeFormat(dateLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone,
  });
  if (Number.isNaN(start.getTime())) {
    return event.date;
  }
  if (!event.endsAt) {
    return fmt.format(start);
  }
  const end = new Date(event.endsAt);
  if (Number.isNaN(end.getTime())) {
    return fmt.format(start);
  }
  const startLabel = fmt.format(start);
  const endLabel = fmt.format(end);
  return startLabel === endLabel ? startLabel : `${startLabel} – ${endLabel}`;
}

export function EventStackCards({
  events,
  locale,
  empty = 'catalog',
  onClearFilters,
}: {
  events: Event[];
  locale: string;
  empty?: 'catalog' | 'search';
  onClearFilters?: () => void;
}) {
  const copy = demoCopy(locale);

  if (!events.length) {
    if (empty === 'search') {
      return (
        <div
          className='rounded-xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center'
          data-testid='events-search-empty'
        >
          <h3 className='text-lg font-semibold text-gray-900'>
            {copy.emptySearch}
          </h3>
          <p className='mx-auto mt-2 max-w-md text-sm text-gray-600'>
            {copy.emptySearchHint}
          </p>
          {onClearFilters ? (
            <button
              type='button'
              onClick={onClearFilters}
              className='mt-5 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800'
            >
              {copy.clearFilters}
            </button>
          ) : null}
        </div>
      );
    }
    return <NoEvents variant='catalog' locale={locale} />;
  }

  return (
    <ul className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3'>
      {events.map(event => {
        const kind = eventListKind(event);
        const domain = event.domainKind ?? 'talk';
        const dateRange = formatListDateRange(event, locale);
        const venueLine = [event.location, event.venueHint]
          .filter(Boolean)
          .join(' · ');
        return (
          <li key={event.id}>
            <Link
              href={`/${locale}/events/${event.id}`}
              className='catalog-card group block h-full overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition-[box-shadow,transform] duration-[var(--motion-duration-fast,150ms)] hover:shadow-md focus-visible:shadow-md'
            >
              <div className='aspect-[16/9] overflow-hidden bg-gray-100'>
                <img
                  src={event.image}
                  alt={event.title}
                  className='h-full w-full object-cover'
                />
              </div>
              <div className='flex h-[calc(100%-56.25%)] flex-col p-4'>
                <div className='mb-3 flex flex-wrap items-center gap-1.5'>
                  {event.region ? (
                    <span className='rounded-full bg-gray-900 px-2 py-0.5 text-xs font-medium text-white'>
                      {copy.region[event.region]}
                    </span>
                  ) : null}
                  <span className='rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800'>
                    {copy.domain[domain]}
                  </span>
                  <span className='rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700'>
                    {copy.status[kind]}
                  </span>
                  {event.sample ? (
                    <span className='rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-900'>
                      {copy.sampleBadge}
                    </span>
                  ) : null}
                </div>
                <h2 className='line-clamp-2 text-base font-semibold tracking-tight text-gray-900'>
                  {event.title}
                </h2>
                <p className='mt-2 text-sm text-gray-700'>{dateRange}</p>
                {venueLine ? (
                  <p className='mt-1 line-clamp-1 text-sm text-gray-600'>
                    {venueLine}
                  </p>
                ) : null}
                <p className='mt-1 text-sm text-gray-700'>
                  {catalogPriceLabel(event, locale)}
                </p>
                {event.organizerName ? (
                  <p className='mt-1 line-clamp-1 text-xs text-gray-500'>
                    {event.organizerName}
                  </p>
                ) : null}
                <p className='mt-auto pt-3 text-sm font-medium text-gray-900 group-hover:underline'>
                  {copy.viewDetails}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
