import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { OpenAICompatibleEmbeddingProvider } from './openai-compatible';
import {
  clearEmbeddingQueryCache,
  createEmbedQuery,
  embedQueryFromEnv,
  embeddingProviderFromEnv,
} from './provider';

describe('OpenAICompatibleEmbeddingProvider', () => {
  it('posts to /embeddings and maps vectors by index', async () => {
    let calledUrl = '';
    const fetchImpl = async (url: string | URL, init?: RequestInit) => {
      calledUrl = String(url);
      const body = JSON.parse(String(init?.body));
      assert.equal(body.model, 'text-embedding-3-small');
      assert.deepEqual(body.input, ['hello']);
      assert.equal(body.dimensions, undefined);
      assert.equal(
        (init?.headers as Record<string, string>).authorization,
        'Bearer sk-env'
      );
      return {
        ok: true,
        json: async () => ({
          model: 'text-embedding-3-small',
          data: [{ index: 0, embedding: [0.1, 0.2, 0.3] }],
        }),
      } as Response;
    };

    const provider = new OpenAICompatibleEmbeddingProvider(
      {
        provider: 'openai',
        apiKey: 'sk-env',
        baseUrl: 'https://api.openai.com/v1',
        model: 'text-embedding-3-small',
        dimensions: null,
        timeoutMs: 5_000,
      },
      fetchImpl as unknown as typeof fetch
    );
    const [result] = await provider.embed(['hello']);
    assert.equal(calledUrl, 'https://api.openai.com/v1/embeddings');
    assert.deepEqual(result, {
      model: 'text-embedding-3-small',
      dimensions: 3,
      values: [0.1, 0.2, 0.3],
    });
  });

  it('sends dimensions only when configured', async () => {
    const fetchImpl = async (_url: string | URL, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));
      assert.equal(body.dimensions, 1536);
      return {
        ok: true,
        json: async () => ({
          data: [{ index: 0, embedding: Array(1536).fill(0.01) }],
        }),
      } as Response;
    };
    const provider = new OpenAICompatibleEmbeddingProvider(
      {
        provider: 'openai',
        apiKey: 'sk-env',
        baseUrl: 'https://api.openai.com/v1',
        model: 'text-embedding-3-small',
        dimensions: 1536,
        timeoutMs: 5_000,
      },
      fetchImpl as unknown as typeof fetch
    );
    const [result] = await provider.embed(['x']);
    assert.equal(result.dimensions, 1536);
  });
});

describe('embeddingProviderFromEnv / embedQueryFromEnv', () => {
  afterEach(() => {
    clearEmbeddingQueryCache();
  });

  it('returns null without env and does not call fetch', async () => {
    let calls = 0;
    const fetchImpl = async () => {
      calls += 1;
      throw new Error('should not fetch');
    };
    assert.equal(
      embeddingProviderFromEnv({}, fetchImpl as unknown as typeof fetch),
      null
    );
    assert.equal(
      await embedQueryFromEnv('攝影', {}, fetchImpl as unknown as typeof fetch),
      null
    );
    assert.equal(calls, 0);
  });

  it('createEmbedQuery no-ops when the provider is null', async () => {
    const embed = createEmbedQuery(null);
    assert.equal(await embed('anything'), null);
  });

  it('swallows provider errors for query embedding', async () => {
    const fetchImpl = async () => {
      throw new Error('network');
    };
    const result = await embedQueryFromEnv(
      'design',
      {
        EMBEDDING_PROVIDER: 'openai',
        EMBEDDING_API_KEY: 'sk-env',
      },
      fetchImpl as unknown as typeof fetch
    );
    assert.equal(result, null);
  });
});
