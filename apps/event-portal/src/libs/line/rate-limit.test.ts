import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import {
  consumeLineAuthTokenRateLimit,
  consumeLineWebhookRateLimit,
  enforceLineRateLimit,
  lineRateLimitDisabled,
  resetLineRateLimit,
} from './rate-limit';

describe('LINE rate limits', () => {
  afterEach(() => {
    resetLineRateLimit();
    delete process.env.LINE_RATE_LIMIT;
  });

  it('is opt-out via LINE_RATE_LIMIT', () => {
    assert.equal(lineRateLimitDisabled({}), false);
    assert.equal(lineRateLimitDisabled({ LINE_RATE_LIMIT: '0' }), true);
  });

  it('uses separate buckets for webhook and token exchange', async () => {
    const now = 2_000_000;
    assert.equal((await consumeLineWebhookRateLimit('9.9.9.9', now, 1)).ok, true);
    assert.equal(
      (await consumeLineWebhookRateLimit('9.9.9.9', now + 1, 1)).ok,
      false
    );
    assert.equal(
      (await consumeLineAuthTokenRateLimit('9.9.9.9', now, 1)).ok,
      true
    );
  });

  it('returns a 429 Response with Retry-After', async () => {
    const request = new Request('http://localhost/api/line/webhook', {
      headers: { 'x-forwarded-for': '203.0.113.10' },
    });
    await consumeLineWebhookRateLimit('203.0.113.10', Date.now(), 1);
    const response = await enforceLineRateLimit(
      request,
      key => consumeLineWebhookRateLimit(key, Date.now(), 1),
      'text'
    );
    assert.ok(response);
    assert.equal(response?.status, 429);
    assert.ok(Number(response?.headers.get('retry-after')) >= 1);
  });
});
