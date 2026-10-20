import { embeddingEnvFrom, type EmbeddingEnv } from './config';
import { OpenAICompatibleEmbeddingProvider } from './openai-compatible';
import type { EmbeddingProvider, EmbeddingResult } from './types';

export type EmbedQueryFn = (text: string) => Promise<EmbeddingResult | null>;

export function embeddingProviderFromEnv(
  env: NodeJS.ProcessEnv = process.env,
  fetchImpl: typeof fetch = fetch
): EmbeddingProvider | null {
  const parsed = embeddingEnvFrom(env);
  if (!parsed) return null;
  return new OpenAICompatibleEmbeddingProvider(parsed, fetchImpl);
}

export function embeddingProviderFromConfig(
  config: EmbeddingEnv,
  fetchImpl: typeof fetch = fetch
): EmbeddingProvider {
  return new OpenAICompatibleEmbeddingProvider(config, fetchImpl);
}

const queryCache = new Map<
  string,
  { expiresAt: number; result: EmbeddingResult }
>();
const QUERY_CACHE_LIMIT = 128;
const QUERY_CACHE_TTL_MS = 10 * 60 * 1000;

function cacheKey(model: string, text: string): string {
  return `${model}:${text}`;
}

function readCache(key: string): EmbeddingResult | null {
  const hit = queryCache.get(key);
  if (!hit) return null;
  if (hit.expiresAt < Date.now()) {
    queryCache.delete(key);
    return null;
  }
  return hit.result;
}

function writeCache(key: string, result: EmbeddingResult): void {
  if (queryCache.size >= QUERY_CACHE_LIMIT) {
    const first = queryCache.keys().next().value;
    if (first) queryCache.delete(first);
  }
  queryCache.set(key, {
    expiresAt: Date.now() + QUERY_CACHE_TTL_MS,
    result,
  });
}

/** Test helper — production search never needs this. */
export function clearEmbeddingQueryCache(): void {
  queryCache.clear();
}

/**
 * Embed a search query. Returns null when unconfigured, empty, or the provider
 * fails — callers continue with FTS-only ranking.
 */
export async function embedQueryFromEnv(
  text: string,
  env: NodeJS.ProcessEnv = process.env,
  fetchImpl: typeof fetch = fetch
): Promise<EmbeddingResult | null> {
  const trimmed = text.normalize('NFKC').trim();
  if (!trimmed) return null;
  const provider = embeddingProviderFromEnv(env, fetchImpl);
  if (!provider) return null;

  const key = cacheKey(provider.model, trimmed);
  const cached = readCache(key);
  if (cached) return cached;

  try {
    const [result] = await provider.embed([trimmed]);
    if (!result) return null;
    writeCache(key, result);
    return result;
  } catch {
    return null;
  }
}

export function createEmbedQuery(
  provider: EmbeddingProvider | null
): EmbedQueryFn {
  if (!provider) {
    return async () => null;
  }
  return async text => {
    const trimmed = text.normalize('NFKC').trim();
    if (!trimmed) return null;
    try {
      const [result] = await provider.embed([trimmed]);
      return result ?? null;
    } catch {
      return null;
    }
  };
}
