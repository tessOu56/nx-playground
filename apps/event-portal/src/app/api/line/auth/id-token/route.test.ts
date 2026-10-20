import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { NextRequest } from 'next/server';

import { resetLineRateLimit } from '../../../../../libs/line/rate-limit';

import { POST } from './route';

function idTokenRequest(body: Record<string, unknown>, forwardedFor?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (forwardedFor) headers['x-forwarded-for'] = forwardedFor;
  return new NextRequest('http://localhost:3000/api/line/auth/id-token', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}

describe('POST /api/line/auth/id-token', () => {
  const env = { ...process.env };

  afterEach(() => {
    process.env = { ...env };
    resetLineRateLimit();
  });

  it('returns 429 when the id-token window is exhausted', async () => {
    process.env.NEXT_PUBLIC_LINE_CLIENT_ID = '2000000001';

    for (let i = 0; i < 30; i += 1) {
      const response = await POST(
        idTokenRequest({}, '203.0.113.60')
      );
      assert.equal(response.status, 400);
    }

    const blocked = await POST(idTokenRequest({ idToken: 'x' }, '203.0.113.60'));
    assert.equal(blocked.status, 429);
    const body = (await blocked.json()) as { error?: string };
    assert.equal(body.error, 'Too many requests');
    assert.ok(Number(blocked.headers.get('retry-after')) >= 1);
  });
});
