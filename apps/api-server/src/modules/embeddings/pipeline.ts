import {
  embeddingProviderFromEnv,
  toVectorLiteral,
  type EmbeddingProvider,
  type ExhibitionEmbeddingText,
} from '@nx-playground/exhibition-embeddings';

import {
  exhibitionEmbeddingContentHash,
  exhibitionEmbeddingText,
} from './document-text';

export type EmbeddingPipelineCounts = {
  written: number;
  unchanged: number;
  skipped: number;
  failed: number;
  configured: boolean;
};

const EMPTY_COUNTS: EmbeddingPipelineCounts = {
  written: 0,
  unchanged: 0,
  skipped: 0,
  failed: 0,
  configured: false,
};

const BACKFILL_BATCH = 32;

/** Prisma-compatible tagged SQL surface — avoids importing generated PrismaClient in unit tests. */
export type EmbeddingDb = {
  $queryRaw: (
    strings: TemplateStringsArray,
    ...values: unknown[]
  ) => Promise<unknown>;
  $executeRaw: (
    strings: TemplateStringsArray,
    ...values: unknown[]
  ) => Promise<unknown>;
};

type StaleRow = ExhibitionEmbeddingText & {
  storedHash: string | null;
  storedModel: string | null;
};

export async function upsertEventEmbedding(
  db: EmbeddingDb,
  doc: ExhibitionEmbeddingText,
  provider: EmbeddingProvider | null = embeddingProviderFromEnv()
): Promise<'written' | 'unchanged' | 'skipped' | 'failed'> {
  if (!provider) return 'skipped';
  const text = exhibitionEmbeddingText(doc);
  if (!text) return 'skipped';
  const contentHash = exhibitionEmbeddingContentHash(doc);

  try {
    const existing = (await db.$queryRaw`
      SELECT content_hash, model, embedding
      FROM event_embeddings
      WHERE event_id = ${doc.id}
      LIMIT 1
    `) as Array<{
      content_hash: string | null;
      model: string | null;
      embedding: unknown;
    }>;
    const [row] = existing;
    if (
      row?.embedding != null &&
      row.content_hash === contentHash &&
      row.model === provider.model
    ) {
      return 'unchanged';
    }

    const [result] = await provider.embed([text]);
    if (!result) return 'failed';
    const literal = toVectorLiteral(result.values);

    await db.$executeRaw`
      INSERT INTO event_embeddings (
        event_id, model, dimensions, content_hash, embedding, created_at, updated_at
      )
      VALUES (
        ${doc.id},
        ${result.model},
        ${result.dimensions},
        ${contentHash},
        CAST(${literal} AS vector),
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (event_id) DO UPDATE SET
        model = EXCLUDED.model,
        dimensions = EXCLUDED.dimensions,
        content_hash = EXCLUDED.content_hash,
        embedding = EXCLUDED.embedding,
        updated_at = CURRENT_TIMESTAMP
    `;
    return 'written';
  } catch {
    return 'failed';
  }
}

export function scheduleEventEmbedding(
  db: EmbeddingDb,
  doc: ExhibitionEmbeddingText
): void {
  void upsertEventEmbedding(db, doc).then(
    () => undefined,
    () => undefined
  );
}

export async function backfillExhibitionEmbeddings(
  db: EmbeddingDb,
  options: {
    limit?: number;
    provider?: EmbeddingProvider | null;
  } = {}
): Promise<EmbeddingPipelineCounts> {
  const provider =
    options.provider === undefined
      ? embeddingProviderFromEnv()
      : options.provider;
  if (!provider) {
    return { ...EMPTY_COUNTS };
  }

  const limit = Math.min(Math.max(options.limit ?? 200, 1), 1000);
  const stale = (await db.$queryRaw`
    SELECT
      e.id,
      e.title,
      e.description,
      e.location,
      e.tags,
      e."priceText" AS "priceText",
      e."contentHash" AS "contentHash",
      ee.content_hash AS "storedHash",
      ee.model AS "storedModel"
    FROM events e
    LEFT JOIN event_embeddings ee ON ee.event_id = e.id
    WHERE e.status = 'published'
      AND (
        ee.event_id IS NULL
        OR ee.embedding IS NULL
        OR ee.content_hash IS DISTINCT FROM e."contentHash"
        OR ee.model IS DISTINCT FROM ${provider.model}
      )
    ORDER BY e."updatedAt" DESC
    LIMIT ${limit}
  `) as StaleRow[];

  const counts: EmbeddingPipelineCounts = {
    written: 0,
    unchanged: 0,
    skipped: 0,
    failed: 0,
    configured: true,
  };

  for (let i = 0; i < stale.length; i += BACKFILL_BATCH) {
    const batch: StaleRow[] = stale.slice(i, i + BACKFILL_BATCH);
    const outcomes: Array<keyof Omit<EmbeddingPipelineCounts, 'configured'>> =
      await Promise.all(
        batch.map((row: StaleRow) => upsertEventEmbedding(db, row, provider))
      );
    for (const outcome of outcomes) {
      counts[outcome] += 1;
    }
  }

  return counts;
}
