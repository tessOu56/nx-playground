import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { SUPPORTED_LOCALES } from '../constants/i18n';

import {
  extractLocale,
  hasLocale,
  withLocale,
  withoutLocale,
} from './localeRoutes';

describe('ja locale routes', () => {
  it('includes ja in the portal locale list', () => {
    assert.deepEqual([...SUPPORTED_LOCALES], ['zh-TW', 'en', 'ja']);
  });

  it('prefixes, detects, and strips ja paths', () => {
    assert.equal(withLocale('/events', 'ja'), '/ja/events');
    assert.equal(hasLocale('/ja/events'), true);
    assert.equal(extractLocale('/ja/events'), 'ja');
    assert.equal(withoutLocale('/ja/events'), '/events');
  });
});
