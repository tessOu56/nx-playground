import { rankDocuments } from './rank';
import { sampleDocumentById, sampleDocuments } from './sample';
import {
  getExhibitionSql,
  getExhibitionSqlById,
  searchExhibitionsSql,
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

export async function searchExhibitions(
  input: ExhibitionSearchInput
): Promise<ExhibitionSearchResult> {
  if (!databaseUrl()) {
    return sampleResult(input);
  }
  try {
    const items = await searchExhibitionsSql(input, getExhibitionSql());
    return { source: 'postgres', items };
  } catch {
    return sampleResult(input);
  }
}

export async function getExhibitionById(
  id: string
): Promise<{ source: 'postgres' | 'sample'; item: ExhibitionDocument } | null> {
  if (databaseUrl()) {
    try {
      const item = await getExhibitionSqlById(id, getExhibitionSql());
      if (item) return { source: 'postgres', item };
    } catch {
      /* fall through to sample */
    }
  }
  const sample = sampleDocumentById(id);
  return sample ? { source: 'sample', item: sample } : null;
}
