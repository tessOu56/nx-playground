import {
  withLocale,
  withoutLocale,
  hasLocale,
  extractLocale,
  replaceLocale,
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

    it('should treat a locale-only path as home', () => {
      expect(withoutLocale('/zh-TW')).toBe('/');
      expect(withoutLocale('/en')).toBe('/');
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

    it('should detect locale-only paths', () => {
      expect(hasLocale('/zh-TW')).toBe(true);
      expect(hasLocale('/en')).toBe(true);
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

    it('should extract locale from locale-only paths', () => {
      expect(extractLocale('/zh-TW')).toBe('zh-TW');
      expect(extractLocale('/en')).toBe('en');
    });
  });

  describe('replaceLocale', () => {
    it('should swap locale and keep the rest of the path', () => {
      expect(replaceLocale('/zh-TW/events', 'en')).toBe('/en/events');
      expect(replaceLocale('/en/events/event_react19', 'zh-TW')).toBe(
        '/zh-TW/events/event_react19'
      );
    });

    it('should keep query-free home on locale-only paths', () => {
      expect(replaceLocale('/zh-TW', 'en')).toBe('/en');
      expect(replaceLocale('/en', 'zh-TW')).toBe('/zh-TW');
    });
  });
});
