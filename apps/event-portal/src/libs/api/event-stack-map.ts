import type { EventStackEvent } from '@nx-playground/api-client/event-stack';

import type { Event, EventDetail, LineSettings, Vendor } from '@/types';

export const STACK_VENDOR: Vendor = {
  id: 'vendor-stack',
  events: 0,
  email: 'organizer@nx-playground.local',
  lineOfficialAccountId: 'stack-line',
  defaultBankAccount: {
    bankCode: '000',
    accountNumber: '0000000000',
    accountName: 'Event Stack',
  },
};

const STACK_LINE: LineSettings = {
  officialAccountId: 'stack-line',
  description: 'Event Stack LINE account',
  displayName: 'Event Stack',
};

function isoDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function isoTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '00:00';
  return date.toISOString().slice(11, 16);
}

export function toPortalEvent(api: EventStackEvent): Event {
  const sessionId = `${api.id}-session`;
  const ticketId = `${api.id}-ticket`;
  const capacity = api.maxAttendees ?? 50;

  return {
    id: api.id,
    vendorId: STACK_VENDOR.id,
    title: api.title,
    description: api.description ?? '',
    date: isoDate(api.startDate),
    location: api.location ?? '',
    price: 0,
    image: `https://picsum.photos/seed/${encodeURIComponent(api.id)}/800/600`,
    likes: 0,
    attendees: 0,
    capacity,
    category: '活動',
    tags: [],
    status: 'upcoming',
    sessions: [
      {
        id: sessionId,
        eventId: api.id,
        name: '預設場次',
        date: isoDate(api.startDate),
        time: isoTime(api.startDate),
        capacity,
        currentAttendees: 0,
        status: 'upcoming',
        tickets: [
          {
            id: ticketId,
            sessionId,
            name: '一般票',
            price: 0,
            totalQuantity: capacity,
            availableQuantity: capacity,
            status: 'selling',
            saleStartTime: new Date(0).toISOString(),
            saleEndTime: api.endDate,
          },
        ],
      },
    ],
  };
}

export function toPortalEventDetail(api: EventStackEvent): EventDetail {
  return {
    ...toPortalEvent(api),
    vendor: STACK_VENDOR,
    lineSettings: STACK_LINE,
    content: [
      {
        type: 'text',
        text_data: api.description ?? '',
      },
    ],
    faq: [],
  };
}
