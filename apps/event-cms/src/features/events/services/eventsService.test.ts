import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { toCatalogData, toCreateEventDto } from './eventsService';
import type { EventFormValue } from '../types';

const form: EventFormValue = {
  eventCoverImage: null,
  eventName: 'CMS 新建場',
  eventDescription: '主辦從 CMS 建立',
  eventLocation: '台北市信義區',
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
    assert.deepEqual(catalog.speakers, []);
    const venue = catalog.venue as { mapQuery?: string };
    assert.equal(venue.mapQuery, '台北市信義區');
  });
});
