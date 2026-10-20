import type { CatalogQuery } from '../api/catalog-query';
import { labelledDemoPortalEvent } from '../api/labelled-demo-catalog';
import { isMissingPortalEvent } from '../api/portal-event-error';
import type { EventDetail as EventDetailModel } from '@/types';

import {
  exhibitionSearchFromCatalog,
  getExhibitionById,
  hitToPortalEvent,
  hitToPortalEventDetail,
  searchExhibitions,
} from './index';

export type PortalExhibitionResult =
  | { status: 'ok'; event: EventDetailModel }
  | { status: 'missing' }
  | { status: 'error' };

export async function loadPortalCatalog(query?: CatalogQuery) {
  const result = await searchExhibitions(
    exhibitionSearchFromCatalog(
      query ?? { q: '', city: 'all', dates: 'all', category: '' },
      new Date(),
      48
    )
  );
  return result.items.map(hitToPortalEvent);
}

export async function loadPortalExhibition(eventId: string) {
  const safeId = eventId.trim().slice(0, 128);
  const found = await getExhibitionById(safeId);
  if (found) return hitToPortalEventDetail(found.item);
  return labelledDemoPortalEvent(safeId);
}

/** Classify a listing fetch so the page can 404 before streaming starts. */
export async function resolvePortalExhibition(
  eventId: string
): Promise<PortalExhibitionResult> {
  try {
    const event = await loadPortalExhibition(eventId);
    return { status: 'ok', event };
  } catch (error) {
    if (isMissingPortalEvent(error)) return { status: 'missing' };
    return { status: 'error' };
  }
}
