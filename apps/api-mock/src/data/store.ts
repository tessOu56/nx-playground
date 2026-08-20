import { eventsSeed, ordersSeed, usersSeed } from './seed.js';
import type {
  CreateEventInput,
  CreateOrderInput,
  EventListResponse,
  EventRecord,
  OrderListResponse,
  OrderRecord,
  UserRecord,
} from './types.js';
import { DEMO_USER_ID } from './types.js';

function nowIso(): string {
  return new Date().toISOString();
}

function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export class EventStackStore {
  events = new Map<string, EventRecord>();
  orders = new Map<string, OrderRecord>();
  users = new Map<string, UserRecord>();

  constructor() {
    const stamped = nowIso();
    for (const user of usersSeed.users) {
      this.users.set(user.id, user);
    }
    for (const event of eventsSeed.events) {
      this.events.set(event.id, { ...event, createdAt: stamped, updatedAt: stamped });
    }
    for (const order of ordersSeed.orders) {
      this.orders.set(order.id, { ...order, createdAt: stamped, updatedAt: stamped });
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

  listOrders(query: {
    userId?: string;
    page?: number;
    limit?: number;
  }): OrderListResponse {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    let items = [...this.orders.values()].sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1
    );
    if (query.userId) {
      items = items.filter(order => order.userId === query.userId);
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
