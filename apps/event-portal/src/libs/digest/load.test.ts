import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { loadDigestCatalog, loadDigestExhibitionsSql } from './load';

const NOW = new Date('2026-10-20T01:00:00.000Z');

describe('loadDigestCatalog', () => {
  it('uses sample fixtures when DATABASE_URL is unset', async () => {
    const catalog = await loadDigestCatalog(NOW, '');
    assert.equal(catalog.source, 'sample');
    assert.ok(catalog.items.length > 0);
  });
});

describe('loadDigestExhibitionsSql', () => {
  it('maps published city rows and drops invalid ones', async () => {
    const items = await loadDigestExhibitionsSql(NOW, async () => [
      {
        id: 'ok-taipei',
        title: 'Taipei show',
        location: 'Taipei',
        startDate: '2026-10-22T02:00:00.000Z',
        endDate: '2026-11-01T02:00:00.000Z',
        region: 'TAIPEI',
        createdAt: '2026-10-18T00:00:00.000Z',
      },
      {
        id: 'skip-city',
        title: 'Osaka',
        startDate: '2026-10-22T02:00:00.000Z',
        endDate: '2026-11-01T02:00:00.000Z',
        region: 'OSAKA',
        createdAt: '2026-10-18T00:00:00.000Z',
      },
      {
        id: '',
        title: 'missing id',
        startDate: '2026-10-22T02:00:00.000Z',
        endDate: '2026-11-01T02:00:00.000Z',
        region: 'TOKYO',
      },
    ]);
    assert.deepEqual(
      items.map(item => item.id),
      ['ok-taipei']
    );
    assert.equal(items[0]?.city, 'TAIPEI');
  });
});
