import { neon } from '@neondatabase/serverless';

import {
  HYBRID_FTS_WEIGHT,
  HYBRID_VECTOR_WEIGHT,
  VECTOR_RECALL_MIN_COSINE,
  toVectorLiteral,
  type EmbeddingResult,
} from '@nx-playground/exhibition-embeddings';
import { publicHttpsUrl } from './https-url';
import type {
  ExhibitionDocument,
  ExhibitionHit,
  ExhibitionRegion,
  ExhibitionSearchInput,
} from './types';

type SqlFn = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<Record<string, unknown>[]>;

let cachedSql: SqlFn | undefined;
let cachedUrl: string | undefined;

export function createExhibitionSql(databaseUrl: string): SqlFn {
  return neon(databaseUrl) as unknown as SqlFn;
}

export function getExhibitionSql(
  databaseUrl = process.env.DATABASE_URL
): SqlFn {
  const url = databaseUrl?.trim();
  if (!url) {
    throw new Error('DATABASE_URL is not set');
  }
  if (cachedSql && cachedUrl === url) return cachedSql;
  cachedSql = createExhibitionSql(url);
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

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

export function mapExhibitionRow(
  row: Record<string, unknown>
): ExhibitionDocument {
  const data = asRecord(row.data);
  const image = publicHttpsUrl(row.imageUrl) ?? publicHttpsUrl(data.image);
  const venue = asRecord(data.venue);
  return {
    id: String(row.id),
    title: String(row.title),
    description: row.description == null ? null : String(row.description),
    location: row.location == null ? null : String(row.location),
    startDate: asDate(row.startDate),
    endDate: asDate(row.endDate),
    timezone: row.timezone == null ? null : String(row.timezone),
    priceText: row.priceText == null ? null : String(row.priceText),
    region:
      row.region === 'TOKYO' || row.region === 'TAIPEI' ? row.region : null,
    sourceUrl: publicHttpsUrl(row.sourceUrl),
    source: row.source == null ? null : String(row.source),
    tags: asTags(row.tags),
    imageUrl: image,
    category:
      typeof row.category === 'string'
        ? row.category
        : typeof data.category === 'string'
        ? data.category
        : null,
    organizerName: typeof data.organizer === 'string' ? data.organizer : null,
    venueHint: typeof venue.transport === 'string' ? venue.transport : null,
    status: String(row.status ?? 'published'),
    sample: data.sample === true || row.source === 'sample',
    data,
    createdAt: row.createdAt ? asDate(row.createdAt) : undefined,
    updatedAt: row.updatedAt ? asDate(row.updatedAt) : undefined,
  };
}

function likePattern(keyword: string): string {
  const compact = keyword
    .replace(/[%_\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return compact ? `%${compact}%` : '';
}

function toHits(rows: Record<string, unknown>[]): ExhibitionHit[] {
  return rows.map(row => ({
    ...mapExhibitionRow(row),
    rank: Number(row.rank ?? 0),
  }));
}

export type QueryEmbedding = Pick<
  EmbeddingResult,
  'model' | 'dimensions' | 'values'
>;

function vectorLiteral(
  embedding: QueryEmbedding | null | undefined
): string | null {
  if (!embedding?.values?.length) return null;
  try {
    return toVectorLiteral(embedding.values);
  } catch {
    return null;
  }
}

export async function searchExhibitionsSql(
  input: ExhibitionSearchInput,
  sql: SqlFn,
  queryEmbedding?: QueryEmbedding | null
): Promise<ExhibitionHit[]> {
  const limit = Math.min(Math.max(input.limit ?? 20, 1), 50);
  const keyword = input.keyword.trim().slice(0, 80);
  const like = likePattern(keyword);
  const category = (input.category?.trim() ?? '').slice(0, 80);
  const now = input.now ?? new Date();
  const embedding = keyword ? queryEmbedding ?? null : null;

  if (input.windows) {
    const regions: ExhibitionRegion[] = input.region
      ? [input.region]
      : ['TAIPEI', 'TOKYO'];
    const batches = await Promise.all(
      regions.map(region => {
        const window = input.windows?.[region];
        if (!window) return Promise.resolve([] as ExhibitionHit[]);
        return queryWindow(sql, {
          region,
          from: window.start,
          to: window.end,
          keyword,
          like,
          category,
          limit,
          embedding,
        });
      })
    );
    const byId = new Map<string, ExhibitionHit>();
    for (const event of batches.flat()) {
      const previous = byId.get(event.id);
      if (!previous || event.rank > previous.rank) byId.set(event.id, event);
    }
    return [...byId.values()]
      .sort(
        (a, b) =>
          b.rank - a.rank || a.startDate.getTime() - b.startDate.getTime()
      )
      .slice(0, limit);
  }

  return queryDateMode(sql, {
    region: input.region ?? '',
    dateMode: input.dateMode ?? 'all',
    keyword,
    like,
    category,
    now,
    limit,
    embedding,
  });
}

type SharedQueryArgs = {
  keyword: string;
  like: string;
  category: string;
  limit: number;
  embedding: QueryEmbedding | null;
};

async function queryWindow(
  sql: SqlFn,
  args: SharedQueryArgs & {
    region: ExhibitionRegion;
    from: Date;
    to: Date;
  }
): Promise<ExhibitionHit[]> {
  const vec = vectorLiteral(args.embedding);
  if (vec && args.embedding) {
    const rows = await sql`
      SELECT
        events.id,
        events.title,
        events.description,
        events.location,
        events."startDate",
        events."endDate",
        events.timezone,
        events."priceText",
        events.region,
        events."sourceUrl",
        events.source,
        events.tags,
        events.status,
        events.data,
        events.data->>'image' AS "imageUrl",
        events.data->>'category' AS category,
        events."createdAt",
        events."updatedAt",
        (
          ${HYBRID_FTS_WEIGHT} * (
            CASE WHEN ${args.keyword} = '' THEN 0
            ELSE GREATEST(
              ts_rank_cd(events.search_tsv, plainto_tsquery('simple', exhibition_search_tokens(${args.keyword}))),
              similarity(events.title, ${args.keyword}),
              similarity(COALESCE(events.location, ''), ${args.keyword}) * 0.7,
              similarity(array_to_string(events.tags, ' '), ${args.keyword}) * 0.6
            )
            END
          )
          + ${HYBRID_VECTOR_WEIGHT} * COALESCE(
            1 - (ee.embedding <=> CAST(${vec} AS vector)),
            0
          )
        ) AS rank
      FROM events
      LEFT JOIN event_embeddings ee
        ON ee.event_id = events.id
       AND ee.embedding IS NOT NULL
       AND ee.model = ${args.embedding.model}
       AND ee.dimensions = ${args.embedding.dimensions}
      WHERE events.status = 'published'
        AND events.region::text = ${args.region}
        AND events."endDate" >= ${args.from}
        AND events."startDate" <= ${args.to}
        AND (
          ${args.category} = ''
          OR COALESCE(events.data->>'category', '') = ${args.category}
          OR ${args.category} = ANY(events.tags)
        )
        AND (
          ${args.keyword} = ''
          OR events.search_tsv @@ plainto_tsquery('simple', exhibition_search_tokens(${args.keyword}))
          OR events.title ILIKE ${args.like}
          OR COALESCE(events.location, '') ILIKE ${args.like}
          OR array_to_string(events.tags, ' ') ILIKE ${args.like}
          OR similarity(events.title, ${args.keyword}) >= 0.12
          OR similarity(COALESCE(events.location, ''), ${args.keyword}) >= 0.12
          OR similarity(array_to_string(events.tags, ' '), ${args.keyword}) >= 0.12
          OR (
            ee.embedding IS NOT NULL
            AND 1 - (ee.embedding <=> CAST(${vec} AS vector)) >= ${VECTOR_RECALL_MIN_COSINE}
          )
        )
      ORDER BY rank DESC, events."startDate" ASC
      LIMIT ${args.limit}
    `;
    return toHits(rows);
  }

  const rows = await sql`
    SELECT
      id,
      title,
      description,
      location,
      "startDate",
      "endDate",
      timezone,
      "priceText",
      region,
      "sourceUrl",
      source,
      tags,
      status,
      data,
      data->>'image' AS "imageUrl",
      data->>'category' AS category,
      "createdAt",
      "updatedAt",
      (
        CASE WHEN ${args.keyword} = '' THEN 0
        ELSE GREATEST(
          ts_rank_cd(search_tsv, plainto_tsquery('simple', exhibition_search_tokens(${args.keyword}))),
          similarity(title, ${args.keyword}),
          similarity(COALESCE(location, ''), ${args.keyword}) * 0.7,
          similarity(array_to_string(tags, ' '), ${args.keyword}) * 0.6
        )
        END
      ) AS rank
    FROM events
    WHERE status = 'published'
      AND region::text = ${args.region}
      AND "endDate" >= ${args.from}
      AND "startDate" <= ${args.to}
      AND (
        ${args.category} = ''
        OR COALESCE(data->>'category', '') = ${args.category}
        OR ${args.category} = ANY(tags)
      )
      AND (
        ${args.keyword} = ''
        OR search_tsv @@ plainto_tsquery('simple', exhibition_search_tokens(${args.keyword}))
        OR title ILIKE ${args.like}
        OR COALESCE(location, '') ILIKE ${args.like}
        OR array_to_string(tags, ' ') ILIKE ${args.like}
        OR similarity(title, ${args.keyword}) >= 0.12
        OR similarity(COALESCE(location, ''), ${args.keyword}) >= 0.12
        OR similarity(array_to_string(tags, ' '), ${args.keyword}) >= 0.12
      )
    ORDER BY rank DESC, "startDate" ASC
    LIMIT ${args.limit}
  `;
  return toHits(rows);
}

async function queryDateMode(
  sql: SqlFn,
  args: SharedQueryArgs & {
    region: string;
    dateMode: string;
    now: Date;
  }
): Promise<ExhibitionHit[]> {
  const vec = vectorLiteral(args.embedding);
  if (vec && args.embedding) {
    const rows = await sql`
      SELECT
        events.id,
        events.title,
        events.description,
        events.location,
        events."startDate",
        events."endDate",
        events.timezone,
        events."priceText",
        events.region,
        events."sourceUrl",
        events.source,
        events.tags,
        events.status,
        events.data,
        events.data->>'image' AS "imageUrl",
        events.data->>'category' AS category,
        events."createdAt",
        events."updatedAt",
        (
          ${HYBRID_FTS_WEIGHT} * (
            CASE WHEN ${args.keyword} = '' THEN 0
            ELSE GREATEST(
              ts_rank_cd(events.search_tsv, plainto_tsquery('simple', exhibition_search_tokens(${args.keyword}))),
              similarity(events.title, ${args.keyword}),
              similarity(COALESCE(events.location, ''), ${args.keyword}) * 0.7,
              similarity(array_to_string(events.tags, ' '), ${args.keyword}) * 0.6
            )
            END
          )
          + ${HYBRID_VECTOR_WEIGHT} * COALESCE(
            1 - (ee.embedding <=> CAST(${vec} AS vector)),
            0
          )
        ) AS rank
      FROM events
      LEFT JOIN event_embeddings ee
        ON ee.event_id = events.id
       AND ee.embedding IS NOT NULL
       AND ee.model = ${args.embedding.model}
       AND ee.dimensions = ${args.embedding.dimensions}
      WHERE events.status = 'published'
        AND (${args.region} = '' OR events.region::text = ${args.region})
        AND (
          ${args.dateMode} = 'all'
          OR (${args.dateMode} = 'now' AND events."startDate" <= ${args.now} AND events."endDate" >= ${args.now})
          OR (${args.dateMode} = 'upcoming' AND events."startDate" > ${args.now})
          OR (${args.dateMode} = 'past' AND events."endDate" < ${args.now})
        )
        AND (
          ${args.category} = ''
          OR COALESCE(events.data->>'category', '') = ${args.category}
          OR ${args.category} = ANY(events.tags)
        )
        AND (
          ${args.keyword} = ''
          OR events.search_tsv @@ plainto_tsquery('simple', exhibition_search_tokens(${args.keyword}))
          OR events.title ILIKE ${args.like}
          OR COALESCE(events.location, '') ILIKE ${args.like}
          OR array_to_string(events.tags, ' ') ILIKE ${args.like}
          OR similarity(events.title, ${args.keyword}) >= 0.12
          OR similarity(COALESCE(events.location, ''), ${args.keyword}) >= 0.12
          OR similarity(array_to_string(events.tags, ' '), ${args.keyword}) >= 0.12
          OR (
            ee.embedding IS NOT NULL
            AND 1 - (ee.embedding <=> CAST(${vec} AS vector)) >= ${VECTOR_RECALL_MIN_COSINE}
          )
        )
      ORDER BY rank DESC, events."startDate" ASC
      LIMIT ${args.limit}
    `;
    return toHits(rows);
  }

  const rows = await sql`
    SELECT
      id,
      title,
      description,
      location,
      "startDate",
      "endDate",
      timezone,
      "priceText",
      region,
      "sourceUrl",
      source,
      tags,
      status,
      data,
      data->>'image' AS "imageUrl",
      data->>'category' AS category,
      "createdAt",
      "updatedAt",
      (
        CASE WHEN ${args.keyword} = '' THEN 0
        ELSE GREATEST(
          ts_rank_cd(search_tsv, plainto_tsquery('simple', exhibition_search_tokens(${args.keyword}))),
          similarity(title, ${args.keyword}),
          similarity(COALESCE(location, ''), ${args.keyword}) * 0.7,
          similarity(array_to_string(tags, ' '), ${args.keyword}) * 0.6
        )
        END
      ) AS rank
    FROM events
    WHERE status = 'published'
      AND (${args.region} = '' OR region::text = ${args.region})
      AND (
        ${args.dateMode} = 'all'
        OR (${args.dateMode} = 'now' AND "startDate" <= ${args.now} AND "endDate" >= ${args.now})
        OR (${args.dateMode} = 'upcoming' AND "startDate" > ${args.now})
        OR (${args.dateMode} = 'past' AND "endDate" < ${args.now})
      )
      AND (
        ${args.category} = ''
        OR COALESCE(data->>'category', '') = ${args.category}
        OR ${args.category} = ANY(tags)
      )
      AND (
        ${args.keyword} = ''
        OR search_tsv @@ plainto_tsquery('simple', exhibition_search_tokens(${args.keyword}))
        OR title ILIKE ${args.like}
        OR COALESCE(location, '') ILIKE ${args.like}
        OR array_to_string(tags, ' ') ILIKE ${args.like}
        OR similarity(title, ${args.keyword}) >= 0.12
        OR similarity(COALESCE(location, ''), ${args.keyword}) >= 0.12
        OR similarity(array_to_string(tags, ' '), ${args.keyword}) >= 0.12
      )
    ORDER BY rank DESC, "startDate" ASC
    LIMIT ${args.limit}
  `;
  return toHits(rows);
}

export async function getExhibitionSqlById(
  id: string,
  sql: SqlFn
): Promise<ExhibitionDocument | null> {
  const safeId = id.trim().slice(0, 128);
  if (!safeId) return null;
  const rows = await sql`
    SELECT
      id,
      title,
      description,
      location,
      "startDate",
      "endDate",
      timezone,
      "priceText",
      region,
      "sourceUrl",
      source,
      tags,
      status,
      data,
      data->>'image' AS "imageUrl",
      data->>'category' AS category,
      "createdAt",
      "updatedAt"
    FROM events
    WHERE id = ${safeId}
      AND status = 'published'
    LIMIT 1
  `;
  const [row] = rows;
  return row ? mapExhibitionRow(row) : null;
}
