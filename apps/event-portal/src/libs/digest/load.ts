import { neon } from '@neondatabase/serverless';
import { loadFixtureEvents } from '@nx-playground/api-fixtures';

import type { DigestCity, DigestExhibition } from './types';
import { DIGEST_CITIES } from './types';
import { digestWindow } from './window';

export type DigestCatalogSource = 'postgres' | 'sample';

export type DigestCatalog = {
  source: DigestCatalogSource;
  items: DigestExhibition[];
};

type SqlFn = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<Record<string, unknown>[]>;

function asCity(value: unknown): DigestCity | null {
  return value === 'TAIPEI' || value === 'TOKYO' ? value : null;
}

function asDate(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function toDigestExhibition(
  row: Record<string, unknown>
): DigestExhibition | null {
  const city = asCity(row.region ?? row.city);
  const startDate = asDate(row.startDate);
  const endDate = asDate(row.endDate);
  const createdAt = asDate(row.createdAt) ?? asDate(row.lastSeenAt) ?? startDate;
  const id = typeof row.id === 'string' ? row.id.trim() : '';
  const title = typeof row.title === 'string' ? row.title.trim() : '';
  if (!city || !startDate || !endDate || !createdAt || !id || !title) {
    return null;
  }
  return {
    id,
    title,
    city,
    startDate,
    endDate,
    createdAt,
    location: typeof row.location === 'string' ? row.location : null,
  };
}

export function sampleDigestExhibitions(): DigestExhibition[] {
  return loadFixtureEvents()
    .filter(event => {
      if (event.status === 'draft') return false;
      const data = event.data ?? {};
      const kind = data.kind;
      if (kind !== 'exhibition' && !event.id.startsWith('event_sample_')) {
        return false;
      }
      return DIGEST_CITIES.includes(event.region as DigestCity);
    })
    .map(event =>
      toDigestExhibition({
        id: event.id,
        title: event.title,
        region: event.region,
        startDate: event.startDate,
        endDate: event.endDate,
        createdAt: event.lastSeenAt ?? event.startDate,
        location: event.location ?? null,
      })
    )
    .filter((item): item is DigestExhibition => item !== null);
}

export function createDigestSql(databaseUrl: string): SqlFn {
  return neon(databaseUrl) as unknown as SqlFn;
}

export async function loadDigestExhibitionsSql(
  now: Date,
  sql: SqlFn
): Promise<DigestExhibition[]> {
  const window = digestWindow(now);
  const rows = await sql`
    SELECT
      id,
      title,
      location,
      "startDate",
      "endDate",
      region,
      "createdAt",
      "lastSeenAt"
    FROM events
    WHERE status = 'published'
      AND region::text IN ('TAIPEI', 'TOKYO')
      AND (
        ("startDate" >= ${window.weekStart} AND "startDate" < ${window.weekEnd})
        OR ("createdAt" >= ${window.lookbackStart} AND "createdAt" <= ${window.weekStart})
      )
    ORDER BY "startDate" ASC
    LIMIT 80
  `;
  return rows
    .map(toDigestExhibition)
    .filter((item): item is DigestExhibition => item !== null);
}

export async function loadDigestCatalog(
  now: Date,
  databaseUrl = process.env.DATABASE_URL
): Promise<DigestCatalog> {
  const url = databaseUrl?.trim() ?? '';
  if (!url) {
    return { source: 'sample', items: sampleDigestExhibitions() };
  }
  try {
    const items = await loadDigestExhibitionsSql(now, createDigestSql(url));
    return { source: 'postgres', items };
  } catch {
    return { source: 'sample', items: sampleDigestExhibitions() };
  }
}
