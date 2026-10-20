import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getExhibitionSqlById, mapExhibitionRow } from './sql';

describe('mapExhibitionRow', () => {
  it('drops non-public source and image URLs', () => {
    const mapped = mapExhibitionRow({
      id: 'evt_1',
      title: 'Draft-looking',
      description: 'x',
      location: '台北',
      startDate: new Date('2026-10-04T01:00:00.000Z'),
      endDate: new Date('2026-12-27T10:00:00.000Z'),
      status: 'published',
      sourceUrl: 'javascript:alert(1)',
      data: { image: 'http://127.0.0.1/ssrf.png', kind: 'exhibition' },
    });
    assert.equal(mapped.sourceUrl, null);
    assert.equal(mapped.imageUrl, null);
  });
});

describe('getExhibitionSqlById', () => {
  it('requires published status and caps the id', async () => {
    let sqlText = '';
    let values: unknown[] = [];
    const fakeSql = (
      strings: TemplateStringsArray,
      ...params: unknown[]
    ) => {
      sqlText = strings.join('?');
      values = params;
      return Promise.resolve([]);
    };

    await getExhibitionSqlById(`evt_ok${'x'.repeat(200)}`, fakeSql);
    assert.match(sqlText, /status = 'published'/);
    assert.equal(typeof values[0], 'string');
    assert.equal((values[0] as string).length, 128);

    const missing = await getExhibitionSqlById('   ', fakeSql);
    assert.equal(missing, null);
  });
});
