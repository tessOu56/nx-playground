import type { Event } from '../../types';

import { eventListKind, regionTimeZone } from './event-stack-map';

export type CityFilter = 'all' | 'TAIPEI' | 'TOKYO';
export type DateFilter = 'all' | 'now' | 'upcoming' | 'month' | 'past';

export function matchesQuery(event: Event, query: string): boolean {
  if (!query) return true;
  const haystack = [
    event.title,
    event.location,
    event.venueHint,
    event.organizerName,
    event.description,
    event.category,
    event.region,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

export function matchesCity(event: Event, city: CityFilter): boolean {
  if (city === 'all') return true;
  return event.region === city;
}

export function uniqueCategories(events: Event[]): string[] {
  return [...new Set(events.map(event => event.category).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, 'en')
  );
}

function eventStart(event: Event): Date {
  return new Date(`${event.date}T00:00:00.000Z`);
}

function eventEnd(event: Event): Date {
  if (event.endsAt) {
    const end = new Date(event.endsAt);
    if (!Number.isNaN(end.getTime())) return end;
  }
  return eventStart(event);
}

function monthBounds(now: Date, timeZone: string): { start: Date; end: Date } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
  }).formatToParts(now);
  const year = Number(parts.find(part => part.type === 'year')?.value);
  const month = Number(parts.find(part => part.type === 'month')?.value);
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
  return { start, end };
}

export function matchesDate(
  event: Event,
  filter: DateFilter,
  now = new Date()
): boolean {
  if (filter === 'all') return true;
  const kind = eventListKind(event);
  if (filter === 'now') return kind === 'ongoing';
  if (filter === 'upcoming') return kind === 'upcoming';
  if (filter === 'past') {
    return kind === 'completed' || kind === 'sale_ended' || kind === 'cancelled';
  }
  const { start, end } = monthBounds(
    now,
    regionTimeZone(event.region, event.timezone)
  );
  const eventStartAt = eventStart(event);
  const eventEndAt = eventEnd(event);
  return eventStartAt <= end && eventEndAt >= start;
}

export function filterCatalog(
  events: Event[],
  {
    query,
    city,
    dates,
    category,
    now,
  }: {
    query: string;
    city: CityFilter;
    dates: DateFilter;
    category: string;
    now?: Date;
  }
): Event[] {
  const normalized = query.trim().toLowerCase();
  return events.filter(event => {
    if (!matchesQuery(event, normalized)) return false;
    if (!matchesCity(event, city)) return false;
    if (!matchesDate(event, dates, now)) return false;
    if (category && event.category !== category) return false;
    return true;
  });
}
