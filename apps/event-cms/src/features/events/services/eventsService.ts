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

export function toCreateEventDto(data: EventFormValue): CreateEventDto {
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
    const patch: Partial<CreateEventDto> = {};
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
