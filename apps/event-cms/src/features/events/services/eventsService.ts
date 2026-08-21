import {
  createEvent,
  deleteEvent,
  getEvent,
  listEvents,
  updateEvent,
  type CreateEventDto,
  type EventStackEvent,
} from '@nx-playground/api-client';

import { type EventFormValue } from '../types';

function sessionToIso(date: string, time: string): string {
  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  return new Date(`${date}T${normalizedTime}`).toISOString();
}

function catalogContent(
  blocks: EventFormValue['eventContentBlocks']
): Array<Record<string, string>> {
  if (!blocks) return [];
  const mapped: Array<Record<string, string>> = [];
  for (const block of blocks) {
    if (block.type === 'image') {
      if (typeof block.content === 'string' && block.content) {
        mapped.push({ type: 'image', image_data: block.content });
      }
      continue;
    }
    if (typeof block.content === 'string' && block.content.trim()) {
      mapped.push({ type: 'text', text_data: block.content });
    }
  }
  return mapped;
}

function catalogFaq(
  blocks: EventFormValue['faqBlocks']
): Array<{ question: string; answer: string }> {
  if (!blocks) return [];
  return blocks
    .map(block => ({
      question: block.question.trim(),
      answer: block.answer.trim(),
    }))
    .filter(row => row.question.length > 0);
}

function catalogTicketsForSession(
  data: EventFormValue,
  sessionId: string
): Array<Record<string, unknown>> {
  return data.ticketBlock.flatMap(ticket => {
    const applies = ticket.saleTimeType
      ? true
      : ticket.saleTime.some(row => row.sessionId === sessionId);
    if (!applies) return [];
    const sale =
      ticket.saleTime.find(row => row.sessionId === sessionId) ??
      ticket.saleTime[0];
    return [
      {
        id: ticket.id,
        name: ticket.name,
        price: ticket.price,
        totalQuantity: ticket.count,
        availableQuantity: ticket.state ? ticket.count : 0,
        status: ticket.state ? 'selling' : 'stopped',
        saleStartTime: sale?.startTime,
        saleEndTime: sale?.endTime,
      },
    ];
  });
}

export function toCatalogData(data: EventFormValue): Record<string, unknown> {
  const sessions = data.sessionBlock.map(session => ({
    id: session.id,
    name: session.name,
    date: session.date,
    time: session.startTime,
    capacity: session.capacityLimit ?? 0,
    tickets: catalogTicketsForSession(data, session.id),
  }));

  return {
    category: '活動',
    organizer: '活動主辦',
    speakers: [],
    venue: {
      address: data.eventLocation,
      mapQuery: data.eventLocation,
    },
    content: catalogContent(data.eventContentBlocks),
    faq: catalogFaq(data.faqBlocks),
    sessions,
  };
}

type CatalogCreateEventDto = CreateEventDto & {
  data?: Record<string, unknown>;
};

export function toCreateEventDto(data: EventFormValue): CatalogCreateEventDto {
  const first = data.sessionBlock[0];
  const startDate = first
    ? sessionToIso(first.date, first.startTime)
    : new Date().toISOString();
  const endDate = first
    ? sessionToIso(first.date, first.endTime)
    : new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

  return {
    title: data.eventName,
    description: data.eventDescription,
    location: data.eventLocation,
    startDate,
    endDate,
    maxAttendees: first?.capacityLimit ?? undefined,
    status: data.visibility === 'public' ? 'published' : 'draft',
    data: toCatalogData(data),
  };
}

export class EventsService {
  static async createEvent(data: EventFormValue): Promise<EventStackEvent> {
    return createEvent(toCreateEventDto(data));
  }

  static async updateEvent(
    id: string,
    data: Partial<EventFormValue>
  ): Promise<EventStackEvent> {
    const patch: Partial<CatalogCreateEventDto> = {};
    if (data.eventName) patch.title = data.eventName;
    if (data.eventDescription) patch.description = data.eventDescription;
    if (data.eventLocation) patch.location = data.eventLocation;
    if (data.visibility) {
      patch.status = data.visibility === 'public' ? 'published' : 'draft';
    }
    if (data.sessionBlock?.[0]) {
      const first = data.sessionBlock[0];
      patch.startDate = sessionToIso(first.date, first.startTime);
      patch.endDate = sessionToIso(first.date, first.endTime);
      if (first.capacityLimit) patch.maxAttendees = first.capacityLimit;
    }
    if (data.sessionBlock) {
      patch.data = toCatalogData(data as EventFormValue);
    }
    return updateEvent(id, patch);
  }

  static async deleteEvent(id: string): Promise<void> {
    await deleteEvent(id);
  }

  static async getEvents(): Promise<EventStackEvent[]> {
    const page = await listEvents({ limit: 50 });
    return page.items;
  }

  static async getEventById(id: string): Promise<EventStackEvent> {
    return getEvent(id);
  }

  static async uploadImage(file: File): Promise<string> {
    return URL.createObjectURL(file);
  }
}
