import type { EventStackEvent } from '@nx-playground/api-client/event-stack';
import { shouldUseLabelledDemoBff } from '@nx-playground/api-client/event-stack';
import { loadFixtureEvents } from '@nx-playground/api-fixtures';

import { enrichEventStackEvent } from './event-stack-fixture-enrich';
import { toPortalEventDetail, toPublicCatalogEvents } from './event-stack-map';

export function labelledDemoEventRecords(): EventStackEvent[] {
  return loadFixtureEvents().map(event => enrichEventStackEvent(event));
}

export function labelledDemoPortalEvents() {
  return toPublicCatalogEvents(labelledDemoEventRecords());
}

export function labelledDemoPortalEvent(eventId: string) {
  const event = labelledDemoEventRecords().find(row => row.id === eventId);
  if (!event) {
    throw new Error(`labelled-demo event ${eventId} not found`);
  }
  return toPortalEventDetail(event);
}

export function isFixtureCatalogEnabled(): boolean {
  return shouldUseLabelledDemoBff();
}
