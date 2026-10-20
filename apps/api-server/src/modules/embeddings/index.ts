export {
  DEFAULT_EMBEDDING_MODEL,
  DEFAULT_OPENAI_BASE_URL,
  clearEmbeddingQueryCache,
  createEmbedQuery,
  embedQueryFromEnv,
  embeddingEnvFrom,
  embeddingProviderFromEnv,
  hybridScore,
  isEmbeddingConfigured,
  toVectorLiteral,
  HYBRID_FTS_WEIGHT,
  HYBRID_VECTOR_WEIGHT,
  VECTOR_RECALL_MIN_COSINE,
} from '@nx-playground/exhibition-embeddings';
export type {
  EmbedQueryFn,
  EmbeddingProvider,
  EmbeddingResult,
  ExhibitionEmbeddingText,
} from '@nx-playground/exhibition-embeddings';
export {
  exhibitionEmbeddingContentHash,
  exhibitionEmbeddingText,
} from './document-text';
export {
  backfillExhibitionEmbeddings,
  scheduleEventEmbedding,
  upsertEventEmbedding,
} from './pipeline';
