import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { CatalogEvent } from './catalog-search';
import { handleLineWebhookBody } from './handle';
import type { LineMessage } from './messages';

const NOW = new Date('2026-10-19T02:00:00.000Z');

function catalogEvent(overrides: Partial<CatalogEvent> = {}): CatalogEvent {
  return {
    id: 'event_sample_tfam',
    title: '[Sample] TFAM — Contemporary Taiwan',
    location: '台北市中山區中山北路三段181號',
    startDate: new Date('2026-10-04T01:00:00.000Z'),
    endDate: new Date('2026-12-27T10:00:00.000Z'),
    timezone: 'Asia/Taipei',
    priceText: 'NT$30',
    region: 'TAIPEI',
    sourceUrl: 'https://www.tfam.museum/',
    tags: ['art'],
    imageUrl: 'https://picsum.photos/seed/event_sample_tfam/1200/640',
    rank: 0.5,
    ...overrides,
  };
}

describe('handleLineWebhookBody', () => {
  it('replies with a Flex carousel of at most 10 bubbles', async () => {
    const sent: LineMessage[][] = [];
    const events = Array.from({ length: 12 }, (_, index) =>
      catalogEvent({ id: `evt_${index}`, title: `Show ${index}` })
    );

    await handleLineWebhookBody(
      JSON.stringify({
        events: [
          {
            type: 'message',
            replyToken: 'token-1',
            message: { type: 'text', text: '台北 本週' },
          },
        ],
      }),
      {
        now: NOW,
        search: async () => events,
        reply: async (_token, messages) => {
          sent.push(messages);
        },
        portalOrigin: 'https://nx-event-portal.vercel.app',
      }
    );

    assert.equal(sent.length, 1);
    const flex = sent[0][0];
    assert.equal(flex.type, 'flex');
    if (flex.type !== 'flex') return;
    const contents = flex.contents as { contents?: unknown[] };
    assert.equal(contents.contents?.length, 10);
    const uri = JSON.stringify(flex);
    assert.match(uri, /https:\/\/nx-event-portal\.vercel\.app\/zh-TW\/events\/evt_0/);
  });

  it('replies help for 說明 and a no-results message when the catalog is empty', async () => {
    const sent: LineMessage[][] = [];
    await handleLineWebhookBody(
      JSON.stringify({
        events: [
          {
            type: 'message',
            replyToken: 't-help',
            message: { type: 'text', text: '說明' },
          },
          {
            type: 'message',
            replyToken: 't-empty',
            message: { type: 'text', text: '台北 本週 xyz-no-such' },
          },
        ],
      }),
      {
        now: NOW,
        search: async () => [],
        reply: async (_token, messages) => {
          sent.push(messages);
        },
      }
    );

    assert.equal(sent.length, 2);
    assert.equal(sent[0][0].type, 'text');
    if (sent[0][0].type === 'text') {
      assert.match(sent[0][0].text, /台北、東京/);
    }
    assert.equal(sent[1][0].type, 'text');
    if (sent[1][0].type === 'text') {
      assert.match(sent[1][0].text, /沒找到/);
    }
  });

  it('sends help on follow and ignores non-text messages', async () => {
    const tokens: string[] = [];
    await handleLineWebhookBody(
      JSON.stringify({
        events: [
          { type: 'follow', replyToken: 'welcome' },
          {
            type: 'message',
            replyToken: 'sticker',
            message: { type: 'sticker' },
          },
        ],
      }),
      {
        reply: async token => {
          tokens.push(token);
        },
      }
    );
    assert.deepEqual(tokens, ['welcome']);
  });
});
