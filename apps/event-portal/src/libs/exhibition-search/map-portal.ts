import type { EventStackEvent } from '@nx-playground/api-client/event-stack';

import { toPortalEvent, toPortalEventDetail } from '../api/event-stack-map';
import type { Event, EventDetail } from '../../types';

import { publicHttpsUrl } from './https-url';
import type { ExhibitionDocument, ExhibitionHit } from './types';

export function toEventStackEvent(doc: ExhibitionDocument): EventStackEvent {
  const data = { ...(doc.data ?? {}) };
  if (doc.imageUrl) data.image = doc.imageUrl;
  else delete data.image;
  if (doc.category && typeof data.category !== 'string') {
    data.category = doc.category;
  }
  if (doc.sample) data.sample = true;
  if (!data.kind) data.kind = 'exhibition';
  return {
    id: doc.id,
    title: doc.title,
    description: doc.description ?? '',
    location: doc.location ?? '',
    startDate: doc.startDate.toISOString(),
    endDate: doc.endDate.toISOString(),
    status: doc.status,
    data,
    region: doc.region,
    timezone: doc.timezone,
    source: doc.source,
    sourceUrl: publicHttpsUrl(doc.sourceUrl),
    tags: doc.tags,
    priceText: doc.priceText,
    createdAt: (doc.createdAt ?? doc.startDate).toISOString(),
    updatedAt: (doc.updatedAt ?? doc.startDate).toISOString(),
  };
}

export function hitToPortalEvent(hit: ExhibitionHit | ExhibitionDocument): Event {
  return toPortalEvent(toEventStackEvent(hit));
}

export function hitToPortalEventDetail(
  doc: ExhibitionDocument
): EventDetail {
  return toPortalEventDetail(toEventStackEvent(doc));
}

export function hitToJson(hit: ExhibitionHit) {
  const event = hitToPortalEvent(hit);
  return {
    ...event,
    rank: hit.rank,
  };
}
