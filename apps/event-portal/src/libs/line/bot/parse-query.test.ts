import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { parseCatalogQuery } from './parse-query';

/** Monday 19 Oct 2026 10:00 Asia/Taipei = 02:00Z; 11:00 Asia/Tokyo. */
const NOW = new Date('2026-10-19T02:00:00.000Z');

describe('parseCatalogQuery', () => {
  it('parses zh-TW region + this week and leftover keywords', () => {
    const parsed = parseCatalogQuery('台北 本週 攝影', NOW);
    assert.equal(parsed.help, false);
    assert.equal(parsed.region, 'TAIPEI');
    assert.equal(parsed.timeWindow, 'this_week');
    assert.equal(parsed.keyword, '攝影');
    assert.equal(parsed.locale, 'zh-TW');
    const window = parsed.windows.TAIPEI;
    assert.ok(window);
    assert.equal(window.start.toISOString(), '2026-10-18T16:00:00.000Z');
    assert.equal(window.end.toISOString(), '2026-10-25T15:59:59.999Z');
  });

  it('accepts 臺北 as Taipei', () => {
    assert.equal(parseCatalogQuery('臺北 今天', NOW).region, 'TAIPEI');
  });

  it('parses Japanese 東京 週末 in Asia/Tokyo', () => {
    const parsed = parseCatalogQuery('東京 週末', NOW);
    assert.equal(parsed.region, 'TOKYO');
    assert.equal(parsed.timeWindow, 'weekend');
    assert.equal(parsed.keyword, '');
    assert.equal(parsed.locale, 'zh-TW');
    const window = parsed.windows.TOKYO;
    assert.ok(window);
    // Fri 23 Oct 00:00 JST → Thu 22 Oct 15:00Z; Sun 25 Oct 23:59:59.999 JST
    assert.equal(window.start.toISOString(), '2026-10-22T15:00:00.000Z');
    assert.equal(window.end.toISOString(), '2026-10-25T14:59:59.999Z');
  });

  it('parses English Taipei this week', () => {
    const parsed = parseCatalogQuery('Taipei this week', NOW);
    assert.equal(parsed.region, 'TAIPEI');
    assert.equal(parsed.timeWindow, 'this_week');
    assert.equal(parsed.locale, 'en');
  });

  it('parses today / 今日 / weekend phrases', () => {
    assert.equal(parseCatalogQuery('today', NOW).timeWindow, 'today');
    assert.equal(parseCatalogQuery('今日 東京', NOW).timeWindow, 'today');
    assert.equal(parseCatalogQuery('this weekend', NOW).timeWindow, 'weekend');
    assert.equal(parseCatalogQuery('台北 這週末', NOW).timeWindow, 'weekend');
    assert.equal(parseCatalogQuery('今月', NOW).timeWindow, 'this_month');
    assert.equal(parseCatalogQuery('本月', NOW).timeWindow, 'this_month');
    assert.equal(parseCatalogQuery('東京 今週', NOW).locale, 'ja');
  });

  it('resolves 本月 in each named region timezone', () => {
    const taipei = parseCatalogQuery('台北 本月', NOW).windows.TAIPEI;
    const tokyo = parseCatalogQuery('東京 今月', NOW).windows.TOKYO;
    assert.ok(taipei);
    assert.ok(tokyo);
    assert.equal(taipei.start.toISOString(), '2026-09-30T16:00:00.000Z');
    assert.equal(tokyo.start.toISOString(), '2026-09-30T15:00:00.000Z');
  });

  it('treats help / 說明 / 使い方 as help, not keywords', () => {
    assert.equal(parseCatalogQuery('help').help, true);
    assert.equal(parseCatalogQuery('說明').help, true);
    assert.equal(parseCatalogQuery('使い方').help, true);
    assert.equal(parseCatalogQuery('使い方').locale, 'ja');
    assert.equal(parseCatalogQuery('說明').keyword, '');
  });

  it('keeps free-text keywords after stripping region and window', () => {
    const parsed = parseCatalogQuery('Tokyo photography', NOW);
    assert.equal(parsed.region, 'TOKYO');
    assert.equal(parsed.keyword, 'photography');
    assert.equal(parsed.locale, 'en');
  });

  it('searches both regions when none is named', () => {
    const parsed = parseCatalogQuery('本週 設計', NOW);
    assert.equal(parsed.region, undefined);
    assert.ok(parsed.windows.TAIPEI);
    assert.ok(parsed.windows.TOKYO);
    assert.equal(parsed.keyword, '設計');
  });
});
