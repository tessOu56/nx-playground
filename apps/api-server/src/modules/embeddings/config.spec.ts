import { embeddingEnvFrom, isEmbeddingConfigured } from './config';

describe('embeddingEnvFrom', () => {
  it('returns null when unconfigured', () => {
    expect(embeddingEnvFrom({})).toBeNull();
    expect(embeddingEnvFrom({ EMBEDDING_PROVIDER: 'openai' })).toBeNull();
    expect(
      embeddingEnvFrom({
        EMBEDDING_PROVIDER: 'disabled',
        EMBEDDING_API_KEY: 'sk-test',
      })
    ).toBeNull();
    expect(isEmbeddingConfigured({ EMBEDDING_API_KEY: 'sk-test' })).toBe(false);
  });

  it('reads openai with default base URL and no hard-coded key', () => {
    const env = embeddingEnvFrom({
      EMBEDDING_PROVIDER: 'openai',
      EMBEDDING_API_KEY: 'sk-live-from-env',
    });
    expect(env).toMatchObject({
      provider: 'openai',
      apiKey: 'sk-live-from-env',
      baseUrl: 'https://api.openai.com/v1',
      model: 'text-embedding-3-small',
      dimensions: null,
    });
  });

  it('requires a base URL for openai-compatible providers', () => {
    expect(
      embeddingEnvFrom({
        EMBEDDING_PROVIDER: 'openai-compatible',
        EMBEDDING_API_KEY: 'key',
      })
    ).toBeNull();
    const env = embeddingEnvFrom({
      EMBEDDING_PROVIDER: 'openai-compatible',
      EMBEDDING_API_KEY: 'key',
      EMBEDDING_API_BASE_URL: 'http://127.0.0.1:11434/v1/',
      EMBEDDING_MODEL: 'nomic-embed-text',
      EMBEDDING_DIMENSIONS: '768',
    });
    expect(env).toMatchObject({
      provider: 'openai-compatible',
      baseUrl: 'http://127.0.0.1:11434/v1',
      model: 'nomic-embed-text',
      dimensions: 768,
    });
  });

  it('ignores unknown providers', () => {
    expect(
      embeddingEnvFrom({
        EMBEDDING_PROVIDER: 'some-vendor',
        EMBEDDING_API_KEY: 'key',
      })
    ).toBeNull();
  });
});
