import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { assertAllowlistedHttpsUrl } from '../shared/ssrf';

import {
  TOKYO_OPENDATA_CSV,
  TOKYO_OPENDATA_HOST,
  fetchTokyoOpendataCsv,
  normalizeTokyoOpendataCsv,
} from './opendata';

const csv = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    'fixtures/tokyo-opendata-events.csv'
  ),
  'utf8'
);
const NOW = new Date('2026-10-20T00:00:00.000Z');

describe('Tokyo open data events CSV', () => {
  it('allowlists the published CSV host', () => {
    assert.equal(
      assertAllowlistedHttpsUrl(
        TOKYO_OPENDATA_CSV,
        new Set([TOKYO_OPENDATA_HOST])
      ),
      TOKYO_OPENDATA_CSV
    );
  });

  it('keeps current exhibition rows and ja/en titles', () => {
    const { events, fetched } = normalizeTokyoOpendataCsv(csv, NOW);
    assert.equal(fetched, 3);
    assert.equal(events.length, 1);
    assert.equal(events[0].externalId, '20261001');
    assert.equal(events[0].source, 'tokyo-opendata-event');
    assert.equal(events[0].data.i18n.title.ja, '都立文化施設企画展 記録');
    assert.equal(events[0].data.i18n.title.en, 'Metropolitan Museums Exhibition');
    assert.equal(events[0].startDate.toISOString(), '2026-09-30T15:00:00.000Z');
  });

  it('does not fetch off-allowlist URLs', async () => {
    await assert.rejects(
      () =>
        fetchTokyoOpendataCsv(async () => {
          throw new Error('must not fetch');
        }),
      /must not fetch|Tokyo open data events CSV HTTP/
    );
  });
});
