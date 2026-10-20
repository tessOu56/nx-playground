import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { sampleDigestExhibitions } from './load';
import { digestRunSummary, runWeeklyDigest } from './run';
import type { DigestPublisher, PublishResult } from './types';

const NOW = new Date('2026-10-20T01:00:00.000Z');
const ORIGIN = 'https://nx-event-portal.vercel.app';

describe('sampleDigestExhibitions', () => {
  it('loads only Taipei/Tokyo exhibition fixtures', () => {
    const items = sampleDigestExhibitions();
    assert.ok(items.some(item => item.id === 'event_sample_huashan'));
    assert.ok(items.some(item => item.id === 'event_sample_nact'));
    assert.ok(items.every(item => item.city === 'TAIPEI' || item.city === 'TOKYO'));
    assert.ok(!items.some(item => item.id === 'event_react19'));
  });
});

describe('runWeeklyDigest', () => {
  it('generates locale messages and fans out to publishers', async () => {
    const seen: string[] = [];
    const publisher: DigestPublisher = {
      id: 'discord',
      async publish(messages) {
        seen.push(...messages.map(message => message.locale));
        return { publisher: 'discord', status: 'skipped', reason: 'webhook-unset' };
      },
    };

    const run = await runWeeklyDigest({
      now: NOW,
      origin: ORIGIN,
      exhibitions: sampleDigestExhibitions(),
      publishers: [publisher],
    });

    assert.equal(run.source, 'sample');
    assert.deepEqual(seen, ['zh', 'ja', 'en']);
    assert.equal(run.publishes[0]?.status, 'skipped');
    const summary = digestRunSummary(run);
    assert.equal(summary.source, 'sample');
    assert.ok(summary.cities.TAIPEI);
    assert.ok(summary.cities.TOKYO);
    const raw = JSON.stringify(summary);
    assert.ok(!raw.includes('DISCORD_WEBHOOK_URL'));
    assert.ok(!/discord(?:app)?\.com\/api\/webhooks/i.test(raw));
  });

  it('keeps later publishers isolated when Discord is skipped', async () => {
    const results: PublishResult[] = [];
    const discord: DigestPublisher = {
      id: 'discord',
      async publish() {
        return { publisher: 'discord', status: 'skipped', reason: 'webhook-unset' };
      },
    };
    const threads: DigestPublisher = {
      id: 'threads',
      async publish() {
        return { publisher: 'threads', status: 'skipped', reason: 'not-implemented' };
      },
    };

    const run = await runWeeklyDigest({
      now: NOW,
      origin: ORIGIN,
      exhibitions: [],
      publishers: [discord, threads],
    });
    results.push(...run.publishes);
    assert.deepEqual(
      results.map(result => result.publisher),
      ['discord', 'threads']
    );
  });
});
