import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  handleLabelledDemoRequest,
  resetLabelledDemoStore,
} from './labelled-demo-bff';

describe('labelled-demo BFF', () => {
  it('serves fixture catalog and guest order theater without Nest', async () => {
    resetLabelledDemoStore();

    const listed = await handleLabelledDemoRequest(
      new Request('https://nx-event-portal.vercel.app/api/events?limit=50')
    );
    assert.equal(listed.status, 200);
    const catalog = (await listed.json()) as { items: { id: string }[] };
    assert.equal(catalog.items.some(event => event.id === 'event_react19'), true);

    const created = await handleLabelledDemoRequest(
      new Request('https://nx-event-portal.vercel.app/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          eventId: 'event_react19',
          userId: 'user_demo',
          data: {
            sessionId: 'event_react19-session-a',
            tickets: { 'event_react19-ticket-general': 1 },
            paymentMethod: 'cash',
            totalAmount: 0,
            totalTickets: 1,
          },
        }),
      })
    );
    assert.equal(created.status, 201);
    const order = (await created.json()) as { id: string };
    assert.match(order.id, /^order_/);

    const confirmed = await handleLabelledDemoRequest(
      new Request(
        `https://nx-event-portal.vercel.app/api/orders/${order.id}/confirm`,
        { method: 'POST' }
      )
    );
    assert.equal(confirmed.status, 200);

    const tickets = await handleLabelledDemoRequest(
      new Request(
        `https://nx-event-portal.vercel.app/api/orders/${order.id}/tickets`
      )
    );
    assert.equal(tickets.status, 200);
    const listedTickets = (await tickets.json()) as { items: unknown[] };
    assert.ok(listedTickets.items.length > 0);
  });

  it('does not claim to be the funds API', async () => {
    const missing = await handleLabelledDemoRequest(
      new Request('https://nx-event-portal.vercel.app/api/unknown')
    );
    const body = (await missing.json()) as { fundsPath?: boolean };
    assert.equal(missing.status, 404);
    assert.equal(body.fundsPath, false);
  });
});
