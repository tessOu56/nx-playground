import { getEvent, listEvents } from '@nx-playground/api-client/event-stack';

import { toPortalEvent, toPortalEventDetail } from './event-stack-map';

/** Server-safe fetchers — no React Query, so RSC / prefetch can import this module. */

export async function fetchPortalEvents() {
  const page = await listEvents({ limit: 50 });
  return page.items
    .filter(event => event.status !== 'draft')
    .map(toPortalEvent);
}

export async function fetchPortalEvent(eventId: string) {
  const event = await getEvent(eventId);
  return toPortalEventDetail(event);
}
