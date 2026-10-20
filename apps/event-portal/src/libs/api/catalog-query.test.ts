import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  catalogEmptyKind,
  catalogHref,
  catalogQueryString,
  parseCatalogQuery,
  parseCityFilter,
  parseDateFilter,
} from './catalog-query';

describe('catalog-query', () => {
  it('parses city, dates, and keyword from search params', () => {
    const query = parseCatalogQuery(
      new URLSearchParams('city=TOKYO&dates=now&q=mori')
    );
    assert.deepEqual(query, {
      q: 'mori',
      city: 'TOKYO',
      dates: 'now',
      category: '',
    });
    assert.equal(parseCityFilter('narnia'), 'all');
    assert.equal(parseDateFilter(['past']), 'past');
    assert.equal(
      parseCatalogQuery({ get: (key: string) => (key === 'city' ? 'TAIPEI' : null) })
        .city,
      'TAIPEI'
    );
  });

  it('serializes only active filters', () => {
    assert.equal(
      catalogQueryString({
        q: '',
        city: 'TAIPEI',
        dates: 'all',
        category: '',
      }),
      'city=TAIPEI'
    );
    assert.equal(catalogHref('zh-TW', { city: 'TOKYO' }), '/zh-TW/events?city=TOKYO');
    assert.equal(catalogHref('en'), '/en/events');
  });

  it('picks empty-state kinds without inventing listings', () => {
    assert.equal(
      catalogEmptyKind({
        total: 0,
        filtered: 0,
        query: { q: '', city: 'all', dates: 'all', category: '' },
      }),
      'catalog'
    );
    assert.equal(
      catalogEmptyKind({
        total: 4,
        filtered: 0,
        query: { q: '', city: 'TOKYO', dates: 'all', category: '' },
      }),
      'city'
    );
    assert.equal(
      catalogEmptyKind({
        total: 4,
        filtered: 0,
        query: { q: '', city: 'all', dates: 'past', category: '' },
      }),
      'ended'
    );
    assert.equal(
      catalogEmptyKind({
        total: 4,
        filtered: 0,
        query: { q: 'zzz', city: 'TAIPEI', dates: 'all', category: '' },
      }),
      'search'
    );
    assert.equal(
      catalogEmptyKind({
        total: 4,
        filtered: 2,
        query: { q: '', city: 'TOKYO', dates: 'all', category: '' },
      }),
      null
    );
  });
});
