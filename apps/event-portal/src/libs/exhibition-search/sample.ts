import { loadFixtureEvents, type EventRecord } from '@nx-playground/api-fixtures';

import { publicHttpsUrl } from './https-url';
import type { ExhibitionDocument, ExhibitionRegion } from './types';

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return undefined;
}

export function documentFromRecord(event: EventRecord): ExhibitionDocument | null {
  if (event.status === 'draft') return null;
  const data = asRecord(event.data) ?? {};
  const kind = data.kind;
  if (kind !== 'exhibition' && !event.id.startsWith('event_sample_')) {
    return null;
  }
  const venue = asRecord(data.venue);
  const region =
    event.region === 'TAIPEI' || event.region === 'TOKYO'
      ? (event.region as ExhibitionRegion)
      : null;
  const tags = Array.isArray(event.tags)
    ? event.tags.filter((tag): tag is string => typeof tag === 'string')
    : Array.isArray(data.tags)
      ? data.tags.filter((tag): tag is string => typeof tag === 'string')
      : [];
  return {
    id: event.id,
    title: event.title,
    description: event.description ?? null,
    location: event.location ?? null,
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate),
    timezone: event.timezone ?? null,
    priceText: event.priceText ?? null,
    region,
    sourceUrl: event.sourceUrl ?? null,
    source: event.source ?? null,
    tags,
    imageUrl: publicHttpsUrl(data.image),
    category: typeof data.category === 'string' ? data.category : null,
    organizerName: typeof data.organizer === 'string' ? data.organizer : null,
    venueHint:
      venue && typeof venue.transport === 'string' ? venue.transport : null,
    status: event.status,
    sample: data.sample === true || event.source === 'sample',
    data,
    createdAt: event.createdAt ? new Date(event.createdAt) : undefined,
    updatedAt: event.updatedAt ? new Date(event.updatedAt) : undefined,
  };
}

export function sampleDocuments(): ExhibitionDocument[] {
  return loadFixtureEvents()
    .map(documentFromRecord)
    .filter((item): item is ExhibitionDocument => item !== null);
}

export function sampleDocumentById(id: string): ExhibitionDocument | null {
  const event = loadFixtureEvents().find(item => item.id === id);
  if (!event) return null;
  return documentFromRecord(event);
}
