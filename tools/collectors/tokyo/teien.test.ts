import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { assertAllowlistedHttpsUrl } from '../shared/ssrf';

import {
  TEIEN_HOST,
  fetchTeienExhibitions,
  normalizeTeienPayload,
} from './teien';

const fixture = JSON.parse(
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), 'fixtures/teien-wp-sample.json'),
    'utf8'
  )
) as unknown;
const NOW = new Date('2026-10-20T00:00:00.000Z');

describe('Teien allowlist', () => {
  it('accepts the museum host and rejects SSRF targets', () => {
    const allowed = new Set([TEIEN_HOST]);
    assert.equal(
      assertAllowlistedHttpsUrl(
        'https://www.teien-art-museum.ne.jp/wp-json/wp/v2/exhibition',
        allowed
      ),
      'https://www.teien-art-museum.ne.jp/wp-json/wp/v2/exhibition'
    );
    assert.throws(
      () => assertAllowlistedHttpsUrl('https://127.0.0.1/wp-json', allowed),
      /allowlisted/
    );
    assert.throws(
      () =>
        assertAllowlistedHttpsUrl(
          'https://user:pass@www.teien-art-museum.ne.jp/x',
          allowed
        ),
      /credentials/
    );
  });
});

describe('fetchTeienExhibitions', () => {
  it('requests only the allowlisted museum host with redirects disabled', async () => {
    const urls: string[] = [];
    await assert.rejects(
      () =>
        fetchTeienExhibitions(async (url, init) => {
          urls.push(url);
          assert.match(url, /^https:\/\/www\.teien-art-museum\.ne\.jp\//);
          assert.equal((init as RequestInit | undefined)?.redirect, 'error');
          throw new Error('must not fetch');
        }),
      /must not fetch/
    );
    assert.ok(urls.length >= 1);
  });
});

describe('normalizeTeienPayload', () => {
  it('keeps current dated exhibitions and fills ja/en/zh', () => {
    const { events, fetched } = normalizeTeienPayload(fixture, NOW);
    assert.equal(fetched, 4);
    assert.equal(events.length, 2);
    const marimekko = events.find(
      event => event.externalId === '20261003-1220_marimekko'
    );
    assert.ok(marimekko);
    assert.equal(marimekko.region, 'TOKYO');
    assert.equal(marimekko.timezone, 'Asia/Tokyo');
    assert.equal(marimekko.source, 'teien-art-museum');
    assert.equal(marimekko.data.i18n.title.ja, 'マリメッコ展 模様のちから');
    assert.equal(marimekko.data.i18n.title.en, 'Marimekko: The Power of Prints');
    assert.equal(marimekko.data.i18n.title.zh, 'Marimekko展 圖案的力量');
    assert.equal(marimekko.startDate.toISOString(), '2026-10-02T15:00:00.000Z');
    assert.equal(marimekko.endDate.toISOString(), '2026-12-20T14:59:59.999Z');
    assert.equal(marimekko.data.summaryOnly, true);
    assert.match(marimekko.description, /詳細：/);
  });

  it('drops undated slugs and ended shows', () => {
    const { events } = normalizeTeienPayload(fixture, NOW);
    assert.equal(
      events.some(event => event.externalId === 'lucie-rie'),
      false
    );
    assert.equal(
      events.some(event => event.externalId === '240601-0825_yumeji'),
      false
    );
  });

  it('is idempotent on hash when lastSeenAt changes', () => {
    const first = normalizeTeienPayload(fixture, NOW).events[0];
    const second = normalizeTeienPayload(
      fixture,
      new Date('2026-10-21T00:00:00.000Z')
    ).events[0];
    assert.equal(first.contentHash, second.contentHash);
  });
});
