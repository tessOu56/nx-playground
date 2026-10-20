import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { hasKeywordMatch, rankDocuments, scoreDocument } from './rank';
import { sampleDocuments } from './sample';
import type { ExhibitionDocument } from './types';

const NOW = new Date('2026-10-19T02:00:00.000Z');

function listing(
  partial: Partial<ExhibitionDocument> &
    Pick<ExhibitionDocument, 'id' | 'title'>
): ExhibitionDocument {
  return {
    description: null,
    location: '台北市',
    startDate: new Date('2026-10-04T01:00:00.000Z'),
    endDate: new Date('2026-12-27T10:00:00.000Z'),
    timezone: 'Asia/Taipei',
    priceText: null,
    region: 'TAIPEI',
    sourceUrl: null,
    source: 'sample',
    tags: [],
    imageUrl: null,
    category: '展覽',
    organizerName: null,
    venueHint: null,
    status: 'published',
    sample: true,
    ...partial,
  };
}

describe('scoreDocument / rankDocuments', () => {
  it('ranks an exact title above a partial match', () => {
    const exact = listing({ id: 'exact', title: '攝影' });
    const partial = listing({ id: 'partial', title: '當代攝影紀實' });
    const other = listing({ id: 'other', title: '設計展' });
    const ranked = rankDocuments([partial, other, exact], {
      keyword: '攝影',
      now: NOW,
    });
    assert.equal(ranked[0].id, 'exact');
    assert.ok(ranked[0].rank > ranked[1].rank);
    assert.equal(
      ranked.some(item => item.id === 'other'),
      false
    );
  });

  it('matches CJK bigrams in title and latin tags', () => {
    const photo = listing({
      id: 'photo',
      title: '臺北攝影雙年展',
      tags: ['photography'],
    });
    const design = listing({
      id: 'design',
      title: 'Graphic Design',
      tags: ['design'],
    });
    assert.ok(scoreDocument(photo, '攝影') > scoreDocument(design, '攝影'));
    assert.ok(scoreDocument(design, 'design') > scoreDocument(photo, 'design'));
  });

  it('applies region and date filters before ranking', () => {
    const docs = [
      listing({
        id: 'tokyo-now',
        title: 'NACT',
        region: 'TOKYO',
        startDate: new Date('2026-10-01T00:00:00.000Z'),
        endDate: new Date('2026-12-01T00:00:00.000Z'),
      }),
      listing({
        id: 'taipei-past',
        title: 'TFAM',
        region: 'TAIPEI',
        startDate: new Date('2026-01-01T00:00:00.000Z'),
        endDate: new Date('2026-02-01T00:00:00.000Z'),
      }),
    ];
    const tokyo = rankDocuments(docs, {
      keyword: '',
      region: 'TOKYO',
      dateMode: 'now',
      now: NOW,
    });
    assert.deepEqual(
      tokyo.map(item => item.id),
      ['tokyo-now']
    );
  });

  it('ranks sample fixtures: design above unrelated art for "design"', () => {
    const ranked = rankDocuments(sampleDocuments(), {
      keyword: 'design',
      now: NOW,
      limit: 10,
    });
    assert.ok(ranked.length > 0);
    assert.equal(ranked[0].id, 'event_sample_huashan');
    assert.ok(ranked[0].rank >= (ranked[1]?.rank ?? 0));
  });

  it('does not keep unrelated listings for a nonsense keyword', () => {
    const ranked = rankDocuments(sampleDocuments(), {
      keyword: 'zzzznotfoundxyz',
      now: NOW,
      limit: 10,
    });
    assert.deepEqual(
      ranked.map(item => item.id),
      []
    );
    const tfam = sampleDocuments().find(
      item => item.id === 'event_sample_tfam'
    );
    assert.ok(tfam);
    assert.equal(hasKeywordMatch(tfam, 'zzzznotfoundxyz'), false);
    assert.equal(hasKeywordMatch(tfam, 'tfam'), true);
  });
});
