import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { CatalogEvent } from './catalog-search';
import { handleLineWebhookBody } from './handle';
import type { LineMessage } from './messages';

const NOW = new Date('2026-10-19T02:00:00.000Z');

function lineEvent(
  event: Record<string, unknown>,
  webhookEventId: string
): Record<string, unknown> {
  return {
    timestamp: NOW.getTime(),
    webhookEventId,
    ...event,
  };
}

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
          lineEvent(
            {
              type: 'message',
              replyToken: 'token-1',
              message: { type: 'text', text: '台北 本週' },
            },
            '01EVTTOKEN1'
          ),
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
          lineEvent(
            {
              type: 'message',
              replyToken: 't-help',
              message: { type: 'text', text: '說明' },
            },
            '01EVTHELP'
          ),
          lineEvent(
            {
              type: 'message',
              replyToken: 't-empty',
              message: { type: 'text', text: '台北 本週 xyz-no-such' },
            },
            '01EVTEMPTY'
          ),
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

  it('replies with sample Flex cards when DATABASE_URL is unset', async () => {
    const previous = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;
    const sent: LineMessage[][] = [];
    try {
      await handleLineWebhookBody(
        JSON.stringify({
          events: [
            lineEvent(
              {
                type: 'message',
                replyToken: 'sample-search',
                message: { type: 'text', text: '台北 design' },
              },
              '01EVTSAMPLE'
            ),
          ],
        }),
        {
          now: NOW,
          reply: async (_token, messages) => {
            sent.push(messages);
          },
          portalOrigin: 'https://nx-event-portal.vercel.app',
        }
      );
      assert.equal(sent.length, 1);
      assert.equal(sent[0][0].type, 'flex');
      if (sent[0][0].type !== 'flex') return;
      assert.match(JSON.stringify(sent[0][0]), /event_sample_huashan/);
    } finally {
      if (previous === undefined) delete process.env.DATABASE_URL;
      else process.env.DATABASE_URL = previous;
    }
  });

  it('sends help on follow and ignores non-text messages', async () => {
    const tokens: string[] = [];
    await handleLineWebhookBody(
      JSON.stringify({
        events: [
          lineEvent({ type: 'follow', replyToken: 'welcome' }, '01EVTFOLLOW'),
          lineEvent(
            {
              type: 'message',
              replyToken: 'sticker',
              message: { type: 'sticker' },
            },
            '01EVTSTICKER'
          ),
        ],
      }),
      {
        now: NOW,
        reply: async token => {
          tokens.push(token);
        },
      }
    );
    assert.deepEqual(tokens, ['welcome']);
  });

  it('skips stale timestamps and duplicate webhookEventId', async () => {
    const tokens: string[] = [];
    const seen = new Set<string>();
    await handleLineWebhookBody(
      JSON.stringify({
        events: [
          lineEvent(
            {
              type: 'message',
              replyToken: 'fresh',
              message: { type: 'text', text: '說明' },
            },
            '01EVTREPLAY'
          ),
          lineEvent(
            {
              type: 'message',
              replyToken: 'dup',
              message: { type: 'text', text: '說明' },
            },
            '01EVTREPLAY'
          ),
          {
            type: 'message',
            timestamp: NOW.getTime() - 11 * 60 * 1000,
            webhookEventId: '01EVTSTALE',
            replyToken: 'stale',
            message: { type: 'text', text: '說明' },
          },
        ],
      }),
      {
        now: NOW,
        claimEventId: async id => {
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        },
        reply: async token => {
          tokens.push(token);
        },
      }
    );
    assert.deepEqual(tokens, ['fresh']);
  });
});
