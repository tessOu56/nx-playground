import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { classifyWeeklyDigest, MAX_ITEMS_PER_SECTION } from './classify';
import { formatDigestMessage, listingUrl, renderDigestMessages } from './format';
import { generateWeeklyDigest } from './generate';
import type { DigestExhibition } from './types';
import { digestWindow, WEEK_MS } from './window';

const NOW = new Date('2026-10-20T01:00:00.000Z');
const ORIGIN = 'https://nx-event-portal.vercel.app';

function exhibition(
  partial: Partial<DigestExhibition> & Pick<DigestExhibition, 'id' | 'city'>
): DigestExhibition {
  return {
    title: partial.title ?? partial.id,
    startDate: partial.startDate ?? new Date('2026-10-22T01:00:00.000Z'),
    endDate: partial.endDate ?? new Date('2026-12-01T01:00:00.000Z'),
    createdAt: partial.createdAt ?? new Date('2026-09-01T00:00:00.000Z'),
    location: partial.location ?? 'Museum',
    ...partial,
  };
}

describe('digestWindow', () => {
  it('uses a rolling 7-day upcoming window and 7-day lookback', () => {
    const window = digestWindow(NOW);
    assert.equal(window.weekEnd.getTime() - window.weekStart.getTime(), WEEK_MS);
    assert.equal(
      window.weekStart.getTime() - window.lookbackStart.getTime(),
      WEEK_MS
    );
  });
});

describe('classifyWeeklyDigest', () => {
  it('splits upcoming and newly added exhibitions per city', () => {
    const digest = classifyWeeklyDigest(
      [
        exhibition({
          id: 'taipei-opens',
          city: 'TAIPEI',
          title: 'Taipei opens',
          startDate: new Date('2026-10-23T02:00:00.000Z'),
        }),
        exhibition({
          id: 'taipei-new',
          city: 'TAIPEI',
          title: 'Taipei new',
          startDate: new Date('2026-11-10T02:00:00.000Z'),
          createdAt: new Date('2026-10-18T00:00:00.000Z'),
        }),
        exhibition({
          id: 'tokyo-opens',
          city: 'TOKYO',
          title: 'Tokyo opens',
          startDate: new Date('2026-10-24T01:00:00.000Z'),
        }),
        exhibition({
          id: 'tokyo-old',
          city: 'TOKYO',
          title: 'Tokyo old',
          startDate: new Date('2026-09-01T01:00:00.000Z'),
          createdAt: new Date('2026-08-01T00:00:00.000Z'),
        }),
      ],
      NOW
    );

    const taipei = digest.cities.find(section => section.city === 'TAIPEI');
    const tokyo = digest.cities.find(section => section.city === 'TOKYO');
    assert.deepEqual(
      taipei?.upcoming.map(item => item.id),
      ['taipei-opens']
    );
    assert.deepEqual(
      taipei?.newlyAdded.map(item => item.id),
      ['taipei-new']
    );
    assert.deepEqual(
      tokyo?.upcoming.map(item => item.id),
      ['tokyo-opens']
    );
    assert.deepEqual(tokyo?.newlyAdded.map(item => item.id), []);
  });

  it('excludes openings at the week end and includes createdAt == now', () => {
    const digest = classifyWeeklyDigest(
      [
        exhibition({
          id: 'on-end',
          city: 'TAIPEI',
          startDate: new Date(NOW.getTime() + WEEK_MS),
        }),
        exhibition({
          id: 'created-now',
          city: 'TOKYO',
          startDate: new Date('2026-12-01T00:00:00.000Z'),
          createdAt: NOW,
        }),
      ],
      NOW
    );
    assert.deepEqual(
      digest.cities.find(section => section.city === 'TAIPEI')?.upcoming,
      []
    );
    assert.deepEqual(
      digest.cities
        .find(section => section.city === 'TOKYO')
        ?.newlyAdded.map(item => item.id),
      ['created-now']
    );
  });

  it('dedupes ids and caps each section', () => {
    const extras = Array.from({ length: MAX_ITEMS_PER_SECTION + 2 }, (_, i) =>
      exhibition({
        id: `taipei-${i}`,
        city: 'TAIPEI',
        title: `Show ${String(i).padStart(2, '0')}`,
        startDate: new Date(NOW.getTime() + (i + 1) * 3600_000),
      })
    );
    const digest = classifyWeeklyDigest(
      [extras[0], extras[0], ...extras],
      NOW
    );
    const upcoming = digest.cities.find(section => section.city === 'TAIPEI')
      ?.upcoming;
    assert.equal(upcoming?.length, MAX_ITEMS_PER_SECTION);
    assert.deepEqual(
      upcoming?.map(item => item.id),
      extras.slice(0, MAX_ITEMS_PER_SECTION).map(item => item.id)
    );
  });
});

describe('format + generateWeeklyDigest', () => {
  const generated = generateWeeklyDigest(
    [
      exhibition({
        id: 'event_sample_huashan',
        city: 'TAIPEI',
        title: '[Sample] Huashan 1914 — Graphic Design',
        location: '台北市中正區八德路一段1號',
        startDate: new Date('2026-10-22T02:00:00.000Z'),
        endDate: new Date('2026-11-30T10:00:00.000Z'),
      }),
      exhibition({
        id: 'event_sample_nact',
        city: 'TOKYO',
        title: '[Sample] NACT Tokyo — International Exhibition',
        location: '東京都港区六本木7-22-2',
        createdAt: new Date('2026-10-19T00:00:00.000Z'),
        startDate: new Date('2026-12-01T01:00:00.000Z'),
      }),
    ],
    NOW,
    ORIGIN
  );

  it('renders zh, ja, and en without reading env', () => {
    assert.deepEqual(
      generated.messages.map(message => message.locale),
      ['zh', 'ja', 'en']
    );
    const zh = generated.messages[0]?.text ?? '';
    const ja = generated.messages[1]?.text ?? '';
    const en = generated.messages[2]?.text ?? '';
    assert.match(zh, /本週展覽摘要/);
    assert.match(zh, /即將開展/);
    assert.match(zh, /本週新增/);
    assert.match(zh, /台北/);
    assert.match(zh, /東京/);
    assert.match(ja, /今週の展覧会ダイジェスト/);
    assert.match(ja, /開催予定/);
    assert.match(en, /This week’s exhibition digest/);
    assert.match(en, /Opening soon/);
    assert.match(en, /Newly listed/);
  });

  it('includes portal listing URLs for each locale', () => {
    assert.match(
      generated.messages[0]?.text ?? '',
      /https:\/\/nx-event-portal\.vercel\.app\/zh-TW\/events\/event_sample_huashan/
    );
    assert.match(
      generated.messages[1]?.text ?? '',
      /https:\/\/nx-event-portal\.vercel\.app\/ja\/events\/event_sample_nact/
    );
    assert.equal(
      listingUrl('en', 'event_sample_huashan', ORIGIN),
      'https://nx-event-portal.vercel.app/en/events/event_sample_huashan'
    );
  });

  it('says none this week when a city section is empty', () => {
    const empty = formatDigestMessage(
      classifyWeeklyDigest([], NOW),
      'en',
      ORIGIN
    );
    assert.match(empty, /None this week/);
    assert.match(empty, /Taipei/);
    assert.match(empty, /Tokyo/);
  });

  it('keeps Discord messages under the 2000-character cap', () => {
    const longTitle = 'A'.repeat(400);
    const items = Array.from({ length: 8 }, (_, i) =>
      exhibition({
        id: `long-${i}`,
        city: i % 2 === 0 ? 'TAIPEI' : 'TOKYO',
        title: longTitle,
        startDate: new Date(NOW.getTime() + (i + 1) * 3600_000),
        createdAt: new Date(NOW.getTime() - 1000),
      })
    );
    for (const message of renderDigestMessages(
      classifyWeeklyDigest(items, NOW),
      ORIGIN
    )) {
      assert.ok(message.text.length <= 2000);
    }
  });
});
