'use client';

import { useMemo, useState } from 'react';

import { EventStackCards } from './EventStackCards';

import { Input } from '@/components';
import {
  type CityFilter,
  type DateFilter,
  filterCatalog,
  uniqueCategories,
} from '@/libs/api/catalog-filters';
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
  const [query, setQuery] = useState('');
  const [city, setCity] = useState<CityFilter>('all');
  const [dates, setDates] = useState<DateFilter>('all');
  const [category, setCategory] = useState('');
  const categories = useMemo(() => uniqueCategories(events), [events]);

  const filtered = useMemo(
    () => filterCatalog(events, { query, city, dates, category }),
    [events, query, city, dates, category]
  );

  const hasActiveFilters =
    query.trim().length > 0 || city !== 'all' || dates !== 'all' || category;

  const clearFilters = () => {
    setQuery('');
    setCity('all');
    setDates('all');
    setCategory('');
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
            value={query}
            onChange={event => setQuery(event.target.value)}
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
                className={chipClass(city === value)}
                aria-pressed={city === value}
                onClick={() => setCity(value)}
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
              value={dates}
              onChange={event => setDates(event.target.value as DateFilter)}
              className='flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800'
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
                value={category}
                onChange={event => setCategory(event.target.value)}
                className='flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800'
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
          <p>{copy.eventCount(filtered.length)}</p>
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
        empty={events.length === 0 ? 'catalog' : 'search'}
        onClearFilters={hasActiveFilters ? clearFilters : undefined}
      />
    </div>
  );
}
