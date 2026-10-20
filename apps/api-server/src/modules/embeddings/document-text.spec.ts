import {
  exhibitionEmbeddingContentHash,
  exhibitionEmbeddingText,
} from './document-text';
import { hybridScore, toVectorLiteral } from './vector';

describe('exhibitionEmbeddingText', () => {
  it('joins title, venue, tags, and summary without HTML noise', () => {
    const text = exhibitionEmbeddingText({
      id: 'evt',
      title: '臺北攝影雙年展',
      location: '臺北市立美術館',
      tags: ['photography', 'taipei'],
      priceText: '免費',
      description: '紀實與當代影像',
    });
    expect(text).toContain('臺北攝影雙年展');
    expect(text).toContain('臺北市立美術館');
    expect(text).toContain('photography');
    expect(text).toContain('紀實與當代影像');
  });

  it('reuses collector contentHash when present', () => {
    expect(
      exhibitionEmbeddingContentHash({
        id: 'evt',
        title: 'A',
        contentHash: 'abc123',
      })
    ).toBe('abc123');
    expect(exhibitionEmbeddingContentHash({ id: 'evt', title: 'A' })).toMatch(
      /^[a-f0-9]{64}$/
    );
  });
});

describe('vector helpers', () => {
  it('formats a pgvector literal and rejects non-finite values', () => {
    expect(toVectorLiteral([0.1, -2, 3])).toBe('[0.1,-2,3]');
    expect(toVectorLiteral([1.234567891])).toBe('[1.23456789]');
    expect(() => toVectorLiteral([])).toThrow(/empty/);
    expect(() => toVectorLiteral([Number.NaN])).toThrow(/non-finite/);
  });

  it('hybrid-ranks FTS above a weak semantic-only hit', () => {
    const lexical = hybridScore(0.8, 0.2);
    const semanticOnly = hybridScore(0, 0.9);
    expect(lexical).toBeCloseTo(0.7 * 0.8 + 0.3 * 0.2);
    expect(semanticOnly).toBeCloseTo(0.27);
    expect(hybridScore(0.5, null)).toBe(0.5);
  });
});
