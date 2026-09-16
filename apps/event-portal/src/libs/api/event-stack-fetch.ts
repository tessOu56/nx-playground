import { getEvent, listEvents } from '@nx-playground/api-client/event-stack';

import {
  labelledDemoPortalEvent,
  labelledDemoPortalEvents,
  useFixtureCatalog,
} from './labelled-demo-catalog';
import {
  enrichEventStackEvent,
  enrichEventStackEvents,
} from './event-stack-fixture-enrich';
import { toPortalEvent, toPortalEventDetail } from './event-stack-map';

/** Server-safe fetchers — no React Query, so RSC / prefetch can import this module. */

export async function fetchPortalEvents() {
  if (useFixtureCatalog()) {
    return labelledDemoPortalEvents();
  }
  try {
    const page = await listEvents({ limit: 50 });
    return enrichEventStackEvents(page.items)
      .filter(event => event.status !== 'draft')
      .map(toPortalEvent);
  } catch {
    return labelledDemoPortalEvents();
  }
}

export async function fetchPortalEvent(eventId: string) {
  if (useFixtureCatalog()) {
    return labelledDemoPortalEvent(eventId);
  }
  try {
    const event = enrichEventStackEvent(await getEvent(eventId));
    return toPortalEventDetail(event);
  } catch {
    return labelledDemoPortalEvent(eventId);
  }
}
