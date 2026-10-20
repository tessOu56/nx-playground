import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { GET, POST } from './route';

describe('/api/cron/weekly-digest', () => {
  const env = { ...process.env };

  afterEach(() => {
    process.env = { ...env };
  });

  it('rejects missing or wrong CRON_SECRET', async () => {
    delete process.env.CRON_SECRET;
    const missing = await GET(new Request('http://localhost/api/cron/weekly-digest'));
    assert.equal(missing.status, 401);

    process.env.CRON_SECRET = 'expected-secret';
    const wrong = await GET(
      new Request('http://localhost/api/cron/weekly-digest', {
        headers: { authorization: 'Bearer other-secret' },
      })
    );
    assert.equal(wrong.status, 401);
  });

  it('runs the digest and no-ops Discord when the webhook is unset', async () => {
    process.env.CRON_SECRET = 'expected-secret';
    delete process.env.DISCORD_WEBHOOK_URL;
    delete process.env.DATABASE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = 'https://nx-event-portal.vercel.app';

    const response = await POST(
      new Request('http://localhost/api/cron/weekly-digest', {
        method: 'POST',
        headers: { authorization: 'Bearer expected-secret' },
      })
    );
    assert.equal(response.status, 200);
    const body = (await response.json()) as {
      ok: boolean;
      source: string;
      locales: string[];
      publishes: Array<{ publisher: string; status: string; reason?: string }>;
    };
    assert.equal(body.ok, true);
    assert.equal(body.source, 'sample');
    assert.deepEqual(body.locales, ['zh', 'ja', 'en']);
    assert.equal(body.publishes[0]?.publisher, 'discord');
    assert.equal(body.publishes[0]?.status, 'skipped');
    assert.equal(body.publishes[0]?.reason, 'webhook-unset');
    const raw = JSON.stringify(body);
    assert.ok(!raw.includes('DISCORD_WEBHOOK_URL'));
    assert.ok(!/discord\.com\/api\/webhooks/i.test(raw));
  });
});
