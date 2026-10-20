import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { NextRequest } from 'next/server';

import { LINE_ID_TOKEN_ISSUER } from '../../../../../libs/line/verify-id-token';

import { POST } from './route';

const CLIENT_ID = '2000000001';
const NOW_SEC = Math.floor(Date.now() / 1000) + 3600;
const CODE_VERIFIER = 'a'.repeat(43);

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function tokenRequest(body: Record<string, unknown>, origin?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (origin) headers.origin = origin;
  return new NextRequest('http://localhost:3000/api/line/auth/token', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
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
          refresh_token: 'refresh-must-not-leave-server',
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
        tokenRequest({ code: 'auth-code', code_verifier: CODE_VERIFIER })
      );
      assert.equal(response.status, 200);
      const body = (await response.json()) as {
        lineId?: string;
        refreshToken?: unknown;
        accessToken?: string;
      };
      assert.equal(body.lineId, 'U_verified_sub');
      assert.equal(body.refreshToken, undefined);
      assert.equal(body.accessToken, 'access');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('pins redirect_uri to the portal origin and ignores a client-supplied URI', async () => {
    process.env.NEXT_PUBLIC_LINE_CLIENT_ID = CLIENT_ID;
    process.env.LINE_CLIENT_SECRET = 'line-secret';
    process.env.NEXT_PUBLIC_LINE_REDIRECT_URI = 'http://localhost:3000';

    const originalFetch = globalThis.fetch;
    const tokenBodies: string[] = [];
    globalThis.fetch = (async (
      url: string | URL | Request,
      init?: RequestInit
    ) => {
      const href = String(url);
      if (href.includes('/oauth2/v2.1/token')) {
        tokenBodies.push(String(init?.body ?? ''));
        return jsonResponse(200, {
          access_token: 'access',
          id_token: 'header.payload.sig',
          token_type: 'Bearer',
          expires_in: 3600,
        });
      }
      if (href.includes('/v2/profile')) {
        return jsonResponse(200, { userId: 'U_from_profile' });
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
        tokenRequest({
          code: 'auth-code',
          code_verifier: CODE_VERIFIER,
          redirect_uri: 'https://evil.example/callback',
        })
      );
      assert.equal(response.status, 200);
      assert.equal(tokenBodies.length, 1);
      assert.match(
        tokenBodies[0] ?? '',
        /redirect_uri=http%3A%2F%2Flocalhost%3A3000/
      );
      assert.doesNotMatch(tokenBodies[0] ?? '', /evil\.example/);
      assert.match(tokenBodies[0] ?? '', /code_verifier=a{43}/);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('rejects a missing PKCE verifier without calling LINE', async () => {
    process.env.NEXT_PUBLIC_LINE_CLIENT_ID = CLIENT_ID;
    process.env.LINE_CLIENT_SECRET = 'line-secret';
    process.env.NEXT_PUBLIC_LINE_REDIRECT_URI = 'http://localhost:3000';

    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async () => {
      throw new Error('must not call LINE');
    }) as typeof fetch;

    try {
      const response = await POST(tokenRequest({ code: 'auth-code' }));
      assert.equal(response.status, 400);
      const body = (await response.json()) as { error?: string };
      assert.equal(body.error, 'Missing PKCE verifier');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('rejects a cross-site Origin', async () => {
    process.env.NEXT_PUBLIC_LINE_CLIENT_ID = CLIENT_ID;
    process.env.LINE_CLIENT_SECRET = 'line-secret';
    process.env.NEXT_PUBLIC_LINE_REDIRECT_URI = 'http://localhost:3000';

    const response = await POST(
      tokenRequest(
        { code: 'auth-code', code_verifier: CODE_VERIFIER },
        'https://evil.example'
      )
    );
    assert.equal(response.status, 403);
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
        tokenRequest({ code: 'auth-code', code_verifier: CODE_VERIFIER })
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
