import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { exhibitionCarousel, helpMessage, quickReply } from './messages';

describe('LINE reply messages', () => {
  it('includes locale-matched quick-reply chips', () => {
    const zh = quickReply('zh-TW').items.map(item => item.action.text);
    const ja = quickReply('ja').items.map(item => item.action.text);
    const en = quickReply('en').items.map(item => item.action.text);
    assert.ok(zh.includes('台北 本週'));
    assert.ok(zh.includes('東京 週末'));
    assert.ok(ja.includes('東京 週末'));
    assert.ok(en.includes('Taipei this week'));
    assert.match(helpMessage('ja').text, /使い方/);
  });

  it('builds a carousel bubble with image, venue, price, and portal URL', () => {
    const message = exhibitionCarousel(
      [
        {
          id: 'event_sample_tfam',
          title: 'TFAM',
          location: '台北市中山區中山北路三段181號',
          startDate: new Date('2026-10-04T01:00:00.000Z'),
          endDate: new Date('2026-12-27T10:00:00.000Z'),
          timezone: 'Asia/Taipei',
          priceText: 'NT$30',
          region: 'TAIPEI',
          sourceUrl: 'https://www.tfam.museum/',
          tags: [],
          imageUrl: 'https://picsum.photos/seed/tfam/1200/640',
          rank: 1,
        },
      ],
      'ja',
      'https://nx-event-portal.vercel.app'
    );
    const json = JSON.stringify(message);
    assert.match(json, /picsum\.photos/);
    assert.match(json, /台北市中山區/);
    assert.match(json, /NT\$30/);
    assert.match(
      json,
      /https:\/\/nx-event-portal\.vercel\.app\/ja\/events\/event_sample_tfam/
    );
  });
});
