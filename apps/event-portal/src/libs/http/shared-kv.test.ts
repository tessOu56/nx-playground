import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import {
  memorySharedKv,
  resetSharedKvMemory,
  sharedIncr,
  sharedKvBackend,
  sharedSetNx,
} from './shared-kv';

describe('sharedKvBackend', () => {
  it('prefers an explicit memory override', () => {
    assert.equal(
      sharedKvBackend({
        PORTAL_SHARED_KV: 'memory',
        DATABASE_URL: 'postgresql://example/db',
        UPSTASH_REDIS_REST_URL: 'https://example.upstash.io',
        UPSTASH_REDIS_REST_TOKEN: 'token',
      }),
      'memory'
    );
  });

  it('prefers Upstash over Postgres when both are configured', () => {
    assert.equal(
      sharedKvBackend({
        DATABASE_URL: 'postgresql://example/db',
        UPSTASH_REDIS_REST_URL: 'https://example.upstash.io',
        UPSTASH_REDIS_REST_TOKEN: 'token',
      }),
      'upstash'
    );
  });

  it('uses Postgres when only DATABASE_URL is set', () => {
    assert.equal(
      sharedKvBackend({ DATABASE_URL: 'postgresql://example/db' }),
      'postgres'
    );
  });
});

describe('memory shared kv', () => {
  afterEach(() => {
    resetSharedKvMemory();
  });

  it('increments inside a window and resets after expiry', async () => {
    const kv = memorySharedKv();
    const now = 1_000_000;
    assert.deepEqual(await kv.incr('k', 1_000, now), {
      count: 1,
      resetAt: 1_001_000,
    });
    assert.equal((await kv.incr('k', 1_000, now + 10)).count, 2);
    assert.equal((await kv.incr('k', 1_000, now + 1_000)).count, 1);
  });

  it('setNx rejects a live key and allows reuse after TTL', async () => {
    const kv = memorySharedKv();
    const now = 5_000;
    assert.equal(await kv.setNx('evt', 1_000, now), true);
    assert.equal(await kv.setNx('evt', 1_000, now + 10), false);
    assert.equal(await kv.setNx('evt', 1_000, now + 1_000), true);
  });
});

describe('shared helpers fall back to memory', () => {
  const env = { ...process.env };

  afterEach(() => {
    process.env = { ...env };
    resetSharedKvMemory();
  });

  it('sharedIncr / sharedSetNx work when PORTAL_SHARED_KV=memory', async () => {
    process.env.PORTAL_SHARED_KV = 'memory';
    const now = 2_000_000;
    assert.equal((await sharedIncr('ip', 60_000, now)).count, 1);
    assert.equal(await sharedSetNx('evt-1', 60_000, now), true);
    assert.equal(await sharedSetNx('evt-1', 60_000, now), false);
  });
});
