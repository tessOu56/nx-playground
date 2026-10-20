import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  handleLabelledDemoRequest,
  resetLabelledDemoStore,
} from './labelled-demo-bff';

describe('labelled-demo BFF', () => {
  it('serves fixture catalog without Nest', async () => {
    resetLabelledDemoStore();

    const listed = await handleLabelledDemoRequest(
      new Request('https://nx-event-portal.vercel.app/api/events?limit=50')
    );
    assert.equal(listed.status, 200);
    const catalog = (await listed.json()) as { items: { id: string }[] };
    assert.equal(catalog.items.some(event => event.id === 'event_react19'), true);
  });

  it('returns 404 for retired checkout routes', async () => {
    const created = await handleLabelledDemoRequest(
      new Request('https://nx-event-portal.vercel.app/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ eventId: 'event_react19' }),
      })
    );
    assert.equal(created.status, 404);
  });

  it('returns 404 for unknown paths', async () => {
    const missing = await handleLabelledDemoRequest(
      new Request('https://nx-event-portal.vercel.app/api/unknown')
    );
    assert.equal(missing.status, 404);
  });
});
