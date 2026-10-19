import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  SUMMARY_MAX_CHARS,
  httpsImageUrl,
  isTaipeiCity,
  normalizeMocRecord,
  normalizeMocRecords,
  parseTaipeiDateTime,
} from './normalize';

const fixturePath = join(
  dirname(fileURLToPath(import.meta.url)),
  'fixtures/moc-opendata-sample.json'
);
const fixture = JSON.parse(readFileSync(fixturePath, 'utf8')) as unknown[];
const NOW = new Date('2026-10-19T02:00:00.000Z');

describe('isTaipeiCity', () => {
  it('keeps Taipei City and excludes New Taipei and Taichung', () => {
    assert.equal(isTaipeiCity('臺北市南港區忠孝東路七段99號'), true);
    assert.equal(isTaipeiCity('台北市中正區忠孝西路一段70號'), true);
    assert.equal(isTaipeiCity('Taipei City'), true);
    assert.equal(isTaipeiCity('新北市板橋區文化路一段266號'), false);
    assert.equal(isTaipeiCity('臺中市北區館前路一號'), false);
  });
});

describe('normalizeMocRecords', () => {
  it('keeps Taipei City rows and drops others, including malformed JSON', () => {
    const events = normalizeMocRecords(fixture, NOW);
    assert.equal(events.length, 2);
    assert.deepEqual(
      events.map(event => event.externalId).sort(),
      ['6955575326b32416dc3491e4', '6973eb1626b32454e437c40d']
    );
    for (const event of events) {
      assert.equal(event.region, 'TAIPEI');
      assert.equal(event.timezone, 'Asia/Taipei');
      assert.equal(event.source, 'moc-opendata');
      assert.equal(event.id, `moc-${event.externalId}`);
      assert.equal(event.lastSeenAt.toISOString(), NOW.toISOString());
      assert.equal(event.data.summaryOnly, true);
      assert.ok(event.contentHash.length === 64);
    }
  });

  it('stores a short summary plus link, not the full source text', () => {
    const source = fixture.find(
      (row: { UID?: string }) => row.UID === '6973eb1626b32454e437c40d'
    ) as { descriptionFilterHtml: string; sourceWebPromote?: string };
    const event = normalizeMocRecord(source, NOW);
    assert.ok(event);
    assert.ok(event.description.length <= SUMMARY_MAX_CHARS + 80);
    assert.ok(!event.description.includes('用顯微影像、自然主題'));
    assert.match(event.description, /詳情：/);
    assert.ok(event.description.length < source.descriptionFilterHtml.length);
  });

  it('parses Asia/Taipei civil times to UTC and is idempotent on hash', () => {
    const first = normalizeMocRecord(fixture[0], NOW);
    const second = normalizeMocRecord(fixture[0], new Date('2026-10-20T00:00:00.000Z'));
    assert.ok(first);
    assert.ok(second);
    assert.equal(first.contentHash, second.contentHash);
    assert.equal(first.startDate.toISOString(), '2026-01-01T02:00:00.000Z');
    assert.equal(first.endDate.toISOString(), '2030-12-31T09:00:00.000Z');
  });

  it('returns null for missing UID, dates, or non-Taipei venues', () => {
    assert.equal(normalizeMocRecord(fixture[2], NOW), null); // 新北市
    assert.equal(normalizeMocRecord(fixture[3], NOW), null); // 臺中市
    assert.equal(normalizeMocRecord(fixture[4], NOW), null); // malformed
    assert.equal(normalizeMocRecord(fixture[5], NOW), null); // missing dates
    assert.equal(normalizeMocRecord(null, NOW), null);
    assert.equal(normalizeMocRecords({ not: 'an array' }).length, 0);
  });
});

describe('httpsImageUrl', () => {
  it('repairs doubled culture.tw hosts and rejects non-https', () => {
    assert.equal(
      httpsImageUrl(
        'https://cloud.culture.twhttps://cloud.culture.tw/e_new_upload/example.jpg'
      ),
      'https://cloud.culture.tw/e_new_upload/example.jpg'
    );
    assert.equal(httpsImageUrl('http://www.nmns.edu.tw/img.jpg'), undefined);
    assert.equal(httpsImageUrl(''), undefined);
  });

  it('rejects localhost, link-local metadata, and credentialed URLs', () => {
    assert.equal(httpsImageUrl('https://127.0.0.1/img.jpg'), undefined);
    assert.equal(
      httpsImageUrl('https://169.254.169.254/latest/meta-data/'),
      undefined
    );
    assert.equal(
      httpsImageUrl('https://user:pass@cloud.culture.tw/e_new_upload/x.jpg'),
      undefined
    );
    assert.equal(httpsImageUrl('https://localhost/img.jpg'), undefined);
  });
});

describe('parseTaipeiDateTime', () => {
  it('treats date-only end as end of local day', () => {
    const end = parseTaipeiDateTime('2026/11/02', true);
    assert.ok(end);
    assert.equal(end.toISOString(), '2026-11-02T15:59:59.999Z');
    assert.equal(parseTaipeiDateTime('bogus'), null);
  });
});
