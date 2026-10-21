import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { passkeyRelyingParty } from './passkey-rp';

describe('passkeyRelyingParty', () => {
  it('uses localhost hostname and origin with port for local Better Auth', () => {
    assert.deepEqual(passkeyRelyingParty('http://localhost:3000'), {
      rpID: 'localhost',
      origin: 'http://localhost:3000',
    });
  });

  it('uses the production host from BETTER_AUTH_URL', () => {
    assert.deepEqual(
      passkeyRelyingParty('https://nx-event-portal.vercel.app'),
      {
        rpID: 'nx-event-portal.vercel.app',
        origin: 'https://nx-event-portal.vercel.app',
      }
    );
  });

  it('strips a trailing slash before reading origin', () => {
    assert.deepEqual(passkeyRelyingParty('http://localhost:3000/'), {
      rpID: 'localhost',
      origin: 'http://localhost:3000',
    });
  });
});
