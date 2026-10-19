import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { NextRequest } from 'next/server';

import { LINE_ID_TOKEN_ISSUER } from '../../../../../libs/line/verify-id-token';

import { POST } from './route';

const CLIENT_ID = '2000000001';
const NOW_SEC = Math.floor(Date.now() / 1000) + 3600;

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('POST /api/line/auth/token', () => {
  const env = { ...process.env };

  afterEach(() => {
    process.env = { ...env };
  });

  it('uses LINE verify claims for lineId instead of unsigned JWT decode', async () => {
    process.env.NEXT_PUBLIC_LINE_CLIENT_ID = CLIENT_ID;
    process.env.LINE_CLIENT_SECRET = 'line-secret';
    process.env.NEXT_PUBLIC_LINE_REDIRECT_URI = 'http://localhost:3000';

    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async (url: string | URL | Request) => {
      const href = String(url);
      if (href.includes('/oauth2/v2.1/token')) {
        return jsonResponse(200, {
          access_token: 'access',
          id_token: 'header.payload.sig',
          token_type: 'Bearer',
          expires_in: 3600,
          refresh_token: 'refresh',
        });
      }
      if (href.includes('/v2/profile')) {
        return jsonResponse(200, { userId: 'U_from_profile', displayName: 'P' });
      }
      if (href.includes('/oauth2/v2.1/verify')) {
        return jsonResponse(200, {
          iss: LINE_ID_TOKEN_ISSUER,
          sub: 'U_verified_sub',
          aud: CLIENT_ID,
          exp: NOW_SEC,
        });
      }
      throw new Error(`unexpected fetch ${href}`);
    }) as typeof fetch;

    try {
      const response = await POST(
        new NextRequest('http://localhost/api/line/auth/token', {
          method: 'POST',
          body: JSON.stringify({ code: 'auth-code' }),
        })
      );
      assert.equal(response.status, 200);
      const body = (await response.json()) as { lineId?: string };
      assert.equal(body.lineId, 'U_verified_sub');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('fails closed when LINE verify rejects the id_token', async () => {
    process.env.NEXT_PUBLIC_LINE_CLIENT_ID = CLIENT_ID;
    process.env.LINE_CLIENT_SECRET = 'line-secret';
    process.env.NEXT_PUBLIC_LINE_REDIRECT_URI = 'http://localhost:3000';

    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async (url: string | URL | Request) => {
      const href = String(url);
      if (href.includes('/oauth2/v2.1/token')) {
        return jsonResponse(200, {
          access_token: 'access',
          id_token: 'forged.payload.sig',
        });
      }
      if (href.includes('/v2/profile')) {
        return jsonResponse(200, { userId: 'U_from_profile' });
      }
      if (href.includes('/oauth2/v2.1/verify')) {
        return jsonResponse(400, { error: 'invalid_request' });
      }
      throw new Error(`unexpected fetch ${href}`);
    }) as typeof fetch;

    try {
      const response = await POST(
        new NextRequest('http://localhost/api/line/auth/token', {
          method: 'POST',
          body: JSON.stringify({ code: 'auth-code' }),
        })
      );
      assert.equal(response.status, 401);
      const body = (await response.json()) as { lineId?: string; code?: string };
      assert.equal(body.lineId, undefined);
      assert.equal(body.code, 'verify_rejected');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
