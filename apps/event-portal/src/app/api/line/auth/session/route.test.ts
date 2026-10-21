import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { NextRequest } from 'next/server';

import { resetLineRateLimit } from '../../../../../libs/line/rate-limit';
import {
  LINE_ACCESS_TOKEN_COOKIE,
  LINE_ID_TOKEN_COOKIE,
} from '../../../../../libs/line/session-cookies';
import { LINE_ID_TOKEN_ISSUER } from '../../../../../libs/line/verify-id-token';

import { DELETE, GET, POST } from './route';

const CLIENT_ID = '2000000001';
const NOW_SEC = Math.floor(Date.now() / 1000) + 3600;

function encodeClaims(claims: Record<string, unknown>) {
  return `h.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.s`;
}

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('LINE session cookies', () => {
  const env = { ...process.env };

  afterEach(() => {
    process.env = { ...env };
    process.env.PORTAL_SHARED_KV = 'memory';
    resetLineRateLimit();
  });

  it('GET returns profile claims from httpOnly cookies and never echoes tokens', async () => {
    const idToken = encodeClaims({
      sub: 'U_session',
      name: 'Ada',
      exp: NOW_SEC,
    });
    const response = await GET(
      new NextRequest('http://localhost:3000/api/line/auth/session', {
        headers: {
          cookie: `${LINE_ACCESS_TOKEN_COOKIE}=access-secret; ${LINE_ID_TOKEN_COOKIE}=${idToken}`,
        },
      })
    );
    assert.equal(response.status, 200);
    const body = (await response.json()) as {
      lineId?: string;
      accessToken?: unknown;
      idToken?: unknown;
    };
    assert.equal(body.lineId, 'U_session');
    assert.equal(body.accessToken, null);
    assert.equal(body.idToken, null);
  });

  it('POST verifies the id token, sets cookies, and omits tokens from JSON', async () => {
    process.env.NEXT_PUBLIC_LINE_CLIENT_ID = CLIENT_ID;
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async (url: string | URL | Request) => {
      const href = String(url);
      if (href.includes('/oauth2/v2.1/verify')) {
        return jsonResponse(200, {
          iss: LINE_ID_TOKEN_ISSUER,
          sub: 'U_verified_sub',
          aud: CLIENT_ID,
          exp: NOW_SEC,
          name: 'Ada',
        });
      }
      throw new Error(`unexpected fetch ${href}`);
    }) as typeof fetch;

    try {
      const response = await POST(
        new NextRequest('http://localhost:3000/api/line/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idToken: 'header.payload.sig',
            accessToken: 'access-secret',
          }),
        })
      );
      assert.equal(response.status, 200);
      const body = (await response.json()) as {
        lineId?: string;
        accessToken?: unknown;
        idToken?: unknown;
      };
      assert.equal(body.lineId, 'U_verified_sub');
      assert.equal(body.accessToken, null);
      assert.equal(body.idToken, null);
      const cookies = response.headers.getSetCookie();
      assert.ok(
        cookies.some(
          cookie =>
            cookie.includes(`${LINE_ACCESS_TOKEN_COOKIE}=access-secret`) &&
            cookie.includes('HttpOnly')
        )
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('DELETE clears session cookies', async () => {
    const response = await DELETE();
    assert.equal(response.status, 200);
    const cookies = response.headers.getSetCookie();
    assert.ok(cookies.some(cookie => cookie.includes('Max-Age=0')));
  });
});
