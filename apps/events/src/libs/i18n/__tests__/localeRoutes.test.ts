import {
  withLocale,
  withoutLocale,
  hasLocale,
  extractLocale,
} from '../localeRoutes';

describe('localeRoutes', () => {
  describe('withLocale', () => {
    it('should add locale prefix to path', () => {
      expect(withLocale('/events', 'zh-TW')).toBe('/zh-TW/events');
      expect(withLocale('/orders', 'en')).toBe('/en/orders');
    });

    it('should use default locale when not provided', () => {
      expect(withLocale('/events')).toBe('/zh-TW/events');
    });

    it('should not add locale if already present', () => {
      expect(withLocale('/zh-TW/events', 'en')).toBe('/zh-TW/events');
      expect(withLocale('/en/orders', 'zh-TW')).toBe('/en/orders');
    });

    it('should handle root path', () => {
      expect(withLocale('/', 'zh-TW')).toBe('/zh-TW/');
    });
  });

  describe('withoutLocale', () => {
    it('should remove locale prefix', () => {
      expect(withoutLocale('/zh-TW/events')).toBe('/events');
      expect(withoutLocale('/en/orders')).toBe('/orders');
    });

    it('should return original path if no locale', () => {
      expect(withoutLocale('/events')).toBe('/events');
    });
  });

  describe('hasLocale', () => {
    it('should detect locale in path', () => {
      expect(hasLocale('/zh-TW/events')).toBe(true);
      expect(hasLocale('/en/orders')).toBe(true);
    });

    it('should return false for paths without locale', () => {
      expect(hasLocale('/events')).toBe(false);
      expect(hasLocale('/orders')).toBe(false);
    });
  });

  describe('extractLocale', () => {
    it('should extract locale from path', () => {
      expect(extractLocale('/zh-TW/events')).toBe('zh-TW');
      expect(extractLocale('/en/orders')).toBe('en');
    });

    it('should return null for paths without locale', () => {
      expect(extractLocale('/events')).toBe(null);
      expect(extractLocale('/orders')).toBe(null);
    });
  });
});
