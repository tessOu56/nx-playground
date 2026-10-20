import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { getExhibitionById, searchExhibitions } from './search';

const NOW = new Date('2026-10-19T02:00:00.000Z');

describe('searchExhibitions sample fallback', () => {
  const previous = process.env.DATABASE_URL;

  afterEach(() => {
    if (previous === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previous;
  });

  it('returns ranked sample exhibitions without DATABASE_URL', async () => {
    delete process.env.DATABASE_URL;
    const result = await searchExhibitions({
      keyword: 'design',
      now: NOW,
      limit: 10,
    });
    assert.equal(result.source, 'sample');
    assert.ok(result.items.length >= 1);
    assert.equal(result.items[0].id, 'event_sample_huashan');
    assert.ok(result.items[0].rank > 0);
  });

  it('filters sample data by city', async () => {
    delete process.env.DATABASE_URL;
    const result = await searchExhibitions({
      keyword: '',
      region: 'TOKYO',
      dateMode: 'all',
      now: NOW,
    });
    assert.equal(result.source, 'sample');
    assert.ok(result.items.length >= 2);
    assert.ok(result.items.every(item => item.region === 'TOKYO'));
  });

  it('returns no sample hits for a nonsense keyword', async () => {
    delete process.env.DATABASE_URL;
    const result = await searchExhibitions({
      keyword: 'zzzznotfoundxyz',
      now: NOW,
      limit: 10,
    });
    assert.equal(result.source, 'sample');
    assert.equal(result.items.length, 0);
  });

  it('looks up a sample exhibition by id', async () => {
    delete process.env.DATABASE_URL;
    const found = await getExhibitionById('event_sample_tfam');
    assert.equal(found?.source, 'sample');
    assert.equal(found?.item.title.includes('TFAM'), true);
    assert.equal(await getExhibitionById('missing-id'), null);
  });
});
