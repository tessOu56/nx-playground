import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  parseJapaneseDateRange,
  parseSlugDateRange,
  parseTokyoDateTime,
} from './tokyo-dates';

describe('parseSlugDateRange', () => {
  it('parses YYYYMMDD-MMDD, YYMMDD-MMDD, and YYMMDD-YYMMDD', () => {
    const marimekko = parseSlugDateRange('20261003-1220_marimekko');
    assert.ok(marimekko);
    assert.equal(marimekko.start.toISOString(), '2026-10-02T15:00:00.000Z');
    assert.equal(marimekko.end.toISOString(), '2026-12-20T14:59:59.999Z');

    const lithuania = parseSlugDateRange('270116-0328_lithuania');
    assert.ok(lithuania);
    assert.equal(lithuania.start.toISOString(), '2027-01-15T15:00:00.000Z');
    assert.equal(lithuania.end.toISOString(), '2027-03-28T14:59:59.999Z');

    const wrap = parseSlugDateRange('250927-260118_timeless-art-deco');
    assert.ok(wrap);
    assert.equal(wrap.start.toISOString(), '2025-09-26T15:00:00.000Z');
    assert.equal(wrap.end.toISOString(), '2026-01-18T14:59:59.999Z');
  });

  it('returns null when the slug has no dates', () => {
    assert.equal(parseSlugDateRange('lucie-rie'), null);
  });
});

describe('parseJapaneseDateRange', () => {
  it('carries the year across ～ ranges', () => {
    const range = parseJapaneseDateRange(
      '開催時期 2026年10月10日（土）～12月20日（日）',
      2026
    );
    assert.ok(range);
    assert.equal(range.start.toISOString(), '2026-10-09T15:00:00.000Z');
    assert.equal(range.end.toISOString(), '2026-12-20T14:59:59.999Z');
  });

  it('treats a single civil date as the whole local day', () => {
    const single = parseJapaneseDateRange('開催時期 2026年11月23日（月・祝）', 2026);
    assert.ok(single);
    assert.equal(single.start.toISOString(), '2026-11-22T15:00:00.000Z');
    assert.equal(single.end.toISOString(), '2026-11-23T14:59:59.999Z');
  });
});

describe('parseTokyoDateTime', () => {
  it('treats date-only end as end of Asia/Tokyo day', () => {
    const end = parseTokyoDateTime('2026/12/31', true);
    assert.ok(end);
    assert.equal(end.toISOString(), '2026-12-31T14:59:59.999Z');
    assert.equal(parseTokyoDateTime('bogus'), null);
  });
});
