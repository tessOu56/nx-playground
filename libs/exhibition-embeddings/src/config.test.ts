import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { embeddingEnvFrom, isEmbeddingConfigured } from './config';

describe('embeddingEnvFrom', () => {
  it('returns null when unconfigured', () => {
    assert.equal(embeddingEnvFrom({}), null);
    assert.equal(embeddingEnvFrom({ EMBEDDING_PROVIDER: 'openai' }), null);
    assert.equal(
      embeddingEnvFrom({
        EMBEDDING_PROVIDER: 'disabled',
        EMBEDDING_API_KEY: 'sk-test',
      }),
      null
    );
    assert.equal(isEmbeddingConfigured({ EMBEDDING_API_KEY: 'sk-test' }), false);
  });

  it('reads openai with default base URL and no hard-coded key', () => {
    const env = embeddingEnvFrom({
      EMBEDDING_PROVIDER: 'openai',
      EMBEDDING_API_KEY: 'sk-live-from-env',
    });
    assert.deepEqual(env && { ...env, timeoutMs: env.timeoutMs }, {
      provider: 'openai',
      apiKey: 'sk-live-from-env',
      baseUrl: 'https://api.openai.com/v1',
      model: 'text-embedding-3-small',
      dimensions: null,
      timeoutMs: env?.timeoutMs,
    });
  });

  it('requires a base URL for openai-compatible providers', () => {
    assert.equal(
      embeddingEnvFrom({
        EMBEDDING_PROVIDER: 'openai-compatible',
        EMBEDDING_API_KEY: 'key',
      }),
      null
    );
    const env = embeddingEnvFrom({
      EMBEDDING_PROVIDER: 'openai-compatible',
      EMBEDDING_API_KEY: 'key',
      EMBEDDING_API_BASE_URL: 'http://127.0.0.1:11434/v1/',
      EMBEDDING_MODEL: 'nomic-embed-text',
      EMBEDDING_DIMENSIONS: '768',
    });
    assert.equal(env?.provider, 'openai-compatible');
    assert.equal(env?.baseUrl, 'http://127.0.0.1:11434/v1');
    assert.equal(env?.model, 'nomic-embed-text');
    assert.equal(env?.dimensions, 768);
  });

  it('ignores unknown providers', () => {
    assert.equal(
      embeddingEnvFrom({
        EMBEDDING_PROVIDER: 'some-vendor',
        EMBEDDING_API_KEY: 'key',
      }),
      null
    );
  });
});
