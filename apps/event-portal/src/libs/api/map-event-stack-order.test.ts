import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  orderStatusFromApi,
  paymentMethodFromData,
  toPortalOrder,
} from './map-event-stack-order';

describe('map-event-stack-order', () => {
  it('maps GET /orders/{id} payload onto the portal Order shape', () => {
    const order = toPortalOrder({
      id: 'order_demo_1',
      eventId: 'event_react19',
      userId: 'user_demo',
      status: 'confirmed',
      data: {
        name: '一般用戶',
        totalTickets: 2,
        totalAmount: 1500,
        paymentMethod: 'atm',
      },
      createdAt: '2026-08-18T12:24:24.300Z',
      updatedAt: '2026-08-18T12:24:24.300Z',
    });

    assert.equal(order.id, 'order_demo_1');
    assert.equal(order.userId, 'user_demo');
    assert.equal(order.quantity, 2);
    assert.equal(order.totalAmount, 1500);
    assert.equal(order.status, 'confirmed');
    assert.equal(order.paymentMethod, 'atm');
  });

  it('maps third_party from checkout data', () => {
    assert.equal(
      paymentMethodFromData({ paymentMethod: 'third_party' }),
      'third_party'
    );
  });

  it('defaults unknown status and missing amounts without using mockOrders', () => {
    assert.equal(orderStatusFromApi('paid'), 'pending');
    assert.equal(paymentMethodFromData({}), 'cash');
    const order = toPortalOrder({
      id: 'order_demo_1',
      eventId: 'event_react19',
      userId: 'user_demo',
      status: 'mystery',
      data: { name: '一般用戶' },
      createdAt: '2026-08-18T12:24:24.300Z',
      updatedAt: '2026-08-18T12:24:24.300Z',
    });
    assert.equal(order.quantity, 1);
    assert.equal(order.totalAmount, 0);
    assert.equal(order.status, 'pending');
  });
});
