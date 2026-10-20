import {
  embedQueryFromEnv,
  type EmbeddingResult,
} from '@nx-playground/exhibition-embeddings';
import { rankDocuments } from './rank';
import { sampleDocumentById, sampleDocuments } from './sample';
import {
  getExhibitionSql,
  getExhibitionSqlById,
  searchExhibitionsSql,
  type QueryEmbedding,
} from './sql';
import type {
  ExhibitionDocument,
  ExhibitionSearchInput,
  ExhibitionSearchResult,
} from './types';

export function databaseUrl(): string {
  return process.env.DATABASE_URL?.trim() ?? '';
}

function sampleResult(input: ExhibitionSearchInput): ExhibitionSearchResult {
  return {
    source: 'sample',
    items: rankDocuments(sampleDocuments(), input),
  };
}

export type SearchExhibitionsDeps = {
  embedQuery?: (text: string) => Promise<QueryEmbedding | null>;
  searchSql?: typeof searchExhibitionsSql;
  exhibitionSql?: ReturnType<typeof getExhibitionSql>;
};

async function queryEmbeddingFor(
  keyword: string,
  deps?: SearchExhibitionsDeps
): Promise<EmbeddingResult | null> {
  const q = keyword.trim();
  if (!q) return null;
  const embed = deps?.embedQuery ?? embedQueryFromEnv;
  try {
    return (await embed(q)) ?? null;
  } catch {
    return null;
  }
}

export async function searchExhibitions(
  input: ExhibitionSearchInput,
  deps?: SearchExhibitionsDeps
): Promise<ExhibitionSearchResult> {
  if (!databaseUrl()) {
    return sampleResult(input);
  }
  const embedding = await queryEmbeddingFor(input.keyword, deps);
  const runSql = deps?.searchSql ?? searchExhibitionsSql;
  const sql = deps?.exhibitionSql ?? getExhibitionSql();
  try {
    const items = await runSql(input, sql, embedding);
    return { source: 'postgres', items };
  } catch {
    if (embedding) {
      try {
        const items = await runSql(input, sql, null);
        return { source: 'postgres', items };
      } catch {
        /* fall through to sample */
      }
    }
    return sampleResult(input);
  }
}

export async function getExhibitionById(
  id: string
): Promise<{ source: 'postgres' | 'sample'; item: ExhibitionDocument } | null> {
  const safeId = id.trim().slice(0, 128);
  if (!safeId) return null;
  if (databaseUrl()) {
    try {
      const item = await getExhibitionSqlById(safeId, getExhibitionSql());
      if (item) return { source: 'postgres', item };
    } catch {
      /* fall through to sample */
    }
  }
  const sample = sampleDocumentById(safeId);
  return sample ? { source: 'sample', item: sample } : null;
}
