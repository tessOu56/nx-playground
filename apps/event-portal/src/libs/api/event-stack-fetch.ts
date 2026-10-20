import { getEvent, listEvents } from '@nx-playground/api-client/event-stack';

import {
  exhibitionSearchFromCatalog,
  getExhibitionById,
  hitToPortalEvent,
  hitToPortalEventDetail,
  searchExhibitions,
} from '../exhibition-search';

import type { CatalogQuery } from './catalog-query';
import {
  labelledDemoPortalEvent,
  labelledDemoPortalEvents,
  isFixtureCatalogEnabled,
} from './labelled-demo-catalog';
import {
  enrichEventStackEvent,
  enrichEventStackEvents,
} from './event-stack-fixture-enrich';
import { toPortalEventDetail, toPublicCatalogEvents } from './event-stack-map';

/** Server-safe fetchers — no React Query, so RSC / prefetch can import this module. */

export async function fetchPortalEvents(query?: CatalogQuery) {
  const now = new Date();
  const input = exhibitionSearchFromCatalog(
    query ?? { q: '', city: 'all', dates: 'all', category: '' },
    now,
    48
  );
  try {
    const result = await searchExhibitions(input);
    return result.items.map(hitToPortalEvent);
  } catch {
    /* labelled-demo / Nest fallback below */
  }
  if (isFixtureCatalogEnabled()) {
    return labelledDemoPortalEvents();
  }
  try {
    const page = await listEvents({ limit: 50 });
    return toPublicCatalogEvents(enrichEventStackEvents(page.items));
  } catch {
    return labelledDemoPortalEvents();
  }
}

export async function fetchPortalEvent(eventId: string) {
  const found = await getExhibitionById(eventId);
  if (found) {
    return hitToPortalEventDetail(found.item);
  }
  if (isFixtureCatalogEnabled()) {
    return labelledDemoPortalEvent(eventId);
  }
  try {
    const event = enrichEventStackEvent(await getEvent(eventId));
    return toPortalEventDetail(event);
  } catch {
    return labelledDemoPortalEvent(eventId);
  }
}
