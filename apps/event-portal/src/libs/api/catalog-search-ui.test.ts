import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  catalogSearchErrorFromStatus,
  isAbortError,
  parseRetryAfterSec,
} from './catalog-search-ui';

describe('catalog-search-ui', () => {
  it('maps search API statuses without inventing success', () => {
    assert.equal(catalogSearchErrorFromStatus(200), null);
    assert.equal(catalogSearchErrorFromStatus(429), 'rate-limit');
    assert.equal(catalogSearchErrorFromStatus(414), 'too-long');
    assert.equal(catalogSearchErrorFromStatus(500), 'generic');
    assert.equal(catalogSearchErrorFromStatus(204), null);
  });

  it('detects abort errors and parses retry-after', () => {
    assert.equal(isAbortError(new DOMException('aborted', 'AbortError')), true);
    assert.equal(isAbortError(new Error('network')), false);
    assert.equal(parseRetryAfterSec('12'), 12);
    assert.equal(parseRetryAfterSec('9000'), 120);
    assert.equal(parseRetryAfterSec('nope'), null);
  });
});
