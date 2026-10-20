export {
  embeddingEnvFrom,
  isEmbeddingConfigured,
  DEFAULT_EMBEDDING_MODEL,
  DEFAULT_OPENAI_BASE_URL,
  DEFAULT_EMBEDDING_TIMEOUT_MS,
  MAX_EMBEDDING_DIMENSIONS,
  MAX_EMBEDDING_INPUT_CHARS,
} from './config';
export type { EmbeddingEnv, EmbeddingProviderName } from './config';
export { OpenAICompatibleEmbeddingProvider } from './openai-compatible';
export {
  clearEmbeddingQueryCache,
  createEmbedQuery,
  embedQueryFromEnv,
  embeddingProviderFromConfig,
  embeddingProviderFromEnv,
} from './provider';
export type { EmbedQueryFn } from './provider';
export type {
  EmbeddingProvider,
  EmbeddingResult,
  EmbeddingVector,
  ExhibitionEmbeddingText,
} from './types';
export {
  HYBRID_FTS_WEIGHT,
  HYBRID_VECTOR_WEIGHT,
  VECTOR_RECALL_MIN_COSINE,
  hybridScore,
  toVectorLiteral,
} from './vector';
