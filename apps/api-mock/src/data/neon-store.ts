import { neon } from '@neondatabase/serverless';
import type {
  CreateEventInput,
  EventRecord,
} from '@nx-playground/api-fixtures';

import { eventsSeed, usersSeed } from './seed.js';
import type { EventStackRepo } from './repo.js';

function nowIso(): string {
  return new Date().toISOString();
}

function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return asStringArray(parsed);
    } catch {
      return [];
    }
  }
  return [];
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
    region:
      row.region == null
        ? undefined
        : (String(row.region) as EventRecord['region']),
    timezone: row.timezone == null ? undefined : String(row.timezone),
    source: row.source == null ? undefined : String(row.source),
    sourceUrl: row.source_url == null ? undefined : String(row.source_url),
    externalId: row.external_id == null ? undefined : String(row.external_id),
    contentHash: row.content_hash == null ? undefined : String(row.content_hash),
    tags: asStringArray(row.tags),
    priceText: row.price_text == null ? undefined : String(row.price_text),
    lastSeenAt: row.last_seen_at == null ? undefined : String(row.last_seen_at),
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
          region TEXT,
          timezone TEXT,
          source TEXT,
          source_url TEXT,
          external_id TEXT,
          content_hash TEXT,
          tags TEXT[] NOT NULL DEFAULT '{}',
          price_text TEXT,
          last_seen_at TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `;
      await sql`
        ALTER TABLE event_stack_events
          ADD COLUMN IF NOT EXISTS region TEXT,
          ADD COLUMN IF NOT EXISTS timezone TEXT,
          ADD COLUMN IF NOT EXISTS source TEXT,
          ADD COLUMN IF NOT EXISTS source_url TEXT,
          ADD COLUMN IF NOT EXISTS external_id TEXT,
          ADD COLUMN IF NOT EXISTS content_hash TEXT,
          ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
          ADD COLUMN IF NOT EXISTS price_text TEXT,
          ADD COLUMN IF NOT EXISTS last_seen_at TEXT
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
            max_attendees, status, form_id, region, timezone, source,
            source_url, external_id, content_hash, tags, price_text,
            last_seen_at, created_at, updated_at
          )
          VALUES (
            ${event.id}, ${event.title}, ${event.description ?? null},
            ${event.location ?? null}, ${event.startDate}, ${event.endDate},
            ${event.maxAttendees ?? null}, ${event.status}, ${event.formId ?? null},
            ${event.region ?? null}, ${event.timezone ?? null}, ${event.source ?? null},
            ${event.sourceUrl ?? null}, ${event.externalId ?? null},
            ${event.contentHash ?? null}, ${event.tags ?? []}, ${event.priceText ?? null},
            ${event.lastSeenAt ?? stamped}, ${stamped}, ${stamped}
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
      const region = query.region;
      const rows = (
        status && region
          ? await sql`
            SELECT * FROM event_stack_events
            WHERE status = ${status} AND region = ${region}
            ORDER BY created_at DESC
          `
          : status
            ? await sql`
            SELECT * FROM event_stack_events
            WHERE status = ${status}
            ORDER BY created_at DESC
          `
            : region
              ? await sql`
            SELECT * FROM event_stack_events
            WHERE region = ${region}
            ORDER BY created_at DESC
          `
              : await sql`
            SELECT * FROM event_stack_events
            ORDER BY created_at DESC
          `
      ) as Record<string, unknown>[];
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
      await sql`
        INSERT INTO event_stack_events (
          id, title, description, location, start_date, end_date,
          max_attendees, status, form_id, region, timezone, source,
          source_url, external_id, content_hash, tags, price_text,
          last_seen_at, created_at, updated_at
        )
        VALUES (
          ${event.id}, ${event.title}, ${event.description ?? null},
          ${event.location ?? null}, ${event.startDate}, ${event.endDate},
          ${event.maxAttendees ?? null}, ${event.status}, ${event.formId ?? null},
          ${event.region ?? null}, ${event.timezone ?? null}, ${event.source ?? null},
          ${event.sourceUrl ?? null}, ${event.externalId ?? null},
          ${event.contentHash ?? null}, ${event.tags ?? []}, ${event.priceText ?? null},
          ${event.lastSeenAt ?? null}, ${event.createdAt}, ${event.updatedAt}
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
  };
}
