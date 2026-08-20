import eventsSeed from './events.json';
import ordersSeed from './orders.json';
import usersSeed from './users.json';

import type {
  CreateEventInput,
  CreateOrderInput,
  EventListResponse,
  EventRecord,
  OrderListResponse,
  OrderRecord,
  UserRecord,
} from './types';
import { DEMO_USER_ID } from './types';
import { isLineAttendeeUserId, stubLineAttendeeUser } from './attendee-user-id';
import {
  amountFromOrderData,
  checkoutUrlForProvider,
  newMerchantTradeNo,
  paymentProviderFromEnv,
  webhookStatusFromRtnCode,
  type PaymentIntentRecord,
} from './payment';
import {
  ticketIsValidForCheckIn,
  ticketSpecsFromOrderData,
  type TicketRecord,
} from './ticket';

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
  tickets = new Map<string, TicketRecord>();
  paymentIntents = new Map<string, PaymentIntentRecord>();

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
    if (!this.users.has(userId) && isLineAttendeeUserId(userId)) {
      this.users.set(userId, stubLineAttendeeUser(userId));
    }
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
    if (existing.status === 'confirmed') return existing;
    const stamped = nowIso();
    const updated = {
      ...existing,
      status: 'confirmed',
      updatedAt: stamped,
    };
    this.orders.set(id, updated);
    for (const spec of ticketSpecsFromOrderData(existing.data ?? {})) {
      for (let i = 0; i < spec.quantity; i += 1) {
        const ticket: TicketRecord = {
          id: newId('ticket'),
          orderId: existing.id,
          eventId: existing.eventId,
          type: spec.type,
          status: 'issued',
          createdAt: stamped,
          updatedAt: stamped,
        };
        this.tickets.set(ticket.id, ticket);
      }
    }
    return updated;
  }

  listTicketsByOrder(orderId: string): TicketRecord[] {
    return [...this.tickets.values()]
      .filter(ticket => ticket.orderId === orderId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  getTicket(id: string): TicketRecord | undefined {
    return this.tickets.get(id);
  }

  verifyTicket(id: string):
    | {
        ticket: TicketRecord;
        event: EventRecord;
        order: OrderRecord;
        isValid: boolean;
        verificationTime: string;
      }
    | undefined {
    const ticket = this.tickets.get(id);
    if (!ticket) return undefined;
    const order = this.orders.get(ticket.orderId);
    const event = this.events.get(ticket.eventId);
    if (!order || !event) return undefined;
    return {
      ticket,
      event,
      order,
      isValid: ticketIsValidForCheckIn(ticket, order.status),
      verificationTime: nowIso(),
    };
  }

  checkInTicket(
    id: string
  ): TicketRecord | { error: string } | undefined {
    const ticket = this.tickets.get(id);
    if (!ticket) return undefined;
    const order = this.orders.get(ticket.orderId);
    if (!order || !ticketIsValidForCheckIn(ticket, order.status)) {
      return { error: `Ticket ${id} cannot be checked in` };
    }
    const stamped = nowIso();
    const updated: TicketRecord = {
      ...ticket,
      status: 'used',
      checkedInAt: stamped,
      updatedAt: stamped,
    };
    this.tickets.set(id, updated);
    return updated;
  }

  listPaymentIntentsByOrder(orderId: string): PaymentIntentRecord[] {
    return [...this.paymentIntents.values()]
      .filter(intent => intent.orderId === orderId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  getPaymentIntent(id: string): PaymentIntentRecord | undefined {
    return this.paymentIntents.get(id);
  }

  createPaymentIntent(
    orderId: string,
    options: { publicApiBase: string }
  ): PaymentIntentRecord | { error: string } {
    const order = this.orders.get(orderId);
    if (!order) return { error: `Order ${orderId} not found` };
    const existing = this.listPaymentIntentsByOrder(orderId);
    const reusable = existing.find(
      intent => intent.status === 'created' || intent.status === 'paid'
    );
    if (reusable) return reusable;

    const stamped = nowIso();
    const id = newId('pay');
    const provider = paymentProviderFromEnv({
      merchantId: process.env.ECPAY_MERCHANT_ID,
      hashKey: process.env.ECPAY_HASH_KEY,
      hashIV: process.env.ECPAY_HASH_IV,
    });
    const intent: PaymentIntentRecord = {
      id,
      orderId,
      provider,
      status: 'created',
      merchantTradeNo: newMerchantTradeNo(),
      amount: amountFromOrderData(order.data ?? {}),
      checkoutUrl: checkoutUrlForProvider(provider, options.publicApiBase, id),
      createdAt: stamped,
      updatedAt: stamped,
    };
    this.paymentIntents.set(id, intent);
    return intent;
  }

  applyPaymentWebhook(input: {
    merchantTradeNo: string;
    rtnCode?: string | number;
  }):
    | { intent: PaymentIntentRecord; replayed: boolean }
    | { error: string } {
    const intent = [...this.paymentIntents.values()].find(
      row => row.merchantTradeNo === input.merchantTradeNo
    );
    if (!intent) {
      return { error: `Payment intent ${input.merchantTradeNo} not found` };
    }
    const nextStatus = webhookStatusFromRtnCode(input.rtnCode);
    if (intent.status === nextStatus || intent.status === 'paid') {
      return { intent, replayed: true };
    }
    const stamped = nowIso();
    const updated: PaymentIntentRecord = {
      ...intent,
      status: nextStatus,
      updatedAt: stamped,
    };
    this.paymentIntents.set(intent.id, updated);
    if (nextStatus === 'paid') {
      this.confirmOrder(intent.orderId);
    }
    return { intent: updated, replayed: false };
  }
}
