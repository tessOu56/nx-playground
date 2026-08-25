import type { EventStackEvent } from '@nx-playground/api-client/event-stack';

import type {
  Event,
  EventContentBlock,
  EventDetail,
  EventFAQ,
  EventSpeaker,
  EventVenue,
  LineSettings,
  Session,
  SessionTicket,
  Vendor,
} from '@/types';

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

export type EventDomainKind = 'talk' | 'auction' | 'line_commerce';

export function eventDomainLabel(kind: EventDomainKind): string {
  switch (kind) {
    case 'auction':
      return '拍賣';
    case 'line_commerce':
      return 'LINE 商務';
    default:
      return '講座';
  }
}

/** HTTPS Plinth / local only — blocks javascript: and arbitrary phishing hosts. */
export function sanitizePlinthLotUrl(raw: unknown): string | undefined {
  if (typeof raw !== 'string' || !raw.trim()) return undefined;
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return undefined;
    const host = url.hostname.toLowerCase();
    const allowed =
      host === 'localhost' ||
      host === '127.0.0.1' ||
      (host.endsWith('.vercel.app') &&
        (host.includes('metalcraft') || host.includes('plinth')));
    if (!allowed) return undefined;
    if (
      url.protocol === 'http:' &&
      host !== 'localhost' &&
      host !== '127.0.0.1'
    ) {
      return undefined;
    }
    return url.toString();
  } catch {
    return undefined;
  }
}

export function parseEventDomainKind(raw: unknown): EventDomainKind {
  if (raw === 'auction' || raw === 'line_commerce' || raw === 'talk') {
    return raw;
  }
  return 'talk';
}

export type EventDisplayKind =
  | 'upcoming'
  | 'ongoing'
  | 'completed'
  | 'sale_ended'
  | 'cancelled';

export function eventDisplayLabel(kind: EventDisplayKind): string {
  switch (kind) {
    case 'completed':
      return '已舉辦';
    case 'cancelled':
      return '已下架';
    case 'sale_ended':
      return '停售';
    case 'ongoing':
      return '進行中';
    default:
      return '報名中';
  }
}

function catalogOf(api: EventStackEvent): Record<string, unknown> {
  if (api.data && typeof api.data === 'object' && !Array.isArray(api.data)) {
    return api.data;
  }
  return {};
}

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

export function eventDisplayKind(
  api: EventStackEvent,
  now = new Date()
): EventDisplayKind {
  if (api.status === 'cancelled' || api.status === 'unpublished') {
    return 'cancelled';
  }
  const start = new Date(api.startDate);
  const end = new Date(api.endDate);
  const catalog = catalogOf(api);
  const saleEndRaw = catalog.saleEnd;
  const saleEnd =
    typeof saleEndRaw === 'string' ? new Date(saleEndRaw) : undefined;
  if (!Number.isNaN(end.getTime()) && end < now) return 'completed';
  if (
    !Number.isNaN(start.getTime()) &&
    !Number.isNaN(end.getTime()) &&
    start <= now &&
    now <= end
  ) {
    return 'ongoing';
  }
  if (saleEnd && !Number.isNaN(saleEnd.getTime()) && saleEnd < now) {
    return 'sale_ended';
  }
  return 'upcoming';
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return undefined;
}

function mapTicket(
  raw: Record<string, unknown>,
  sessionId: string,
  eventEnd: string,
  kind: EventDisplayKind
): SessionTicket {
  const saleEndTime =
    typeof raw.saleEndTime === 'string' ? raw.saleEndTime : eventEnd;
  const stopped =
    kind === 'completed' ||
    kind === 'cancelled' ||
    kind === 'sale_ended' ||
    raw.status === 'stopped' ||
    raw.status === 'sold_out';
  return {
    id: String(raw.id ?? `${sessionId}-ticket`),
    sessionId,
    name: String(raw.name ?? '一般票'),
    description:
      typeof raw.description === 'string' ? raw.description : undefined,
    price: Number(raw.price ?? 0) || 0,
    totalQuantity: Number(raw.totalQuantity ?? 0) || 0,
    availableQuantity: Number(raw.availableQuantity ?? 0) || 0,
    status: stopped ? 'stopped' : 'selling',
    saleStartTime:
      typeof raw.saleStartTime === 'string'
        ? raw.saleStartTime
        : new Date(0).toISOString(),
    saleEndTime,
    type: raw.type as SessionTicket['type'],
  };
}

function mapSession(
  raw: Record<string, unknown>,
  eventId: string,
  eventEnd: string,
  kind: EventDisplayKind
): Session {
  const id = String(raw.id ?? `${eventId}-session`);
  const ticketsRaw = Array.isArray(raw.tickets) ? raw.tickets : [];
  const sessionStatus: Session['status'] =
    kind === 'completed'
      ? 'completed'
      : kind === 'cancelled'
      ? 'cancelled'
      : kind === 'ongoing'
      ? 'ongoing'
      : 'upcoming';
  return {
    id,
    eventId,
    name: String(raw.name ?? '預設場次'),
    date: String(raw.date ?? isoDate(eventEnd)),
    time: String(raw.time ?? '00:00'),
    capacity: Number(raw.capacity ?? 0) || 0,
    currentAttendees: Number(raw.currentAttendees ?? 0) || 0,
    status: sessionStatus,
    tickets: ticketsRaw
      .map(item => asRecord(item))
      .filter((item): item is Record<string, unknown> => Boolean(item))
      .map(ticket => mapTicket(ticket, id, eventEnd, kind)),
  };
}

function fallbackSession(api: EventStackEvent, kind: EventDisplayKind): Session {
  const sessionId = `${api.id}-session`;
  const ticketId = `${api.id}-ticket`;
  const capacity = api.maxAttendees ?? 50;
  const stopped =
    kind === 'completed' || kind === 'cancelled' || kind === 'sale_ended';
  return {
    id: sessionId,
    eventId: api.id,
    name: '預設場次',
    date: isoDate(api.startDate),
    time: isoTime(api.startDate),
    capacity,
    currentAttendees: 0,
    status: stopped ? 'completed' : 'upcoming',
    tickets: [
      {
        id: ticketId,
        sessionId,
        name: '一般票',
        price: 0,
        totalQuantity: capacity,
        availableQuantity: stopped ? 0 : capacity,
        status: stopped ? 'stopped' : 'selling',
        saleStartTime: new Date(0).toISOString(),
        saleEndTime: api.endDate,
      },
    ],
  };
}

function mapContent(raw: unknown): EventContentBlock[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(item => asRecord(item))
    .filter((item): item is Record<string, unknown> => Boolean(item))
    .map(block => ({
      type: (typeof block.type === 'string' ? block.type : 'text') as EventContentBlock['type'],
      text_data: typeof block.text_data === 'string' ? block.text_data : undefined,
      image_data:
        typeof block.image_data === 'string' ? block.image_data : undefined,
    }));
}

function mapFaq(raw: unknown): EventFAQ[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(item => asRecord(item))
    .filter((item): item is Record<string, unknown> => Boolean(item))
    .map(row => ({
      question: String(row.question ?? ''),
      answer: String(row.answer ?? ''),
    }))
    .filter(row => row.question.length > 0);
}

function portalStatus(
  kind: EventDisplayKind
): Event['status'] {
  if (kind === 'completed' || kind === 'sale_ended') return 'completed';
  if (kind === 'cancelled') return 'cancelled';
  if (kind === 'ongoing') return 'ongoing';
  return 'upcoming';
}

export function toPortalEvent(api: EventStackEvent): Event {
  const catalog = catalogOf(api);
  const kind = eventDisplayKind(api);
  const sessionsRaw = Array.isArray(catalog.sessions) ? catalog.sessions : [];
  const sessions =
    sessionsRaw.length > 0
      ? sessionsRaw
          .map(item => asRecord(item))
          .filter((item): item is Record<string, unknown> => Boolean(item))
          .map(session => mapSession(session, api.id, api.endDate, kind))
      : [fallbackSession(api, kind)];
  const prices = sessions.flatMap(session =>
    session.tickets.map(ticket => ticket.price)
  );
  const capacity = api.maxAttendees ?? sessions[0]?.capacity ?? 50;
  const tags = Array.isArray(catalog.tags)
    ? catalog.tags.filter((tag): tag is string => typeof tag === 'string')
    : [];
  const speakers = mapSpeakers(catalog.speakers);
  const organizer =
    typeof catalog.organizer === 'string' && catalog.organizer.trim()
      ? catalog.organizer.trim()
      : undefined;
  const venueRecord = asRecord(catalog.venue);
  const venueHint =
    (venueRecord &&
      typeof venueRecord.transport === 'string' &&
      venueRecord.transport.trim()) ||
    undefined;
  const domainKind = parseEventDomainKind(catalog.kind);
  const plinthLotUrl = sanitizePlinthLotUrl(catalog.plinthLotUrl);

  return {
    id: api.id,
    vendorId: STACK_VENDOR.id,
    title: api.title,
    description: api.description ?? '',
    date: isoDate(api.startDate),
    endsAt: api.endDate,
    location: api.location ?? '',
    price: prices.length > 0 ? Math.min(...prices) : 0,
    image:
      typeof catalog.image === 'string'
        ? catalog.image
        : `https://picsum.photos/seed/${encodeURIComponent(api.id)}/800/600`,
    likes: 0,
    attendees: 0,
    capacity,
    category: typeof catalog.category === 'string' ? catalog.category : '活動',
    tags,
    status: portalStatus(kind),
    sessions,
    organizerName: organizer,
    speakerCount: speakers.length > 0 ? speakers.length : undefined,
    venueHint,
    domainKind,
    plinthLotUrl,
  };
}

function mapSpeakers(raw: unknown): EventSpeaker[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(item => asRecord(item))
    .filter((item): item is Record<string, unknown> => Boolean(item))
    .map(row => ({
      name: String(row.name ?? '').trim(),
      title: typeof row.title === 'string' ? row.title : undefined,
      bio: typeof row.bio === 'string' ? row.bio : undefined,
      avatarUrl: typeof row.avatarUrl === 'string' ? row.avatarUrl : undefined,
    }))
    .filter(row => row.name.length > 0);
}

function mapVenue(
  raw: unknown,
  location: string
): EventVenue {
  const record = asRecord(raw);
  const lat = record && typeof record.lat === 'number' ? record.lat : undefined;
  const lng = record && typeof record.lng === 'number' ? record.lng : undefined;
  return {
    address:
      (record && typeof record.address === 'string' && record.address) ||
      location,
    transport:
      record && typeof record.transport === 'string'
        ? record.transport
        : undefined,
    mapQuery:
      record && typeof record.mapQuery === 'string'
        ? record.mapQuery.trim() || undefined
        : location.trim() || undefined,
    lat,
    lng,
  };
}

function remainingSeatsOf(sessions: Session[]): number {
  return sessions.reduce(
    (sum, session) =>
      sum +
      session.tickets.reduce(
        (ticketSum, ticket) => ticketSum + (ticket.availableQuantity || 0),
        0
      ),
    0
  );
}

export function toPortalEventDetail(api: EventStackEvent): EventDetail {
  const catalog = catalogOf(api);
  const event = toPortalEvent(api);
  const content = mapContent(catalog.content);
  const organizer =
    typeof catalog.organizer === 'string' && catalog.organizer.trim()
      ? catalog.organizer.trim()
      : STACK_LINE.displayName;
  return {
    ...event,
    vendor: STACK_VENDOR,
    lineSettings: STACK_LINE,
    content,
    faq: mapFaq(catalog.faq),
    startsAt: api.startDate,
    endsAt: api.endDate,
    startTime: event.sessions[0]?.time ?? isoTime(api.startDate),
    organizerName: organizer,
    remainingSeats: remainingSeatsOf(event.sessions),
    speakers: mapSpeakers(catalog.speakers),
    venue: mapVenue(catalog.venue, api.location ?? ''),
  };
}

export function eventListKind(event: Event): EventDisplayKind {
  if (event.status === 'cancelled') return 'cancelled';
  if (event.status === 'completed') {
    const saleEnded = event.sessions.every(session =>
      session.tickets.every(ticket => ticket.status === 'stopped')
    );
    const eventEnded = new Date(`${event.date}T23:59:59.000Z`) < new Date();
    if (!eventEnded && saleEnded) return 'sale_ended';
    return 'completed';
  }
  if (event.status === 'ongoing') return 'ongoing';
  return 'upcoming';
}
