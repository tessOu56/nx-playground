import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { searchCatalog } from './catalog-search';
import { defaultCatalogWindow } from './time-window';

describe('searchCatalog', () => {
  it('maps SQL rows, de-dupes by id, and caps at 10', async () => {
    const sql = (async () =>
      Array.from({ length: 12 }, (_, index) => ({
        id: index < 2 ? 'dup' : `id${index}`,
        title: `Exhibition ${index}`,
        location: '台北市',
        startDate: new Date('2026-10-20T00:00:00.000Z'),
        endDate: new Date('2026-11-01T00:00:00.000Z'),
        timezone: 'Asia/Taipei',
        priceText: '免費',
        region: 'TAIPEI',
        sourceUrl: null,
        tags: ['art'],
        imageUrl: 'https://example.com/a.jpg',
        rank: index === 0 ? 0.9 : 0.2,
      }))) as Parameters<typeof searchCatalog>[1];

    const now = new Date('2026-10-19T02:00:00.000Z');
    const results = await searchCatalog(
      {
        region: 'TAIPEI',
        keyword: '攝影',
        windows: { TAIPEI: defaultCatalogWindow(now) },
        limit: 10,
      },
      sql
    );

    assert.equal(results.length, 10);
    assert.equal(results[0].id, 'dup');
    assert.equal(results[0].rank, 0.9);
    assert.equal(results[0].imageUrl, 'https://example.com/a.jpg');
  });

  it('drops localhost and IP image URLs from Flex cards', async () => {
    const sql = (async () => [
      {
        id: 'evt1',
        title: 'Show',
        location: '台北市',
        startDate: new Date('2026-10-20T00:00:00.000Z'),
        endDate: new Date('2026-11-01T00:00:00.000Z'),
        timezone: 'Asia/Taipei',
        priceText: null,
        region: 'TAIPEI',
        sourceUrl: null,
        tags: [],
        imageUrl: 'https://127.0.0.1/img.jpg',
        rank: 0.5,
      },
    ]) as Parameters<typeof searchCatalog>[1];

    const now = new Date('2026-10-19T02:00:00.000Z');
    const results = await searchCatalog(
      {
        region: 'TAIPEI',
        keyword: '',
        windows: { TAIPEI: defaultCatalogWindow(now) },
      },
      sql
    );
    assert.equal(results[0]?.imageUrl, null);
  });
});
