import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { assertAllowlistedHttpsUrl } from '../shared/ssrf';

import {
  ARTS_COUNCIL_FEED,
  ARTS_COUNCIL_HOST,
  fetchArtsCouncilFeed,
  normalizeArtsCouncilRss,
} from './arts-council';
import { CCBT_FEED, CCBT_HOST, fetchCcbtFeed, normalizeCcbtRss } from './ccbt';

const dir = dirname(fileURLToPath(import.meta.url));
const artsFeed = readFileSync(join(dir, 'fixtures/arts-council-festivals.rss'), 'utf8');
const ccbtFeed = readFileSync(join(dir, 'fixtures/ccbt-events.rss'), 'utf8');
const NOW = new Date('2026-10-20T00:00:00.000Z');

describe('Arts Council Tokyo RSS', () => {
  it('pins the festivals feed host', () => {
    assert.equal(
      assertAllowlistedHttpsUrl(ARTS_COUNCIL_FEED, new Set([ARTS_COUNCIL_HOST])),
      ARTS_COUNCIL_FEED
    );
  });

  it('keeps exhibition-like items with parsed JST dates', () => {
    const { events, fetched } = normalizeArtsCouncilRss(artsFeed, NOW);
    assert.equal(fetched, 3);
    assert.equal(events.length, 1);
    assert.equal(events[0].externalId, '30131');
    assert.equal(events[0].source, 'arts-council-tokyo');
    assert.match(events[0].title, /ファンタジスタ/);
    assert.match(events[0].location, /テレコムセンタービル/);
    assert.equal(events[0].startDate.toISOString(), '2026-10-09T15:00:00.000Z');
    assert.equal(events[0].endDate.toISOString(), '2026-12-20T14:59:59.999Z');
    assert.equal(events[0].data.i18n.title.ja, events[0].title);
  });

  it('does not fetch off-allowlist URLs', async () => {
    await assert.rejects(
      () =>
        fetchArtsCouncilFeed(async url => {
          assert.match(url, /artscouncil-tokyo\.jp/);
          throw new Error('must not fetch');
        }),
      /must not fetch|Arts Council Tokyo RSS HTTP/
    );
  });
});

describe('CCBT events RSS', () => {
  it('uses the non-redirecting feed URL', () => {
    assert.equal(
      assertAllowlistedHttpsUrl(CCBT_FEED, new Set([CCBT_HOST])),
      CCBT_FEED
    );
    assert.equal(CCBT_FEED.endsWith('/'), false);
  });

  it('keeps exhibition items and drops conferences', () => {
    const duringShow = new Date('2026-07-15T00:00:00.000Z');
    const { events, fetched } = normalizeCcbtRss(ccbtFeed, duringShow);
    assert.equal(fetched, 2);
    assert.equal(events.length, 1);
    assert.equal(events[0].externalId, 'open-studio-exhibition-2026');
    assert.equal(events[0].startDate.toISOString(), '2026-06-26T15:00:00.000Z');
    assert.equal(events[0].endDate.toISOString(), '2026-08-02T14:59:59.999Z');
    assert.equal(normalizeCcbtRss(ccbtFeed, NOW).events.length, 0);
  });

  it('does not follow redirects (fetch impl never sees a 301 hop)', async () => {
    await assert.rejects(
      () =>
        fetchCcbtFeed(async (url, init) => {
          assert.equal(url, CCBT_FEED);
          assert.equal((init as RequestInit | undefined)?.redirect, 'error');
          throw new Error('must not fetch');
        }),
      /must not fetch|CCBT events RSS HTTP/
    );
  });
});
