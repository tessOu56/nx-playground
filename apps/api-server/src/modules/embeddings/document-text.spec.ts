import {
  exhibitionEmbeddingContentHash,
  exhibitionEmbeddingText,
} from './document-text';

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
