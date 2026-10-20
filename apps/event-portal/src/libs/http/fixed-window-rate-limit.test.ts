import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  clientIp,
  createFixedWindowRateLimit,
  envFlagDisabled,
} from './fixed-window-rate-limit';

describe('createFixedWindowRateLimit', () => {
  it('allows a burst then returns retry-after', () => {
    const limiter = createFixedWindowRateLimit({ windowMs: 60_000, max: 2 });
    const now = 1_000_000;
    assert.equal(limiter.consume('1.1.1.1', now).ok, true);
    assert.equal(limiter.consume('1.1.1.1', now + 10).ok, true);
    const blocked = limiter.consume('1.1.1.1', now + 20);
    assert.equal(blocked.ok, false);
    if (!blocked.ok) assert.ok(blocked.retryAfterSec >= 1);
    assert.equal(limiter.consume('8.8.8.8', now + 20).ok, true);
  });

  it('opens a new window after resetAt', () => {
    const limiter = createFixedWindowRateLimit({ windowMs: 1_000, max: 1 });
    const now = 5_000;
    assert.equal(limiter.consume('k', now).ok, true);
    assert.equal(limiter.consume('k', now + 10).ok, false);
    assert.equal(limiter.consume('k', now + 1_000).ok, true);
  });
});

describe('clientIp', () => {
  it('uses the first x-forwarded-for hop', () => {
    const request = new Request('http://localhost/api', {
      headers: { 'x-forwarded-for': '203.0.113.9, 10.0.0.1' },
    });
    assert.equal(clientIp(request), '203.0.113.9');
  });

  it('falls back to x-real-ip then local', () => {
    const real = new Request('http://localhost/api', {
      headers: { 'x-real-ip': '198.51.100.4' },
    });
    assert.equal(clientIp(real), '198.51.100.4');
    assert.equal(clientIp(new Request('http://localhost/api')), 'local');
  });
});

describe('envFlagDisabled', () => {
  it('treats 0 and false as opt-out', () => {
    assert.equal(envFlagDisabled(undefined), false);
    assert.equal(envFlagDisabled('1'), false);
    assert.equal(envFlagDisabled('0'), true);
    assert.equal(envFlagDisabled('false'), true);
  });
});
