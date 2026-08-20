import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { EventStackStore } from './store';
import { paymentProviderFromEnv } from './payment';

describe('payment provider', () => {
  it('stays mock until all ECPay sandbox keys exist', () => {
    assert.equal(paymentProviderFromEnv({}), 'mock');
    assert.equal(
      paymentProviderFromEnv({
        merchantId: '3002607',
        hashKey: '',
        hashIV: 'iv',
      }),
      'mock'
    );
    assert.equal(
      paymentProviderFromEnv({
        merchantId: '3002607',
        hashKey: 'key',
        hashIV: 'iv',
      }),
      'ecpay-sandbox'
    );
  });
});

describe('event-stack payment intents', () => {
  it('creates a mock intent without card fields then pays once', () => {
    const store = new EventStackStore();
    const created = store.createOrder({
      eventId: 'event_react19',
      data: {
        paymentMethod: 'third_party',
        totalAmount: 1500,
        tickets: { general: 2 },
      },
    });
    assert.ok(!('error' in created));
    if ('error' in created) return;

    const intent = store.createPaymentIntent(created.id, {
      publicApiBase: 'http://localhost:3001/api',
    });
    assert.ok(!('error' in intent));
    if ('error' in intent) return;
    assert.equal(intent.provider, 'mock');
    assert.equal(intent.status, 'created');
    assert.equal(intent.amount, 1500);
    assert.equal(
      intent.checkoutUrl,
      `http://localhost:3001/api/payments/mock-complete/${intent.id}`
    );
    assert.equal('cardNumber' in intent, false);
    assert.equal('pan' in intent, false);

    const paid = store.applyPaymentWebhook({
      merchantTradeNo: intent.merchantTradeNo,
      rtnCode: '1',
    });
    assert.ok(!('error' in paid));
    if ('error' in paid) return;
    assert.equal(paid.replayed, false);
    assert.equal(paid.intent.status, 'paid');
    assert.equal(store.getOrder(created.id)?.status, 'confirmed');
    assert.equal(store.listTicketsByOrder(created.id).length, 2);
  });

  it('replays a paid webhook without issuing tickets twice', () => {
    const store = new EventStackStore();
    const created = store.createOrder({
      eventId: 'event_react19',
      data: {
        paymentMethod: 'third_party',
        totalAmount: 800,
        tickets: { general: 1 },
      },
    });
    assert.ok(!('error' in created));
    if ('error' in created) return;
    const intent = store.createPaymentIntent(created.id, {
      publicApiBase: 'http://localhost:3011/api',
    });
    assert.ok(!('error' in intent));
    if ('error' in intent) return;

    store.applyPaymentWebhook({
      merchantTradeNo: intent.merchantTradeNo,
      rtnCode: '1',
    });
    const replay = store.applyPaymentWebhook({
      merchantTradeNo: intent.merchantTradeNo,
      rtnCode: '1',
    });
    assert.ok(!('error' in replay));
    if ('error' in replay) return;
    assert.equal(replay.replayed, true);
    assert.equal(replay.intent.status, 'paid');
    assert.equal(store.listTicketsByOrder(created.id).length, 1);
  });

  it('keeps the order pending when the webhook reports failure', () => {
    const store = new EventStackStore();
    const created = store.createOrder({
      eventId: 'event_react19',
      data: {
        paymentMethod: 'third_party',
        totalAmount: 800,
        tickets: { general: 1 },
      },
    });
    assert.ok(!('error' in created));
    if ('error' in created) return;
    const intent = store.createPaymentIntent(created.id, {
      publicApiBase: 'http://localhost:3001/api',
    });
    assert.ok(!('error' in intent));
    if ('error' in intent) return;

    const failed = store.applyPaymentWebhook({
      merchantTradeNo: intent.merchantTradeNo,
      rtnCode: '0',
    });
    assert.ok(!('error' in failed));
    if ('error' in failed) return;
    assert.equal(failed.intent.status, 'failed');
    assert.equal(store.getOrder(created.id)?.status, 'pending');
    assert.equal(store.listTicketsByOrder(created.id).length, 0);

    const afterPaid = store.applyPaymentWebhook({
      merchantTradeNo: intent.merchantTradeNo,
      rtnCode: '0',
    });
    assert.ok(!('error' in afterPaid));
    if ('error' in afterPaid) return;
    assert.equal(afterPaid.replayed, true);
  });
});
