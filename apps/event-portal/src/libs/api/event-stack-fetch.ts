import { getEvent, listEvents } from '@nx-playground/api-client/event-stack';

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

export async function fetchPortalEvents() {
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
