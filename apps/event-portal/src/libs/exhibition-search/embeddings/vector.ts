import { MAX_EMBEDDING_DIMENSIONS } from './config';

/** pgvector text form: '[0.1,0.2,...]'. Rejects non-finite values. */
export function toVectorLiteral(values: number[]): string {
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error('Embedding vector is empty');
  }
  if (values.length > MAX_EMBEDDING_DIMENSIONS) {
    throw new Error('Embedding vector is too large');
  }
  const parts: string[] = [];
  for (const value of values) {
    if (!Number.isFinite(value)) {
      throw new Error('Embedding vector has a non-finite value');
    }
    parts.push(Number(value.toFixed(8)).toString());
  }
  return `[${parts.join(',')}]`;
}

export const HYBRID_FTS_WEIGHT = 0.7;
export const HYBRID_VECTOR_WEIGHT = 0.3;
export const VECTOR_RECALL_MIN_COSINE = 0.28;

export function hybridScore(
  ftsRank: number,
  cosineSimilarity: number | null
): number {
  const fts = Number.isFinite(ftsRank) ? Math.max(0, ftsRank) : 0;
  if (cosineSimilarity == null || !Number.isFinite(cosineSimilarity)) {
    return fts;
  }
  const semantic = Math.max(0, cosineSimilarity);
  return HYBRID_FTS_WEIGHT * fts + HYBRID_VECTOR_WEIGHT * semantic;
}
