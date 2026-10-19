import { parseExhibitionRegion } from './exhibition-region';

describe('parseExhibitionRegion', () => {
  it('accepts Taipei and Tokyo', () => {
    expect(parseExhibitionRegion('TAIPEI')).toBe('TAIPEI');
    expect(parseExhibitionRegion('tokyo')).toBe('TOKYO');
    expect(parseExhibitionRegion(' Taipei ')).toBe('TAIPEI');
  });

  it('treats empty as no filter', () => {
    expect(parseExhibitionRegion(undefined)).toBeUndefined();
    expect(parseExhibitionRegion('')).toBeUndefined();
    expect(parseExhibitionRegion('  ')).toBeUndefined();
  });

  it('rejects unknown regions', () => {
    expect(parseExhibitionRegion('OSAKA')).toBeNull();
    expect(parseExhibitionRegion('taichung')).toBeNull();
  });
});
