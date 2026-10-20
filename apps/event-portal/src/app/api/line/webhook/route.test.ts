import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { NextRequest } from 'next/server';

import { lineSignatureHeader } from '../../../../libs/line/bot/signature';

import { GET, MAX_LINE_WEBHOOK_BYTES, POST } from './route';

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

  it('rejects a missing signature header with 401', async () => {
    process.env.LINE_CHANNEL_SECRET = SECRET;
    const response = await POST(
      new NextRequest('http://localhost/api/line/webhook', {
        method: 'POST',
        body: BODY,
      })
    );
    assert.equal(response.status, 401);
  });

  it('rejects a valid signature computed for a different body', async () => {
    process.env.LINE_CHANNEL_SECRET = SECRET;
    const signature = lineSignatureHeader(BODY, SECRET);
    const response = await POST(
      new NextRequest('http://localhost/api/line/webhook', {
        method: 'POST',
        headers: { 'x-line-signature': signature },
        body: JSON.stringify({ destination: 'U1', events: [{ type: 'x' }] }),
      })
    );
    assert.equal(response.status, 401);
  });

  it('rejects an oversized payload before treating it as signed', async () => {
    process.env.LINE_CHANNEL_SECRET = SECRET;
    const huge = 'x'.repeat(MAX_LINE_WEBHOOK_BYTES + 1);
    const signature = lineSignatureHeader(huge, SECRET);
    const response = await POST(
      new NextRequest('http://localhost/api/line/webhook', {
        method: 'POST',
        headers: { 'x-line-signature': signature },
        body: huge,
      })
    );
    assert.equal(response.status, 413);
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
    assert.equal(await response.text(), 'Webhook is not configured');
  });

  it('accepts GET for console connectivity checks', async () => {
    const response = await GET();
    assert.equal(response.status, 200);
  });
});
