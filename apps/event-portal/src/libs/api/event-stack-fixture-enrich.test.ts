import { describe, expect, it } from 'vitest';

import type { EventStackEvent } from '@nx-playground/api-client/event-stack';

import { enrichEventStackEvent } from './event-stack-fixture-enrich';

describe('enrichEventStackEvent', () => {
  it('fills speakers, venue, and organizer from fixtures when API data is thin', () => {
    const thin: EventStackEvent = {
      id: 'event_summer',
      title: '夏日開源小聚',
      startDate: '2026-07-12T13:00:00.000Z',
      endDate: '2026-07-12T17:00:00.000Z',
      status: 'published',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      data: { sessions: [] },
    };

    const enriched = enrichEventStackEvent(thin);
    const data = enriched.data as Record<string, unknown>;

    expect(Array.isArray(data.speakers)).toBe(true);
    expect((data.speakers as unknown[]).length).toBeGreaterThan(0);
    expect(asRecord(data.venue)?.lat).toBeTypeOf('number');
    expect(data.organizer).toBe('台中開源社群');
  });
});

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}
