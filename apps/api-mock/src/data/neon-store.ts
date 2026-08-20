/** Hobby persist tables (`event_stack_*`). Nest Prisma uses `users`/`events`/`orders` on the same Neon if shared. */
import { neon } from '@neondatabase/serverless';

import { eventsSeed, ordersSeed, usersSeed } from './seed.js';
import type { EventStackRepo } from './repo.js';
import type {
  CreateEventInput,
  CreateOrderInput,
  EventListResponse,
  EventRecord,
  OrderRecord,
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

function mapEvent(row: Record<string, unknown>): EventRecord {
  return {
    id: String(row.id),
    title: String(row.title),
    description: row.description == null ? undefined : String(row.description),
    location: row.location == null ? undefined : String(row.location),
    startDate: String(row.start_date),
    endDate: String(row.end_date),
    maxAttendees:
      row.max_attendees == null ? undefined : Number(row.max_attendees),
    status: String(row.status),
    formId: row.form_id == null ? undefined : String(row.form_id),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapOrder(row: Record<string, unknown>): OrderRecord {
  const raw = row.data;
  let data: Record<string, unknown> = {};
  if (typeof raw === 'string') {
    try {
      data = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      data = {};
    }
  } else if (raw && typeof raw === 'object') {
    data = raw as Record<string, unknown>;
  }
  return {
    id: String(row.id),
    eventId: String(row.event_id),
    userId: String(row.user_id),
    status: String(row.status),
    data,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export function createNeonStore(databaseUrl: string): EventStackRepo {
  const sql = neon(databaseUrl);
  let boot: Promise<void> | undefined;

  async function ready(): Promise<void> {
    boot ??= (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS event_stack_users (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL,
          name TEXT NOT NULL,
          role TEXT NOT NULL,
          status TEXT NOT NULL
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS event_stack_events (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          location TEXT,
          start_date TEXT NOT NULL,
          end_date TEXT NOT NULL,
          max_attendees INTEGER,
          status TEXT NOT NULL,
          form_id TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS event_stack_orders (
          id TEXT PRIMARY KEY,
          event_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          status TEXT NOT NULL,
          data TEXT NOT NULL DEFAULT '{}',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `;

      const stamped = nowIso();
      for (const user of usersSeed.users) {
        await sql`
          INSERT INTO event_stack_users (id, email, name, role, status)
          VALUES (${user.id}, ${user.email}, ${user.name}, ${user.role}, ${user.status})
          ON CONFLICT (id) DO NOTHING
        `;
      }
      for (const event of eventsSeed.events) {
        await sql`
          INSERT INTO event_stack_events (
            id, title, description, location, start_date, end_date,
            max_attendees, status, form_id, created_at, updated_at
          )
          VALUES (
            ${event.id}, ${event.title}, ${event.description ?? null},
            ${event.location ?? null}, ${event.startDate}, ${event.endDate},
            ${event.maxAttendees ?? null}, ${event.status}, ${event.formId ?? null},
            ${stamped}, ${stamped}
          )
          ON CONFLICT (id) DO NOTHING
        `;
      }
      for (const order of ordersSeed.orders) {
        await sql`
          INSERT INTO event_stack_orders (
            id, event_id, user_id, status, data, created_at, updated_at
          )
          VALUES (
            ${order.id}, ${order.eventId}, ${order.userId}, ${order.status},
            ${JSON.stringify(order.data)}, ${stamped}, ${stamped}
          )
          ON CONFLICT (id) DO NOTHING
        `;
      }
    })();
    return boot;
  }

  return {
    storage: 'postgres',
    ready,
    async listEvents(query) {
      await ready();
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const status = query.status;
      const rows = status
        ? ((await sql`
            SELECT * FROM event_stack_events
            WHERE status = ${status}
            ORDER BY created_at DESC
          `) as Record<string, unknown>[])
        : ((await sql`
            SELECT * FROM event_stack_events
            ORDER BY created_at DESC
          `) as Record<string, unknown>[]);
      const items = rows.map(mapEvent);
      const total = items.length;
      const start = (page - 1) * limit;
      return {
        items: items.slice(start, start + limit),
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      };
    },
    async getEvent(id) {
      await ready();
      const rows = (await sql`
        SELECT * FROM event_stack_events WHERE id = ${id} LIMIT 1
      `) as Record<string, unknown>[];
      return rows[0] ? mapEvent(rows[0]) : undefined;
    },
    async createEvent(input: CreateEventInput) {
      await ready();
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
      await sql`
        INSERT INTO event_stack_events (
          id, title, description, location, start_date, end_date,
          max_attendees, status, form_id, created_at, updated_at
        )
        VALUES (
          ${event.id}, ${event.title}, ${event.description ?? null},
          ${event.location ?? null}, ${event.startDate}, ${event.endDate},
          ${event.maxAttendees ?? null}, ${event.status}, ${event.formId ?? null},
          ${event.createdAt}, ${event.updatedAt}
        )
      `;
      return event;
    },
    async updateEvent(id, input: Partial<CreateEventInput>) {
      await ready();
      const existing = await this.getEvent(id);
      if (!existing) return undefined;
      const updated: EventRecord = {
        ...existing,
        ...input,
        updatedAt: nowIso(),
      };
      await sql`
        UPDATE event_stack_events SET
          title = ${updated.title},
          description = ${updated.description ?? null},
          location = ${updated.location ?? null},
          start_date = ${updated.startDate},
          end_date = ${updated.endDate},
          max_attendees = ${updated.maxAttendees ?? null},
          status = ${updated.status},
          form_id = ${updated.formId ?? null},
          updated_at = ${updated.updatedAt}
        WHERE id = ${id}
      `;
      return updated;
    },
    async deleteEvent(id) {
      await ready();
      const rows = (await sql`
        DELETE FROM event_stack_events WHERE id = ${id} RETURNING id
      `) as { id: string }[];
      return rows.length > 0;
    },
    async createOrder(input: CreateOrderInput) {
      await ready();
      const event = await this.getEvent(input.eventId);
      if (!event) return { error: `Event ${input.eventId} not found` };
      const userId = input.userId ?? DEMO_USER_ID;
      const users = (await sql`
        SELECT id FROM event_stack_users WHERE id = ${userId} LIMIT 1
      `) as { id: string }[];
      if (!users[0]) return { error: `User ${userId} not found` };
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
      await sql`
        INSERT INTO event_stack_orders (
          id, event_id, user_id, status, data, created_at, updated_at
        )
        VALUES (
          ${order.id}, ${order.eventId}, ${order.userId}, ${order.status},
          ${JSON.stringify(order.data)}, ${order.createdAt}, ${order.updatedAt}
        )
      `;
      return order;
    },
    async listOrders(query) {
      await ready();
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const userId = query.userId;
      const rows = userId
        ? ((await sql`
            SELECT * FROM event_stack_orders
            WHERE user_id = ${userId}
            ORDER BY created_at DESC
          `) as Record<string, unknown>[])
        : ((await sql`
            SELECT * FROM event_stack_orders
            ORDER BY created_at DESC
          `) as Record<string, unknown>[]);
      const items = rows.map(mapOrder);
      const total = items.length;
      const start = (page - 1) * limit;
      return {
        items: items.slice(start, start + limit),
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      };
    },
    async getOrder(id) {
      await ready();
      const rows = (await sql`
        SELECT * FROM event_stack_orders WHERE id = ${id} LIMIT 1
      `) as Record<string, unknown>[];
      return rows[0] ? mapOrder(rows[0]) : undefined;
    },
    async confirmOrder(id) {
      await ready();
      const existing = await this.getOrder(id);
      if (!existing) return undefined;
      const updated = {
        ...existing,
        status: 'confirmed',
        updatedAt: nowIso(),
      };
      await sql`
        UPDATE event_stack_orders
        SET status = ${updated.status}, updated_at = ${updated.updatedAt}
        WHERE id = ${id}
      `;
      return updated;
    },
  };
}
