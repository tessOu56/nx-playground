import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  LINE_ID_TOKEN_ISSUER,
  LINE_ID_TOKEN_VERIFY_URL,
  LineIdTokenVerificationError,
  assertLocalIdTokenClaims,
  verifyLineIdToken,
} from './verify-id-token';

const CLIENT_ID = '2000000000';
const NOW_MS = 1_700_000_000_000;

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    iss: LINE_ID_TOKEN_ISSUER,
    sub: 'U1234567890abcdef',
    aud: CLIENT_ID,
    exp: Math.floor(NOW_MS / 1000) + 3600,
    iat: Math.floor(NOW_MS / 1000),
    nonce: 'n-once',
    name: 'Tess',
    ...overrides,
  };
}

describe('assertLocalIdTokenClaims', () => {
  it('accepts a LINE payload with matching iss, aud, exp', () => {
    const payload = assertLocalIdTokenClaims(validPayload(), {
      clientId: CLIENT_ID,
      nowMs: NOW_MS,
    });
    assert.equal(payload.sub, 'U1234567890abcdef');
  });

  it('rejects a forged issuer', () => {
    assert.throws(
      () =>
        assertLocalIdTokenClaims(validPayload({ iss: 'https://evil.example' }), {
          clientId: CLIENT_ID,
          nowMs: NOW_MS,
        }),
      (error: unknown) =>
        error instanceof LineIdTokenVerificationError &&
        error.code === 'invalid_iss'
    );
  });

  it('rejects audience that is not the channel ID', () => {
    assert.throws(
      () =>
        assertLocalIdTokenClaims(validPayload({ aud: 'someone-else' }), {
          clientId: CLIENT_ID,
          nowMs: NOW_MS,
        }),
      (error: unknown) =>
        error instanceof LineIdTokenVerificationError &&
        error.code === 'invalid_aud'
    );
  });

  it('rejects expired tokens', () => {
    assert.throws(
      () =>
        assertLocalIdTokenClaims(
          validPayload({ exp: Math.floor(NOW_MS / 1000) - 1 }),
          { clientId: CLIENT_ID, nowMs: NOW_MS }
        ),
      (error: unknown) =>
        error instanceof LineIdTokenVerificationError && error.code === 'expired'
    );
  });

  it('rejects nonce mismatch when nonce is required', () => {
    assert.throws(
      () =>
        assertLocalIdTokenClaims(validPayload({ nonce: 'other' }), {
          clientId: CLIENT_ID,
          nonce: 'n-once',
          nowMs: NOW_MS,
        }),
      (error: unknown) =>
        error instanceof LineIdTokenVerificationError &&
        error.code === 'invalid_nonce'
    );
  });

  it('does not require nonce when the caller omitted it', () => {
    const payload = assertLocalIdTokenClaims(
      validPayload({ nonce: undefined }),
      { clientId: CLIENT_ID, nowMs: NOW_MS }
    );
    assert.equal(payload.sub, 'U1234567890abcdef');
  });
});

describe('verifyLineIdToken', () => {
  it('POSTs id_token and client_id to LINE verify and returns claims', async () => {
    const calls: Array<{ url: string; body: string }> = [];
    const payload = validPayload();
    const verified = await verifyLineIdToken(
      { idToken: 'header.payload.sig', clientId: CLIENT_ID, nonce: 'n-once' },
      {
        nowMs: NOW_MS,
        fetchImpl: async (url, init) => {
          calls.push({ url: String(url), body: String(init?.body ?? '') });
          return new Response(JSON.stringify(payload), { status: 200 });
        },
      }
    );

    assert.equal(calls.length, 1);
    assert.equal(calls[0]?.url, LINE_ID_TOKEN_VERIFY_URL);
    assert.match(calls[0]?.body ?? '', /id_token=header.payload.sig/);
    assert.match(calls[0]?.body ?? '', /client_id=2000000000/);
    assert.match(calls[0]?.body ?? '', /nonce=n-once/);
    assert.equal(verified.sub, payload.sub);
  });

  it('fails closed when LINE rejects the token', async () => {
    await assert.rejects(
      () =>
        verifyLineIdToken(
          { idToken: 'forged', clientId: CLIENT_ID },
          {
            fetchImpl: async () =>
              new Response(JSON.stringify({ error: 'invalid_request' }), {
                status: 400,
              }),
          }
        ),
      (error: unknown) =>
        error instanceof LineIdTokenVerificationError &&
        error.code === 'verify_rejected'
    );
  });

  it('fails closed without a channel ID even if LINE would answer', async () => {
    await assert.rejects(
      () =>
        verifyLineIdToken(
          { idToken: 'header.payload.sig', clientId: '  ' },
          {
            fetchImpl: async () => {
              throw new Error('must not call LINE');
            },
          }
        ),
      (error: unknown) =>
        error instanceof LineIdTokenVerificationError &&
        error.code === 'missing_client_id'
    );
  });

  it('fails closed when LINE is unreachable', async () => {
    await assert.rejects(
      () =>
        verifyLineIdToken(
          { idToken: 'header.payload.sig', clientId: CLIENT_ID },
          {
            fetchImpl: async () => {
              throw new TypeError('network');
            },
          }
        ),
      (error: unknown) =>
        error instanceof LineIdTokenVerificationError &&
        error.code === 'verify_unreachable'
    );
  });

  it('does not trust a LINE 200 whose aud does not match client_id', async () => {
    await assert.rejects(
      () =>
        verifyLineIdToken(
          { idToken: 'header.payload.sig', clientId: CLIENT_ID },
          {
            nowMs: NOW_MS,
            fetchImpl: async () =>
              new Response(
                JSON.stringify(validPayload({ aud: 'wrong-channel' })),
                { status: 200 }
              ),
          }
        ),
      (error: unknown) =>
        error instanceof LineIdTokenVerificationError &&
        error.code === 'invalid_aud'
    );
  });
});
