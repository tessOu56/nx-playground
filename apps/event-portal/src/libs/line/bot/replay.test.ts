import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { resetSharedKvMemory } from '../../http/shared-kv';

import {
  LINE_WEBHOOK_MAX_AGE_MS,
  claimLineWebhookEventId,
  isStaleLineWebhookEvent,
  lineWebhookEventId,
} from './replay';

describe('LINE webhook replay', () => {
  afterEach(() => {
    process.env.PORTAL_SHARED_KV = 'memory';
    resetSharedKvMemory();
  });

  it('rejects missing, stale, and far-future timestamps', () => {
    const now = 1_700_000_000_000;
    assert.equal(isStaleLineWebhookEvent({}, now), true);
    assert.equal(isStaleLineWebhookEvent({ timestamp: now - 1_000 }, now), false);
    assert.equal(
      isStaleLineWebhookEvent({ timestamp: now - LINE_WEBHOOK_MAX_AGE_MS - 1 }, now),
      true
    );
    assert.equal(
      isStaleLineWebhookEvent({ timestamp: now + 120_000 }, now),
      true
    );
  });

  it('dedupes webhookEventId with TTL', async () => {
    process.env.PORTAL_SHARED_KV = 'memory';
    const now = 1_700_000_000_000;
    assert.equal(lineWebhookEventId({ webhookEventId: ' 01ABC ' }), '01ABC');
    assert.equal(await claimLineWebhookEventId('01ABC', now), true);
    assert.equal(await claimLineWebhookEventId('01ABC', now + 10), false);
    assert.equal(await claimLineWebhookEventId('', now), false);
  });
});
