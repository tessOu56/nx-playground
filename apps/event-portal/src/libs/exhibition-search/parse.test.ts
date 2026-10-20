import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { parseCatalogQuery as parseCatalogUrlQuery } from '../api/catalog-query';

import {
  exhibitionSearchFromCatalog,
  exhibitionSearchFromLineText,
  parseExhibitionSearchParams,
} from './parse';

const NOW = new Date('2026-10-19T02:00:00.000Z');

describe('exhibitionSearchFromLineText', () => {
  it('parses city, date window, and leftover keyword', () => {
    const parsed = exhibitionSearchFromLineText('台北 本週 攝影', NOW, 10);
    assert.equal(parsed.region, 'TAIPEI');
    assert.equal(parsed.keyword, '攝影');
    assert.equal(parsed.dateMode, 'window');
    assert.ok(parsed.windows?.TAIPEI);
    assert.equal(
      parsed.windows?.TAIPEI?.start.toISOString(),
      '2026-10-18T16:00:00.000Z'
    );
  });

  it('parses Tokyo weekend in Asia/Tokyo', () => {
    const parsed = exhibitionSearchFromLineText('東京 週末', NOW);
    assert.equal(parsed.region, 'TOKYO');
    assert.equal(parsed.keyword, '');
    assert.equal(
      parsed.windows?.TOKYO?.start.toISOString(),
      '2026-10-22T15:00:00.000Z'
    );
  });
});

describe('exhibitionSearchFromCatalog', () => {
  it('keeps URL city/dates as structured filters and leftover q as keyword', () => {
    const parsed = exhibitionSearchFromCatalog(
      parseCatalogUrlQuery(new URLSearchParams('city=TOKYO&dates=now&q=mori')),
      NOW
    );
    assert.equal(parsed.region, 'TOKYO');
    assert.equal(parsed.dateMode, 'now');
    assert.equal(parsed.keyword, 'mori');
  });

  it('extracts city from free-text q when the city chip is all', () => {
    const parsed = exhibitionSearchFromCatalog(
      { q: '台北 設計', city: 'all', dates: 'all', category: '' },
      NOW
    );
    assert.equal(parsed.region, 'TAIPEI');
    assert.equal(parsed.keyword, '設計');
    assert.equal(parsed.dateMode, 'all');
  });

  it('applies this-month windows when dates=month', () => {
    const parsed = exhibitionSearchFromCatalog(
      { q: '', city: 'TAIPEI', dates: 'month', category: '' },
      NOW
    );
    assert.equal(parsed.dateMode, 'window');
    assert.equal(
      parsed.windows?.TAIPEI?.start.toISOString(),
      '2026-09-30T16:00:00.000Z'
    );
  });
});

describe('parseExhibitionSearchParams', () => {
  it('accepts region= as an alias of city=', () => {
    const parsed = parseExhibitionSearchParams(
      new URLSearchParams('q=art&region=TAIPEI&limit=5'),
      NOW
    );
    assert.equal(parsed.region, 'TAIPEI');
    assert.equal(parsed.keyword, 'art');
    assert.equal(parsed.limit, 5);
  });

  it('caps free-text q and category length', () => {
    const parsed = parseExhibitionSearchParams(
      new URLSearchParams(`q=${'攝影'.repeat(80)}&category=${'x'.repeat(200)}`),
      NOW
    );
    assert.ok((parsed.keyword.length) <= 80);
    assert.ok((parsed.category ?? '').length <= 80);
  });
});
