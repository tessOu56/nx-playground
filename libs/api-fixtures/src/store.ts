import eventsSeed from './events.json';
import usersSeed from './users.json';

import type {
  CreateEventInput,
  EventListResponse,
  EventRecord,
  ExhibitionRegion,
  UserRecord,
} from './types';

function nowIso(): string {
  return new Date().toISOString();
}

function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function asExhibitionRegion(value: unknown): ExhibitionRegion | undefined {
  return value === 'TAIPEI' || value === 'TOKYO' ? value : undefined;
}

export function loadFixtureEvents(): EventRecord[] {
  const stamped = nowIso();
  return eventsSeed.events.map(event => ({
    ...event,
    region: asExhibitionRegion(event.region),
    createdAt: stamped,
    updatedAt: stamped,
  }));
}

export function loadFixtureUsers(): UserRecord[] {
  return usersSeed.users as UserRecord[];
}

export class EventStackStore {
  events = new Map<string, EventRecord>();
  users = new Map<string, UserRecord>();

  constructor() {
    for (const user of loadFixtureUsers()) {
      this.users.set(user.id, user);
    }
    for (const event of loadFixtureEvents()) {
      this.events.set(event.id, event);
    }
  }

  listEvents(query: {
    status?: string;
    region?: string;
    page?: number;
    limit?: number;
  }): EventListResponse {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    let items = [...this.events.values()].sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1
    );
    if (query.status) {
      items = items.filter(event => event.status === query.status);
    }
    if (query.region) {
      items = items.filter(event => event.region === query.region);
    }
    const total = items.length;
    const start = (page - 1) * limit;
    return {
      items: items.slice(start, start + limit),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  getEvent(id: string): EventRecord | undefined {
    return this.events.get(id);
  }

  createEvent(input: CreateEventInput): EventRecord {
    const stamped = nowIso();
    const event: EventRecord = {
      id: newId('event'),
      title: input.title,
      description: input.description,
      location: input.location,
      startDate: input.startDate,
      endDate: input.endDate,
      maxAttendees: input.maxAttendees,
      status: input.status ?? 'draft',
      formId: input.formId,
      data: input.data,
      region: input.region,
      timezone: input.timezone,
      source: input.source,
      sourceUrl: input.sourceUrl,
      externalId: input.externalId,
      contentHash: input.contentHash,
      tags: input.tags ?? [],
      priceText: input.priceText,
      lastSeenAt: input.lastSeenAt,
      createdAt: stamped,
      updatedAt: stamped,
    };
    this.events.set(event.id, event);
    return event;
  }

  updateEvent(
    id: string,
    input: Partial<CreateEventInput>
  ): EventRecord | undefined {
    const existing = this.events.get(id);
    if (!existing) return undefined;
    const updated: EventRecord = {
      ...existing,
      ...input,
      updatedAt: nowIso(),
    };
    this.events.set(id, updated);
    return updated;
  }

  deleteEvent(id: string): boolean {
    return this.events.delete(id);
  }
}
