import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  diceCoefficient,
  exhibitionSearchTokens,
  escapeIlike,
} from './tokenize';

describe('exhibitionSearchTokens', () => {
  it('emits CJK unigrams and bigrams plus latin words', () => {
    assert.deepEqual(exhibitionSearchTokens('攝影'), ['攝', '攝影', '影']);
    assert.deepEqual(exhibitionSearchTokens('台北 設計'), [
      '台',
      '台北',
      '北',
      '設',
      '設計',
      '計',
    ]);
    assert.ok(exhibitionSearchTokens('Tokyo photography').includes('tokyo'));
    assert.ok(exhibitionSearchTokens('Tokyo photography').includes('photography'));
  });

  it('normalizes NFKC and ignores punctuation', () => {
    const tokens = exhibitionSearchTokens('ＴＦＡＭ 藝術!');
    assert.ok(tokens.includes('tfam'));
    assert.ok(tokens.includes('藝術'));
  });
});

describe('diceCoefficient', () => {
  it('scores identical strings as 1 and overlapping bigrams above 0', () => {
    assert.equal(diceCoefficient('mori', 'mori'), 1);
    assert.ok(diceCoefficient('mori', 'moris') > 0.5);
    assert.equal(diceCoefficient('', 'x'), 0);
  });
});

describe('escapeIlike', () => {
  it('strips LIKE wildcards from user input', () => {
    assert.equal(escapeIlike('100%_off'), '100\\%\\_off');
  });
});
