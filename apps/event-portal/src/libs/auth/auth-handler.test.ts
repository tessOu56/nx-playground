import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import type { NextRequest } from 'next/server';

process.env.DATABASE_URL ??=
  'postgresql://postgres:postgres@127.0.0.1:5433/postgres';
process.env.BETTER_AUTH_URL ??= 'http://localhost:3000';
process.env.BETTER_AUTH_SECRET ??= 'test-better-auth-secret-passkey-phase-2';

type AuthHandler = (request: NextRequest) => Promise<Response>;

describe('Better Auth passkey and linking HTTP routes', () => {
  let GET: AuthHandler;
  let POST: AuthHandler;

  before(async () => {
    const route = await import('../../app/api/auth/[...all]/route');
    GET = route.GET;
    POST = route.POST;
  });

  async function authRequest(
    handler: AuthHandler,
    path: string,
    init?: RequestInit
  ) {
    const { NextRequest } = await import('next/server');
    return handler(
      new NextRequest(`http://localhost:3000${path}`, {
        ...init,
        headers: {
          origin: 'http://localhost:3000',
          ...(init?.headers ?? {}),
        },
      })
    );
  }

  it('rejects unauthenticated passkey list and delete', async () => {
    const list = await authRequest(GET, '/api/auth/passkey/list-user-passkeys');
    assert.equal(list.status, 401);

    const del = await authRequest(POST, '/api/auth/passkey/delete-passkey', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: 'pk_missing' }),
    });
    assert.equal(del.status, 401);
  });

  it('rejects unauthenticated unlink', async () => {
    const response = await authRequest(POST, '/api/auth/unlink-account', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ providerId: 'google' }),
    });
    assert.ok(
      response.status === 400 || response.status === 401,
      `expected 400 or 401, got ${response.status}`
    );
    const body = (await response.json()) as { status?: unknown };
    assert.notEqual(body.status, true);
  });
});
