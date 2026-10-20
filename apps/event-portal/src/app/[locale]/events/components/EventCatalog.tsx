'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import { EventStackCards } from './EventStackCards';

import { Input } from '@/components';
import {
  type DateFilter,
  filterCatalog,
  uniqueCategories,
} from '@/libs/api/catalog-filters';
import {
  catalogEmptyKind,
  catalogQueryString,
  parseCatalogQuery,
} from '@/libs/api/catalog-query';
import { demoCopy } from '@/libs/i18n/demo-copy';
import type { Event } from '@/types';

function chipClass(active: boolean): string {
  return [
    'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
    active
      ? 'bg-gray-900 text-white'
      : 'bg-white text-gray-800 ring-1 ring-inset ring-gray-200 hover:bg-gray-50',
  ].join(' ');
}

export function EventCatalog({
  events,
  locale,
}: {
  events: Event[];
  locale: string;
}) {
  const copy = demoCopy(locale);
  const router = useRouter();
  const pathname = usePathname() || `/${locale}/events`;
  const searchParams = useSearchParams();
  const filters = useMemo(
    () => parseCatalogQuery(searchParams),
    [searchParams]
  );
  const categories = useMemo(() => uniqueCategories(events), [events]);

  const setFilters = (next: Partial<typeof filters>) => {
    const query = { ...filters, ...next };
    const qs = catalogQueryString(query);
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const filtered = useMemo(
    () =>
      filterCatalog(events, {
        query: filters.q,
        city: filters.city,
        dates: filters.dates,
        category: filters.category,
      }),
    [events, filters]
  );

  const emptyKind = catalogEmptyKind({
    total: events.length,
    filtered: filtered.length,
    query: filters,
  });

  const hasActiveFilters =
    filters.q.length > 0 ||
    filters.city !== 'all' ||
    filters.dates !== 'all' ||
    filters.category.length > 0;

  const clearFilters = () => {
    setFilters({ q: '', city: 'all', dates: 'all', category: '' });
  };

  return (
    <div className='space-y-6'>
      <form
        className='space-y-4'
        role='search'
        onSubmit={event => event.preventDefault()}
      >
        <div>
          <label
            htmlFor='event-search'
            className='mb-1.5 block text-sm font-medium text-gray-800'
          >
            {copy.searchEvents}
          </label>
          <Input
            id='event-search'
            type='search'
            value={filters.q}
            onChange={event => setFilters({ q: event.target.value })}
            placeholder={copy.searchEventsPlaceholder}
            className='w-full'
            autoComplete='off'
          />
        </div>

        <fieldset className='space-y-2'>
          <legend className='text-sm font-medium text-gray-800'>
            {copy.filterCity}
          </legend>
          <div className='flex flex-wrap gap-2'>
            {(
              [
                ['all', copy.allCities],
                ['TAIPEI', copy.region.TAIPEI],
                ['TOKYO', copy.region.TOKYO],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type='button'
                className={chipClass(filters.city === value)}
                aria-pressed={filters.city === value}
                onClick={() => setFilters({ city: value })}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className='grid gap-4 sm:grid-cols-2'>
          <div>
            <label
              htmlFor='event-dates'
              className='mb-1.5 block text-sm font-medium text-gray-800'
            >
              {copy.filterStatus}
            </label>
            <select
              id='event-dates'
              value={filters.dates}
              onChange={event =>
                setFilters({ dates: event.target.value as DateFilter })
              }
              className='flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-base text-gray-800 sm:h-10 sm:text-sm'
            >
              <option value='all'>{copy.allEvents}</option>
              <option value='now'>{copy.nowShowing}</option>
              <option value='upcoming'>{copy.upcoming}</option>
              <option value='month'>{copy.thisMonth}</option>
              <option value='past'>{copy.pastEvents}</option>
            </select>
          </div>
          {categories.length > 0 ? (
            <div>
              <label
                htmlFor='event-category'
                className='mb-1.5 block text-sm font-medium text-gray-800'
              >
                {copy.filterCategory}
              </label>
              <select
                id='event-category'
                value={filters.category}
                onChange={event => setFilters({ category: event.target.value })}
                className='flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-base text-gray-800 sm:h-10 sm:text-sm'
              >
                <option value=''>{copy.allCategories}</option>
                {categories.map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>
      </form>

      {hasActiveFilters ? (
        <div className='flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600'>
          <p aria-live='polite'>{copy.eventCount(filtered.length)}</p>
          <button
            type='button'
            onClick={clearFilters}
            className='font-medium text-gray-800 underline-offset-2 hover:underline'
          >
            {copy.clearFilters}
          </button>
        </div>
      ) : null}

      <EventStackCards
        events={filtered}
        locale={locale}
        empty={emptyKind ?? 'catalog'}
        emptyQuery={filters}
        onClearFilters={hasActiveFilters ? clearFilters : undefined}
      />
    </div>
  );
}
