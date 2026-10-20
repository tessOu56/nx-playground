import { OpenAICompatibleEmbeddingProvider } from './openai-compatible';
import {
  clearEmbeddingQueryCache,
  createEmbedQuery,
  embedQueryFromEnv,
  embeddingProviderFromEnv,
} from './provider';

describe('OpenAICompatibleEmbeddingProvider', () => {
  it('posts to /embeddings and maps vectors by index', async () => {
    const fetchImpl = jest.fn(async (url: string, init?: RequestInit) => {
      expect(url).toBe('https://api.openai.com/v1/embeddings');
      const body = JSON.parse(String(init?.body));
      expect(body.model).toBe('text-embedding-3-small');
      expect(body.input).toEqual(['hello']);
      expect(body.dimensions).toBeUndefined();
      expect((init?.headers as Record<string, string>).authorization).toBe(
        'Bearer sk-env'
      );
      return {
        ok: true,
        json: async () => ({
          model: 'text-embedding-3-small',
          data: [{ index: 0, embedding: [0.1, 0.2, 0.3] }],
        }),
      } as Response;
    });

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
    expect(result).toEqual({
      model: 'text-embedding-3-small',
      dimensions: 3,
      values: [0.1, 0.2, 0.3],
    });
  });

  it('send dimensions only when configured', async () => {
    const fetchImpl = jest.fn(async (_url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));
      expect(body.dimensions).toBe(1536);
      return {
        ok: true,
        json: async () => ({
          data: [{ index: 0, embedding: Array(1536).fill(0.01) }],
        }),
      } as Response;
    });
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
    expect(result.dimensions).toBe(1536);
  });
});

describe('embeddingProviderFromEnv / embedQueryFromEnv', () => {
  afterEach(() => {
    clearEmbeddingQueryCache();
  });

  it('returns null without env and does not call fetch', async () => {
    const fetchImpl = jest.fn();
    expect(
      embeddingProviderFromEnv({}, fetchImpl as unknown as typeof fetch)
    ).toBeNull();
    expect(
      await embedQueryFromEnv('攝影', {}, fetchImpl as unknown as typeof fetch)
    ).toBeNull();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('createEmbedQuery no-ops when the provider is null', async () => {
    const embed = createEmbedQuery(null);
    expect(await embed('anything')).toBeNull();
  });

  it('swallows provider errors for query embedding', async () => {
    const fetchImpl = jest.fn(async () => {
      throw new Error('network');
    });
    const result = await embedQueryFromEnv(
      'design',
      {
        EMBEDDING_PROVIDER: 'openai',
        EMBEDDING_API_KEY: 'sk-env',
      },
      fetchImpl as unknown as typeof fetch
    );
    expect(result).toBeNull();
  });
});
