export {
  embeddingEnvFrom,
  isEmbeddingConfigured,
  DEFAULT_EMBEDDING_MODEL,
  DEFAULT_OPENAI_BASE_URL,
} from './config';
export {
  exhibitionEmbeddingContentHash,
  exhibitionEmbeddingText,
} from './document-text';
export {
  backfillExhibitionEmbeddings,
  scheduleEventEmbedding,
  upsertEventEmbedding,
} from './pipeline';
export {
  clearEmbeddingQueryCache,
  createEmbedQuery,
  embedQueryFromEnv,
  embeddingProviderFromEnv,
} from './provider';
export type { EmbedQueryFn } from './provider';
export type {
  EmbeddingProvider,
  EmbeddingResult,
  ExhibitionEmbeddingText,
} from './types';
export {
  HYBRID_FTS_WEIGHT,
  HYBRID_VECTOR_WEIGHT,
  VECTOR_RECALL_MIN_COSINE,
  hybridScore,
  toVectorLiteral,
} from './vector';
