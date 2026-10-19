import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { NextRequest } from 'next/server';

import { lineSignatureHeader } from '../../../../libs/line/bot/signature';

import { GET, POST } from './route';

const SECRET = 'webhook-test-secret';
const BODY = JSON.stringify({ destination: 'U1', events: [] });

describe('POST /api/line/webhook', () => {
  const env = { ...process.env };

  afterEach(() => {
    process.env = { ...env };
  });

  it('rejects an invalid signature with 401', async () => {
    process.env.LINE_CHANNEL_SECRET = SECRET;
    const response = await POST(
      new NextRequest('http://localhost/api/line/webhook', {
        method: 'POST',
        headers: { 'x-line-signature': 'not-a-valid-digest' },
        body: BODY,
      })
    );
    assert.equal(response.status, 401);
  });

  it('returns 200 quickly when the HMAC matches the raw body', async () => {
    process.env.LINE_CHANNEL_SECRET = SECRET;
    process.env.LINE_CHANNEL_ACCESS_TOKEN = '';
    const signature = lineSignatureHeader(BODY, SECRET);
    const response = await POST(
      new NextRequest('http://localhost/api/line/webhook', {
        method: 'POST',
        headers: { 'x-line-signature': signature },
        body: BODY,
      })
    );
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'OK');
  });

  it('returns 500 when the channel secret is missing', async () => {
    delete process.env.LINE_CHANNEL_SECRET;
    const response = await POST(
      new NextRequest('http://localhost/api/line/webhook', {
        method: 'POST',
        body: BODY,
      })
    );
    assert.equal(response.status, 500);
  });

  it('accepts GET for console connectivity checks', async () => {
    const response = await GET();
    assert.equal(response.status, 200);
  });
});
