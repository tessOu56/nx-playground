import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { filterCatalog, uniqueCategories } from './catalog-filters';
import type { Event } from '../../types';

function listing(partial: Partial<Event> & Pick<Event, 'id' | 'title'>): Event {
  return {
    vendorId: 'vendor-stack',
    description: '',
    date: '2026-10-19',
    location: '台北',
    price: 0,
    image: '',
    likes: 0,
    attendees: 0,
    capacity: 0,
    category: '展覽',
    tags: [],
    status: 'ongoing',
    sessions: [],
    ...partial,
  };
}

describe('catalog-filters', () => {
  const now = new Date('2026-10-19T04:00:00.000Z');
  const listings = [
    listing({
      id: 'tfam',
      title: 'TFAM',
      region: 'TAIPEI',
      category: '展覽',
      status: 'ongoing',
      date: '2026-10-04',
      endsAt: '2026-12-27T10:00:00.000Z',
    }),
    listing({
      id: 'nact',
      title: 'NACT Tokyo',
      region: 'TOKYO',
      category: '展覧会',
      status: 'upcoming',
      date: '2026-10-22',
      endsAt: '2027-01-12T10:00:00.000Z',
    }),
    listing({
      id: 'summer',
      title: '夏日開源小聚',
      region: 'TAIPEI',
      category: '社群',
      status: 'completed',
      date: '2026-07-12',
      endsAt: '2026-07-13T10:00:00.000Z',
    }),
  ];

  it('filters by city, category, and keyword', () => {
    assert.equal(
      filterCatalog(listings, {
        query: 'tokyo',
        city: 'all',
        dates: 'all',
        category: '',
        now,
      }).map(event => event.id).join(','),
      'nact'
    );
    assert.equal(
      filterCatalog(listings, {
        query: '',
        city: 'TAIPEI',
        dates: 'all',
        category: '',
        now,
      }).length,
      2
    );
    assert.deepEqual(uniqueCategories(listings), ['展覧会', '展覽', '社群']);
  });

  it('filters by date window without inventing listings', () => {
    assert.deepEqual(
      filterCatalog(listings, {
        query: '',
        city: 'all',
        dates: 'now',
        category: '',
        now,
      }).map(event => event.id),
      ['tfam']
    );
    assert.deepEqual(
      filterCatalog(listings, {
        query: '',
        city: 'all',
        dates: 'past',
        category: '',
        now,
      }).map(event => event.id),
      ['summer']
    );
  });
});
