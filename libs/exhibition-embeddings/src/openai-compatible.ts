import { MAX_EMBEDDING_DIMENSIONS, type EmbeddingEnv } from './config';
import type { EmbeddingProvider, EmbeddingResult } from './types';

type OpenAIEmbeddingResponse = {
  model?: unknown;
  data?: Array<{ embedding?: unknown; index?: unknown }>;
};

function asFiniteNumbers(value: unknown): number[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  if (value.length > MAX_EMBEDDING_DIMENSIONS) return null;
  const values: number[] = [];
  for (const item of value) {
    const n = typeof item === 'number' ? item : Number(item);
    if (!Number.isFinite(n)) return null;
    values.push(n);
  }
  return values;
}

export class OpenAICompatibleEmbeddingProvider implements EmbeddingProvider {
  readonly name: EmbeddingEnv['provider'];
  readonly model: string;
  readonly dimensions: number | null;

  constructor(
    private readonly env: EmbeddingEnv,
    private readonly fetchImpl: typeof fetch = fetch
  ) {
    this.name = env.provider;
    this.model = env.model;
    this.dimensions = env.dimensions;
  }

  async embed(texts: string[]): Promise<EmbeddingResult[]> {
    const input = texts.map(text => text.trim()).filter(Boolean);
    if (input.length === 0) return [];

    const body: Record<string, unknown> = {
      model: this.env.model,
      input,
    };
    if (this.env.dimensions) {
      body.dimensions = this.env.dimensions;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.env.timeoutMs);
    let response: Response;
    try {
      response = await this.fetchImpl(`${this.env.baseUrl}/embeddings`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${this.env.apiKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      throw new Error(`Embedding provider HTTP ${response.status}`);
    }

    const payload = (await response.json()) as OpenAIEmbeddingResponse;
    const rows = Array.isArray(payload.data) ? payload.data : [];
    const byIndex = new Map<number, number[]>();
    for (const row of rows) {
      const values = asFiniteNumbers(row.embedding);
      if (!values) {
        throw new Error('Embedding provider returned an invalid vector');
      }
      const index =
        typeof row.index === 'number' && Number.isInteger(row.index)
          ? row.index
          : byIndex.size;
      byIndex.set(index, values);
    }

    const model =
      typeof payload.model === 'string' && payload.model.trim()
        ? payload.model.trim()
        : this.env.model;

    const results: EmbeddingResult[] = [];
    for (let i = 0; i < input.length; i += 1) {
      const values = byIndex.get(i);
      if (!values) {
        throw new Error('Embedding provider omitted a vector');
      }
      if (this.env.dimensions && values.length !== this.env.dimensions) {
        throw new Error('Embedding provider dimension mismatch');
      }
      results.push({
        model,
        dimensions: values.length,
        values,
      });
    }
    return results;
  }
}
