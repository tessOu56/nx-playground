import { neon } from '@neondatabase/serverless';

import { publicHttpsUrl } from '../../exhibition-search/https-url';
import type { ExhibitionRegion, UtcRange } from './time-window';

export type CatalogEvent = {
  id: string;
  title: string;
  location: string | null;
  startDate: Date;
  endDate: Date;
  timezone: string | null;
  priceText: string | null;
  region: ExhibitionRegion | null;
  sourceUrl: string | null;
  tags: string[];
  imageUrl: string | null;
  rank: number;
};

export type CatalogSearchInput = {
  region?: ExhibitionRegion;
  keyword: string;
  windows: Partial<Record<ExhibitionRegion, UtcRange>>;
  limit?: number;
};

type SqlFn = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<Record<string, unknown>[]>;

let cachedSql: SqlFn | undefined;
let cachedUrl: string | undefined;

export function createCatalogSql(databaseUrl: string): SqlFn {
  return neon(databaseUrl) as unknown as SqlFn;
}

export function getCatalogSql(databaseUrl = process.env.DATABASE_URL): SqlFn {
  const url = databaseUrl?.trim();
  if (!url) {
    throw new Error('DATABASE_URL is not set');
  }
  if (cachedSql && cachedUrl === url) return cachedSql;
  cachedSql = createCatalogSql(url);
  cachedUrl = url;
  return cachedSql;
}

function asDate(value: unknown): Date {
  if (value instanceof Date) return value;
  return new Date(String(value));
}

function asTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }
  return [];
}

function mapRow(row: Record<string, unknown>): CatalogEvent {
  return {
    id: String(row.id),
    title: String(row.title),
    location: row.location == null ? null : String(row.location),
    startDate: asDate(row.startDate),
    endDate: asDate(row.endDate),
    timezone: row.timezone == null ? null : String(row.timezone),
    priceText: row.priceText == null ? null : String(row.priceText),
    region: row.region === 'TOKYO' || row.region === 'TAIPEI' ? row.region : null,
    sourceUrl: publicHttpsUrl(row.sourceUrl),
    tags: asTags(row.tags),
    imageUrl: publicHttpsUrl(row.imageUrl),
    rank: Number(row.rank ?? 0),
  };
}

async function searchRegion(
  sql: SqlFn,
  region: ExhibitionRegion,
  window: UtcRange,
  keyword: string,
  limit: number
): Promise<CatalogEvent[]> {
  const like = keyword ? `%${keyword}%` : '';
  const rows = await sql`
    SELECT
      id,
      title,
      location,
      "startDate",
      "endDate",
      timezone,
      "priceText",
      region,
      "sourceUrl",
      tags,
      data->>'image' AS "imageUrl",
      GREATEST(
        similarity(title, ${keyword}),
        similarity(COALESCE(location, ''), ${keyword}),
        similarity(array_to_string(tags, ' '), ${keyword})
      ) AS rank
    FROM events
    WHERE status = 'published'
      AND region::text = ${region}
      AND "endDate" >= ${window.start}
      AND "startDate" <= ${window.end}
      AND (
        ${keyword} = ''
        OR title ILIKE ${like}
        OR COALESCE(location, '') ILIKE ${like}
        OR array_to_string(tags, ' ') ILIKE ${like}
        OR similarity(title, ${keyword}) >= 0.12
        OR similarity(COALESCE(location, ''), ${keyword}) >= 0.12
        OR similarity(array_to_string(tags, ' '), ${keyword}) >= 0.12
      )
    ORDER BY rank DESC, "startDate" ASC
    LIMIT ${limit}
  `;
  return rows.map(mapRow);
}

export async function searchCatalog(
  input: CatalogSearchInput,
  sql: SqlFn = getCatalogSql()
): Promise<CatalogEvent[]> {
  const limit = Math.min(Math.max(input.limit ?? 10, 1), 10);
  const regions: ExhibitionRegion[] = input.region
    ? [input.region]
    : ['TAIPEI', 'TOKYO'];
  const keyword = input.keyword.trim();
  const batches = await Promise.all(
    regions.map(region => {
      const window = input.windows[region];
      if (!window) return Promise.resolve([] as CatalogEvent[]);
      return searchRegion(sql, region, window, keyword, limit);
    })
  );
  const byId = new Map<string, CatalogEvent>();
  for (const event of batches.flat()) {
    const previous = byId.get(event.id);
    if (!previous || event.rank > previous.rank) {
      byId.set(event.id, event);
    }
  }
  return [...byId.values()]
    .sort((a, b) => b.rank - a.rank || a.startDate.getTime() - b.startDate.getTime())
    .slice(0, limit);
}
