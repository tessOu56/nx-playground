import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isMissingPortalEvent } from './portal-event-error';

describe('isMissingPortalEvent', () => {
  it('treats labelled-demo misses as 404, not API failure', () => {
    assert.equal(
      isMissingPortalEvent(new Error('labelled-demo event missing_id not found')),
      true
    );
    assert.equal(isMissingPortalEvent(new Error('fetch failed')), false);
    assert.equal(isMissingPortalEvent(null), false);
  });
});
