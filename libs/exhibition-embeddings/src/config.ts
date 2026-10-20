export const DEFAULT_OPENAI_BASE_URL = 'https://api.openai.com/v1';
export const DEFAULT_EMBEDDING_MODEL = 'text-embedding-3-small';
export const DEFAULT_EMBEDDING_TIMEOUT_MS = 12_000;
export const MAX_EMBEDDING_DIMENSIONS = 4096;
export const MAX_EMBEDDING_INPUT_CHARS = 8_000;

export type EmbeddingProviderName = 'openai' | 'openai-compatible';

export type EmbeddingEnv = {
  provider: EmbeddingProviderName;
  apiKey: string;
  baseUrl: string;
  model: string;
  dimensions: number | null;
  timeoutMs: number;
};

function read(env: NodeJS.ProcessEnv, key: string): string {
  return env[key]?.trim() ?? '';
}

function parsePositiveInt(raw: string): number | null {
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isInteger(n) || n <= 0 || n > MAX_EMBEDDING_DIMENSIONS) {
    return null;
  }
  return n;
}

function parseTimeoutMs(raw: string): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1_000 || n > 60_000) {
    return DEFAULT_EMBEDDING_TIMEOUT_MS;
  }
  return Math.trunc(n);
}

function normalizeBaseUrl(raw: string): string {
  let url = raw;
  while (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  return url;
}

/**
 * Provider-agnostic embedding config. Returns null when unset, disabled, or
 * missing a key — callers must no-op instead of throwing.
 */
export function embeddingEnvFrom(
  env: NodeJS.ProcessEnv = process.env
): EmbeddingEnv | null {
  const providerRaw = read(env, 'EMBEDDING_PROVIDER').toLowerCase();
  if (
    !providerRaw ||
    providerRaw === 'none' ||
    providerRaw === 'disabled' ||
    providerRaw === 'off'
  ) {
    return null;
  }

  const apiKey = read(env, 'EMBEDDING_API_KEY');
  if (!apiKey) return null;

  if (providerRaw === 'openai') {
    return {
      provider: 'openai',
      apiKey,
      baseUrl: normalizeBaseUrl(
        read(env, 'EMBEDDING_API_BASE_URL') || DEFAULT_OPENAI_BASE_URL
      ),
      model: read(env, 'EMBEDDING_MODEL') || DEFAULT_EMBEDDING_MODEL,
      dimensions: parsePositiveInt(read(env, 'EMBEDDING_DIMENSIONS')),
      timeoutMs: parseTimeoutMs(read(env, 'EMBEDDING_TIMEOUT_MS')),
    };
  }

  if (providerRaw === 'openai-compatible') {
    const baseUrl = normalizeBaseUrl(read(env, 'EMBEDDING_API_BASE_URL'));
    if (!baseUrl) return null;
    return {
      provider: 'openai-compatible',
      apiKey,
      baseUrl,
      model: read(env, 'EMBEDDING_MODEL') || DEFAULT_EMBEDDING_MODEL,
      dimensions: parsePositiveInt(read(env, 'EMBEDDING_DIMENSIONS')),
      timeoutMs: parseTimeoutMs(read(env, 'EMBEDDING_TIMEOUT_MS')),
    };
  }

  return null;
}

export function isEmbeddingConfigured(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  return embeddingEnvFrom(env) !== null;
}
