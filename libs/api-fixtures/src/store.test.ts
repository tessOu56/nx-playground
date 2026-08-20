import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import Ajv from 'ajv';

import {
  EventStackStore,
  createEventSchema,
  eventRecordSchema,
  loadFixtureEvents,
  loadFixtureOrders,
  orderRecordSchema,
} from './index';

const ajv = new Ajv({ allErrors: true, strict: false });

describe('event-stack fixtures', () => {
  it('seed events match the Nest event-stack schema', () => {
    const validate = ajv.compile(eventRecordSchema);
    for (const event of loadFixtureEvents()) {
      assert.equal(validate(event), true, ajv.errorsText(validate.errors));
    }
  });

  it('seed orders match the Nest order schema', () => {
    const validate = ajv.compile(orderRecordSchema);
    for (const order of loadFixtureOrders()) {
      assert.equal(validate(order), true, ajv.errorsText(validate.errors));
    }
  });

  it('createEvent payload is accepted then visible on GET', () => {
    const store = new EventStackStore();
    const validateCreate = ajv.compile(createEventSchema);
    const payload = {
      title: 'CMS created event',
      description: 'From fixture store test',
      location: '台北',
      startDate: '2026-10-01T10:00:00.000Z',
      endDate: '2026-10-01T12:00:00.000Z',
      status: 'published',
    };
    assert.equal(validateCreate(payload), true, ajv.errorsText(validateCreate.errors));
    const created = store.createEvent(payload);
    const listed = store.listEvents({ status: 'published', limit: 50 });
    assert.ok(listed.items.some(event => event.id === created.id));
    assert.deepEqual(store.getEvent(created.id)?.title, 'CMS created event');
  });

  it('createOrder persists and can be read back', () => {
    const store = new EventStackStore();
    const created = store.createOrder({
      eventId: 'event_react19',
      data: { paymentMethod: 'cash', totalTickets: 1 },
    });
    assert.ok(!('error' in created));
    if ('error' in created) return;
    const fetched = store.getOrder(created.id);
    assert.equal(fetched?.eventId, 'event_react19');
    const listed = store.listOrders({ userId: created.userId, limit: 50 });
    assert.ok(listed.items.some(order => order.id === created.id));
  });
});
