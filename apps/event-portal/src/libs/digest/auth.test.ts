import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isCronAuthorized, parseBearerToken, timingSafeEqualUtf8 } from './auth';

describe('cron bearer auth', () => {
  it('parses a Bearer token and rejects other schemes', () => {
    assert.equal(parseBearerToken('Bearer secret-value'), 'secret-value');
    assert.equal(parseBearerToken('bearer secret-value'), 'secret-value');
    assert.equal(parseBearerToken('Basic secret-value'), undefined);
    assert.equal(parseBearerToken(''), undefined);
  });

  it('compares secrets in constant time', () => {
    assert.equal(timingSafeEqualUtf8('same-secret', 'same-secret'), true);
    assert.equal(timingSafeEqualUtf8('same-secret', 'other-secret'), false);
    assert.equal(timingSafeEqualUtf8('ab', 'abc'), false);
  });

  it('fails closed when CRON_SECRET is unset', () => {
    assert.equal(isCronAuthorized('Bearer anything', ''), false);
    assert.equal(isCronAuthorized('Bearer anything', undefined), false);
    assert.equal(isCronAuthorized(undefined, 'set'), false);
  });

  it('accepts only the matching bearer', () => {
    assert.equal(isCronAuthorized('Bearer cron-secret', 'cron-secret'), true);
    assert.equal(isCronAuthorized('Bearer wrong-secret', 'cron-secret'), false);
  });
});
