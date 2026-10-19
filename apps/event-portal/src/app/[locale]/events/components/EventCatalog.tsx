'use client';

import { useMemo, useState } from 'react';

import { EventStackCards } from './EventStackCards';
import { Input } from '@/components';
import { eventListKind } from '@/libs/api/event-stack-map';
import { demoCopy } from '@/libs/i18n/demo-copy';
import type { Event } from '@/types';

type StatusFilter = 'all' | 'open' | 'other';

function matchesQuery(event: Event, query: string): boolean {
  if (!query) return true;
  const haystack = [
    event.title,
    event.location,
    event.venueHint,
    event.organizerName,
    event.description,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
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
  const [status, setStatus] = useState<StatusFilter>('all');
  const normalized = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    return events.filter(event => {
      if (!matchesQuery(event, normalized)) return false;
      if (status === 'all') return true;
      const kind = eventListKind(event);
      if (status === 'open') {
        return kind === 'upcoming' || kind === 'ongoing';
      }
      return kind !== 'upcoming' && kind !== 'ongoing';
    });
  }, [events, normalized, status]);

  return (
    <div className='space-y-4'>
      <form
        className='flex flex-col gap-3 sm:flex-row sm:items-end'
        role='search'
        onSubmit={event => event.preventDefault()}
      >
        <div className='min-w-0 flex-1'>
          <label
            htmlFor='event-search'
            className='mb-1 block text-sm font-medium text-gray-800'
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
          />
        </div>
        <div className='sm:w-44'>
          <label
            htmlFor='event-status'
            className='mb-1 block text-sm font-medium text-gray-800'
          >
            {copy.filterStatus}
          </label>
          <select
            id='event-status'
            value={status}
            onChange={event =>
              setStatus(event.target.value as StatusFilter)
            }
            className='flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800'
          >
            <option value='all'>{copy.allEvents}</option>
            <option value='open'>{copy.upcoming}</option>
            <option value='other'>{copy.pastEvents}</option>
          </select>
        </div>
      </form>
      <EventStackCards
        events={filtered}
        locale={locale}
        empty={events.length === 0 ? 'catalog' : 'search'}
      />
    </div>
  );
}
