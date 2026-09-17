import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { fetchPortalEvent, fetchPortalEvents } from './event-stack-fetch';

describe('labelled-demo catalog fallback', () => {
  it('lists published fixture events with price-from and speakers', async () => {
    const previous = process.env.EVENT_STACK_LABELLED_DEMO_BFF;
    process.env.EVENT_STACK_LABELLED_DEMO_BFF = '1';
    try {
      const events = await fetchPortalEvents();
      assert.equal(events.some(event => event.id === 'event_react19'), true);
      assert.equal(events.some(event => event.id === 'event_nx'), false);
      const react = events.find(event => event.id === 'event_react19');
      assert.ok((react?.price ?? 0) > 0);
      assert.ok((react?.speakerCount ?? 0) > 0);
      assert.ok(react?.organizerName);
    } finally {
      if (previous === undefined) delete process.env.EVENT_STACK_LABELLED_DEMO_BFF;
      else process.env.EVENT_STACK_LABELLED_DEMO_BFF = previous;
    }
  });

  it('hides empty FAQ and keeps speakers on a published event', async () => {
    const previous = process.env.EVENT_STACK_LABELLED_DEMO_BFF;
    process.env.EVENT_STACK_LABELLED_DEMO_BFF = '1';
    try {
      const archived = await fetchPortalEvent('event_archived');
      assert.deepEqual(archived.faq, []);
      assert.deepEqual(archived.speakers, []);
      assert.equal(archived.price, 350);

      const summer = await fetchPortalEvent('event_summer');
      assert.equal(summer.speakers[0]?.name, '張予');
      assert.ok(summer.faq.length > 0);
      assert.equal(summer.price, 0);
    } finally {
      if (previous === undefined) delete process.env.EVENT_STACK_LABELLED_DEMO_BFF;
      else process.env.EVENT_STACK_LABELLED_DEMO_BFF = previous;
    }
  });
});
