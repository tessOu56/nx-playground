import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  clientIp,
  consumeSearchRateLimit,
  resetSearchRateLimit,
  searchRateLimitDisabled,
} from './rate-limit';

describe('consumeSearchRateLimit', () => {
  it('allows a burst then returns 429-shaped retry', () => {
    resetSearchRateLimit();
    const now = 1_000_000;
    assert.equal(consumeSearchRateLimit('1.1.1.1', now, 2).ok, true);
    assert.equal(consumeSearchRateLimit('1.1.1.1', now + 10, 2).ok, true);
    const blocked = consumeSearchRateLimit('1.1.1.1', now + 20, 2);
    assert.equal(blocked.ok, false);
    if (!blocked.ok) assert.ok(blocked.retryAfterSec >= 1);
    assert.equal(consumeSearchRateLimit('8.8.8.8', now + 20, 2).ok, true);
  });
});

describe('clientIp', () => {
  it('uses the first x-forwarded-for hop', () => {
    const request = new Request('http://localhost/api/exhibitions/search', {
      headers: { 'x-forwarded-for': '203.0.113.9, 10.0.0.1' },
    });
    assert.equal(clientIp(request), '203.0.113.9');
  });
});

describe('searchRateLimitDisabled', () => {
  it('is opt-out via env', () => {
    assert.equal(searchRateLimitDisabled({}), false);
    assert.equal(
      searchRateLimitDisabled({ EXHIBITION_SEARCH_RATE_LIMIT: '0' }),
      true
    );
  });
});
