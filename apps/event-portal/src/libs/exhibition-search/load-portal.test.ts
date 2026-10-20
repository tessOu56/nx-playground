import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { resolvePortalExhibition } from './load-portal';

describe('resolvePortalExhibition', () => {
  it('returns ok for a fixture listing and missing for an unknown id', async () => {
    const previous = process.env.DATABASE_URL;
    process.env.DATABASE_URL = '';
    try {
      const found = await resolvePortalExhibition('event_sample_tfam');
      assert.equal(found.status, 'ok');
      if (found.status === 'ok') {
        assert.equal(found.event.id, 'event_sample_tfam');
      }

      const missing = await resolvePortalExhibition('does-not-exist');
      assert.equal(missing.status, 'missing');
    } finally {
      if (previous === undefined) delete process.env.DATABASE_URL;
      else process.env.DATABASE_URL = previous;
    }
  });
});
