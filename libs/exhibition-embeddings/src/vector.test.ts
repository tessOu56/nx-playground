import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { hybridScore, toVectorLiteral } from './vector';

describe('vector helpers', () => {
  it('formats a pgvector literal and rejects non-finite values', () => {
    assert.equal(toVectorLiteral([0.1, -2, 3]), '[0.1,-2,3]');
    assert.equal(toVectorLiteral([1.234567891]), '[1.23456789]');
    assert.throws(() => toVectorLiteral([]), /empty/);
    assert.throws(() => toVectorLiteral([Number.NaN]), /non-finite/);
  });

  it('hybrid-ranks FTS above a weak semantic-only hit', () => {
    const lexical = hybridScore(0.8, 0.2);
    const semanticOnly = hybridScore(0, 0.9);
    assert.equal(lexical, 0.7 * 0.8 + 0.3 * 0.2);
    assert.equal(semanticOnly, 0.27);
    assert.equal(hybridScore(0.5, null), 0.5);
  });
});
