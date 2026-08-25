import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { toCatalogData, toCreateEventDto } from './eventsService';
import type { EventFormValue } from '../types';

const form: EventFormValue = {
  eventCoverImage: null,
  eventName: 'CMS 新建場',
  eventDescription: '主辦從 CMS 建立',
  eventLocation: '台北市信義區',
  organizerName: '示範主辦單位',
  speakersText: 'Jane Doe — 前端架構\nJohn Smith — 產品設計',
  venueLat: '25.033',
  venueLng: '121.565',
  eventKind: 'talk',
  plinthLotUrl: '',
  eventContentBlocks: [
    { id: 'c1', type: 'text', content: '這場會講什麼' },
  ],
  faqBlocks: [{ id: 'f1', question: '需要筆電嗎？', answer: '聽講不強制。' }],
  sessionBlock: [
    {
      id: 's1',
      name: '下午場',
      date: '2026-11-15',
      startTime: '14:00',
      endTime: '17:00',
      capacityLimit: 40,
    },
  ],
  ticketBlock: [
    {
      id: 't1',
      name: '一般票',
      price: 800,
      count: 40,
      state: true,
      saleTime: [
        {
          sessionId: 's1',
          startTime: '2026-08-01T00:00:00.000Z',
          endTime: '2026-11-14T16:00:00.000Z',
        },
      ],
      globalTime: undefined,
      saleTimeType: true,
      offset: {
        startOffset: 0,
        startOffsetBase: 0,
        endOffset: 0,
        endOffsetBase: 0,
      },
    },
  ],
  visibility: 'public',
  bankTransfer: {
    id: 'b1',
    enable: false,
    type: 'ATM',
    bankName: '示範銀行',
    branchName: '總行',
    accountName: '主辦',
    account: '1234567',
    description: undefined,
  },
  cashpayment: {
    id: 'c1',
    enable: false,
    type: 'cash',
    description: undefined,
  },
};

describe('CMS catalog DTO', () => {
  it('writes sessions, tickets, FAQ, content, and speakers into data', () => {
    const dto = toCreateEventDto(form);
    const catalog = toCatalogData(form);
    assert.equal(dto.title, 'CMS 新建場');
    assert.equal(dto.status, 'published');
    assert.deepEqual(dto.data, catalog);
    const sessions = catalog.sessions as Array<{
      name: string;
      tickets: Array<{ price: number }>;
    }>;
    assert.equal(sessions[0]?.name, '下午場');
    assert.equal(sessions[0]?.tickets[0]?.price, 800);
    assert.deepEqual(catalog.faq, [
      { question: '需要筆電嗎？', answer: '聽講不強制。' },
    ]);
    assert.deepEqual(catalog.content, [
      { type: 'text', text_data: '這場會講什麼' },
    ]);
    assert.deepEqual(catalog.speakers, [
      { name: 'Jane Doe', title: '前端架構' },
      { name: 'John Smith', title: '產品設計' },
    ]);
    const venue = catalog.venue as { mapQuery?: string; lat?: number; lng?: number };
    assert.equal(venue.mapQuery, '台北市信義區');
    assert.equal(venue.lat, 25.033);
    assert.equal(venue.lng, 121.565);
    assert.equal(catalog.organizer, '示範主辦單位');
    assert.equal(catalog.kind, 'talk');
  });

  it('writes auction kind and Plinth deep link into data', () => {
    const auction: EventFormValue = {
      ...form,
      eventKind: 'auction',
      plinthLotUrl: 'https://metalcraft-storefront-eta.vercel.app/en/lots/lot-1',
    };
    const catalog = toCatalogData(auction);
    assert.equal(catalog.kind, 'auction');
    assert.equal(
      catalog.plinthLotUrl,
      'https://metalcraft-storefront-eta.vercel.app/en/lots/lot-1'
    );
  });

  it('allows empty session and ticket blocks on create DTO', () => {
    const empty: EventFormValue = {
      ...form,
      sessionBlock: [],
      ticketBlock: [],
    };
    const dto = toCreateEventDto(empty);
    const catalog = toCatalogData(empty);
    assert.ok(dto.startDate);
    assert.deepEqual(catalog.sessions, []);
  });
});
