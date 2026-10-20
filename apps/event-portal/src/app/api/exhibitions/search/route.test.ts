import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { GET } from './route';

describe('GET /api/exhibitions/search', () => {
  const previous = process.env.DATABASE_URL;

  afterEach(() => {
    if (previous === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previous;
  });

  it('returns sample hits for a keyword when DATABASE_URL is unset', async () => {
    delete process.env.DATABASE_URL;
    const response = await GET(
      new Request('http://localhost/api/exhibitions/search?q=design&city=TAIPEI')
    );
    assert.equal(response.status, 200);
    const body = (await response.json()) as {
      source: string;
      items: Array<{ id: string; rank: number }>;
    };
    assert.equal(body.source, 'sample');
    assert.equal(body.items[0]?.id, 'event_sample_huashan');
    assert.ok((body.items[0]?.rank ?? 0) > 0);
  });
});
