import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { EventStackStore } from './store';
import { ticketSpecsFromOrderData } from './ticket';

describe('ticketSpecsFromOrderData', () => {
  it('expands checkout ticket map', () => {
    assert.deepEqual(
      ticketSpecsFromOrderData({ tickets: { general: 2, vip: 1 } }),
      [
        { type: 'general', quantity: 2 },
        { type: 'vip', quantity: 1 },
      ]
    );
  });

  it('falls back to one general ticket for free/cash checkout', () => {
    assert.deepEqual(ticketSpecsFromOrderData({ paymentMethod: 'cash' }), [
      { type: 'general', quantity: 1 },
    ]);
  });
});

describe('event-stack tickets', () => {
  it('issues tickets on confirm and check-in hits the store', () => {
    const store = new EventStackStore();
    const created = store.createOrder({
      eventId: 'event_react19',
      data: { paymentMethod: 'cash', tickets: { general: 2 } },
    });
    assert.ok(!('error' in created));
    if ('error' in created) return;
    const confirmed = store.confirmOrder(created.id);
    assert.equal(confirmed?.status, 'confirmed');
    const tickets = store.listTicketsByOrder(created.id);
    assert.equal(tickets.length, 2);
    assert.equal(tickets[0].status, 'issued');
    const checked = store.checkInTicket(tickets[0].id);
    assert.ok(checked && !('error' in checked));
    if (!checked || 'error' in checked) return;
    assert.equal(checked.status, 'used');
    const verify = store.verifyTicket(tickets[0].id);
    assert.equal(verify?.isValid, false);
    const second = store.checkInTicket(tickets[0].id);
    assert.ok(second && 'error' in second);
  });
});
