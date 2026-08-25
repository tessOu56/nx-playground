import type { EventStackEvent } from '@nx-playground/api-client/event-stack';
import { loadFixtureEvents } from '@nx-playground/api-fixtures';

const fixtureById = new Map(
  loadFixtureEvents().map(event => [event.id, event] as const)
);

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function isMissingExtra(value: unknown): boolean {
  if (value == null) return true;
  if (Array.isArray(value)) return value.length === 0;
  const record = asRecord(value);
  if (record) return Object.keys(record).length === 0;
  return false;
}

/**
 * Hosted api-mock can lag fixture updates. Merge catalogue extras when the API
 * payload is thin so labelled demo pages still show T-261/T-269 attendee fields.
 */
export function enrichEventStackEvent(event: EventStackEvent): EventStackEvent {
  const fixture = fixtureById.get(event.id);
  if (!fixture?.data) return event;

  const apiData = asRecord(event.data) ?? {};
  const fixtureData = asRecord(fixture.data) ?? {};
  const merged: Record<string, unknown> = { ...apiData };

  for (const key of [
    'speakers',
    'venue',
    'organizer',
    'content',
    'faq',
    'kind',
    'plinthLotUrl',
  ] as const) {
    if (isMissingExtra(merged[key]) && !isMissingExtra(fixtureData[key])) {
      merged[key] = fixtureData[key];
    }
  }

  return { ...event, data: merged };
}

export function enrichEventStackEvents(events: EventStackEvent[]): EventStackEvent[] {
  return events.map(enrichEventStackEvent);
}
