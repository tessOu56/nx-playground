import eventsSeed from './events.json';
import ordersSeed from './orders.json';
import usersSeed from './users.json';

import type {
  CreateEventInput,
  CreateOrderInput,
  EventListResponse,
  EventRecord,
  OrderRecord,
  UserRecord,
} from './types';
import { DEMO_USER_ID } from './types';

function nowIso(): string {
  return new Date().toISOString();
}

function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export function loadFixtureEvents(): EventRecord[] {
  const stamped = nowIso();
  return eventsSeed.events.map(event => ({
    ...event,
    createdAt: stamped,
    updatedAt: stamped,
  }));
}

export function loadFixtureOrders(): OrderRecord[] {
  const stamped = nowIso();
  return ordersSeed.orders.map(order => ({
    ...order,
    createdAt: stamped,
    updatedAt: stamped,
  }));
}

export function loadFixtureUsers(): UserRecord[] {
  return usersSeed.users as UserRecord[];
}

export class EventStackStore {
  events = new Map<string, EventRecord>();
  orders = new Map<string, OrderRecord>();
  users = new Map<string, UserRecord>();

  constructor() {
    for (const user of loadFixtureUsers()) {
      this.users.set(user.id, user);
    }
    for (const event of loadFixtureEvents()) {
      this.events.set(event.id, event);
    }
    for (const order of loadFixtureOrders()) {
      this.orders.set(order.id, order);
    }
  }

  listEvents(query: {
    status?: string;
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

  createOrder(input: CreateOrderInput): OrderRecord | { error: string } {
    if (!this.events.has(input.eventId)) {
      return { error: `Event ${input.eventId} not found` };
    }
    const userId = input.userId ?? DEMO_USER_ID;
    if (!this.users.has(userId)) {
      return { error: `User ${userId} not found` };
    }
    const stamped = nowIso();
    const order: OrderRecord = {
      id: newId('order'),
      eventId: input.eventId,
      userId,
      status: input.status ?? 'pending',
      data: input.data ?? {},
      createdAt: stamped,
      updatedAt: stamped,
    };
    this.orders.set(order.id, order);
    return order;
  }

  getOrder(id: string): OrderRecord | undefined {
    return this.orders.get(id);
  }

  confirmOrder(id: string): OrderRecord | undefined {
    const existing = this.orders.get(id);
    if (!existing) return undefined;
    const updated = {
      ...existing,
      status: 'confirmed',
      updatedAt: nowIso(),
    };
    this.orders.set(id, updated);
    return updated;
  }
}
