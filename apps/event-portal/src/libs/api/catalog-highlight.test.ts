import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { highlightSegments } from './catalog-highlight';

describe('highlightSegments', () => {
  it('returns the original text when the query is empty', () => {
    assert.deepEqual(highlightSegments('Mori Art Museum', ''), [
      { text: 'Mori Art Museum', match: false },
    ]);
  });

  it('marks case-insensitive latin and CJK matches without using HTML', () => {
    assert.deepEqual(highlightSegments('[Sample] Mori Art Museum', 'mori'), [
      { text: '[Sample] ', match: false },
      { text: 'Mori', match: true },
      { text: ' Art Museum', match: false },
    ]);
    assert.deepEqual(highlightSegments('台北市立美術館', '台北'), [
      { text: '台北', match: true },
      { text: '市立美術館', match: false },
    ]);
  });

  it('treats regex metacharacters as literals', () => {
    assert.deepEqual(highlightSegments('100% off', '100%'), [
      { text: '100%', match: true },
      { text: ' off', match: false },
    ]);
  });
});
