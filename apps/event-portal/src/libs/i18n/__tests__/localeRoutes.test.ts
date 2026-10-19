import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

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
      assert.equal(withLocale('/events', 'zh-TW'), '/zh-TW/events');
      assert.equal(withLocale('/orders', 'en'), '/en/orders');
    });

    it('should use default locale when not provided', () => {
      assert.equal(withLocale('/events'), '/zh-TW/events');
    });

    it('should not add locale if already present', () => {
      assert.equal(withLocale('/zh-TW/events', 'en'), '/zh-TW/events');
      assert.equal(withLocale('/en/orders', 'zh-TW'), '/en/orders');
    });

    it('should handle root path', () => {
      assert.equal(withLocale('/', 'zh-TW'), '/zh-TW/');
    });
  });

  describe('withoutLocale', () => {
    it('should remove locale prefix', () => {
      assert.equal(withoutLocale('/zh-TW/events'), '/events');
      assert.equal(withoutLocale('/en/orders'), '/orders');
    });

    it('should return original path if no locale', () => {
      assert.equal(withoutLocale('/events'), '/events');
    });

    it('should treat a locale-only path as home', () => {
      assert.equal(withoutLocale('/zh-TW'), '/');
      assert.equal(withoutLocale('/en'), '/');
    });
  });

  describe('hasLocale', () => {
    it('should detect locale in path', () => {
      assert.equal(hasLocale('/zh-TW/events'), true);
      assert.equal(hasLocale('/en/orders'), true);
    });

    it('should return false for paths without locale', () => {
      assert.equal(hasLocale('/events'), false);
      assert.equal(hasLocale('/orders'), false);
    });

    it('should detect locale-only paths', () => {
      assert.equal(hasLocale('/zh-TW'), true);
      assert.equal(hasLocale('/en'), true);
    });
  });

  describe('extractLocale', () => {
    it('should extract locale from path', () => {
      assert.equal(extractLocale('/zh-TW/events'), 'zh-TW');
      assert.equal(extractLocale('/en/orders'), 'en');
    });

    it('should return null for paths without locale', () => {
      assert.equal(extractLocale('/events'), null);
      assert.equal(extractLocale('/orders'), null);
    });

    it('should extract locale from locale-only paths', () => {
      assert.equal(extractLocale('/zh-TW'), 'zh-TW');
      assert.equal(extractLocale('/en'), 'en');
    });
  });

  describe('replaceLocale', () => {
    it('should swap locale and keep the rest of the path', () => {
      assert.equal(replaceLocale('/zh-TW/events', 'en'), '/en/events');
      assert.equal(
        replaceLocale('/en/events/event_react19', 'zh-TW'),
        '/zh-TW/events/event_react19'
      );
    });

    it('should keep query-free home on locale-only paths', () => {
      assert.equal(replaceLocale('/zh-TW', 'en'), '/en');
      assert.equal(replaceLocale('/en', 'zh-TW'), '/zh-TW');
    });
  });
});
