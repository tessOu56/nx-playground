import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  eventDisplayKind,
  eventDisplayLabel,
  toPortalEvent,
  toPortalEventDetail,
} from './event-stack-map';

describe('event-stack catalog map', () => {
  it('uses fixture sessions and prices instead of one free ticket', () => {
    const event = toPortalEvent({
      id: 'event_react19',
      title: 'React 19 技術分享會',
      description: 'demo',
      location: '台北',
      startDate: '2026-11-15T14:00:00.000Z',
      endDate: '2026-11-15T17:00:00.000Z',
      status: 'published',
      createdAt: '2026-08-20T00:00:00.000Z',
      updatedAt: '2026-08-20T00:00:00.000Z',
      data: {
        category: '前端',
        sessions: [
          {
            id: 's1',
            name: '下午場',
            date: '2026-11-15',
            time: '14:00',
            tickets: [
              {
                id: 't1',
                name: '一般票',
                price: 800,
                totalQuantity: 40,
                availableQuantity: 40,
                status: 'selling',
                saleEndTime: '2026-11-14T16:00:00.000Z',
              },
            ],
          },
        ],
      },
    });
    assert.equal(event.sessions.length, 1);
    assert.equal(event.sessions[0].name, '下午場');
    assert.equal(event.sessions[0].tickets[0].price, 800);
    assert.equal(event.price, 800);
    assert.equal(event.category, '前端');
  });

  it('labels completed and sale-ended events', () => {
    assert.equal(
      eventDisplayKind({
        id: 'past',
        title: 'past',
        startDate: '2026-07-12T13:00:00.000Z',
        endDate: '2026-07-12T17:00:00.000Z',
        status: 'published',
        createdAt: '2026-08-20T00:00:00.000Z',
        updatedAt: '2026-08-20T00:00:00.000Z',
      }),
      'completed'
    );
    assert.equal(eventDisplayLabel('completed'), '已舉辦');
    assert.equal(
      eventDisplayKind({
        id: 'closed',
        title: 'closed',
        startDate: '2026-12-01T09:00:00.000Z',
        endDate: '2026-12-01T16:00:00.000Z',
        status: 'published',
        createdAt: '2026-08-20T00:00:00.000Z',
        updatedAt: '2026-08-20T00:00:00.000Z',
        data: { saleEnd: '2026-08-01T16:00:00.000Z' },
      }),
      'sale_ended'
    );
    assert.equal(eventDisplayLabel('cancelled'), '已下架');
  });

  it('maps speakers, organizer, and venue extras onto the detail', () => {
    const detail = toPortalEventDetail({
      id: 'event_react19',
      title: 'React 19 技術分享會',
      description: 'demo',
      location: '台北市信義區松高路 1 號 12 樓',
      startDate: '2026-11-15T14:00:00.000Z',
      endDate: '2026-11-15T17:00:00.000Z',
      status: 'published',
      createdAt: '2026-08-20T00:00:00.000Z',
      updatedAt: '2026-08-20T00:00:00.000Z',
      data: {
        organizer: 'Event Stack 社群',
        speakers: [
          {
            name: '林可',
            title: '前端工程師',
            bio: '示範講者',
            avatarUrl: 'https://picsum.photos/seed/speaker-lin/256/256',
          },
        ],
        venue: {
          transport: '捷運市政府站',
          mapQuery: '台北市信義區松高路 1 號',
          lat: 25.03396,
          lng: 121.56447,
        },
        sessions: [
          {
            id: 's1',
            name: '下午場',
            date: '2026-11-15',
            time: '14:00',
            tickets: [{ id: 't1', name: '一般票', price: 800, availableQuantity: 12 }],
          },
        ],
      },
    });
    assert.equal(detail.organizerName, 'Event Stack 社群');
    assert.equal(detail.speakers[0]?.name, '林可');
    assert.equal(detail.venue.lat, 25.03396);
    assert.equal(detail.remainingSeats, 12);
    assert.equal(detail.content.length, 0);
    assert.equal(detail.faq.length, 0);
  });
});
