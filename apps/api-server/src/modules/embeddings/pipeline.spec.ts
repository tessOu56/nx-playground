import { backfillExhibitionEmbeddings, upsertEventEmbedding } from './pipeline';
import type { EmbeddingProvider } from './types';

function fakeProvider(impl: EmbeddingProvider['embed']): EmbeddingProvider {
  return {
    name: 'openai',
    model: 'text-embedding-3-small',
    dimensions: 3,
    embed: impl,
  };
}

describe('upsertEventEmbedding', () => {
  it('skips when no provider is configured', async () => {
    const db = {
      $queryRaw: jest.fn(),
      $executeRaw: jest.fn(),
    };
    await expect(
      upsertEventEmbedding(db as never, { id: 'evt', title: '攝影展' }, null)
    ).resolves.toBe('skipped');
    expect(db.$queryRaw).not.toHaveBeenCalled();
    expect(db.$executeRaw).not.toHaveBeenCalled();
  });

  it('skips the provider when content hash and model already match', async () => {
    const embed = jest.fn();
    const db = {
      $queryRaw: jest.fn(async () => [
        {
          content_hash: 'same',
          model: 'text-embedding-3-small',
          embedding: '[0.1,0.2,0.3]',
        },
      ]),
      $executeRaw: jest.fn(),
    };
    await expect(
      upsertEventEmbedding(
        db as never,
        { id: 'evt', title: '攝影展', contentHash: 'same' },
        fakeProvider(embed)
      )
    ).resolves.toBe('unchanged');
    expect(embed).not.toHaveBeenCalled();
    expect(db.$executeRaw).not.toHaveBeenCalled();
  });

  it('writes a CAST vector when the provider returns values', async () => {
    const embed = jest.fn(async () => [
      {
        model: 'text-embedding-3-small',
        dimensions: 3,
        values: [0.25, 0.5, 0.75],
      },
    ]);
    const db = {
      $queryRaw: jest.fn(async () => []),
      $executeRaw: jest.fn(async () => 1),
    };
    await expect(
      upsertEventEmbedding(
        db as never,
        { id: 'evt', title: '攝影展', contentHash: 'new-hash' },
        fakeProvider(embed)
      )
    ).resolves.toBe('written');
    expect(embed).toHaveBeenCalledTimes(1);
    expect(db.$executeRaw).toHaveBeenCalledTimes(1);
  });

  it('returns failed when embed throws, without raising', async () => {
    const db = {
      $queryRaw: jest.fn(async () => []),
      $executeRaw: jest.fn(),
    };
    await expect(
      upsertEventEmbedding(
        db as never,
        { id: 'evt', title: '攝影展' },
        fakeProvider(async () => {
          throw new Error('quota');
        })
      )
    ).resolves.toBe('failed');
    expect(db.$executeRaw).not.toHaveBeenCalled();
  });
});

describe('backfillExhibitionEmbeddings', () => {
  it('no-ops with configured: false when the provider is missing', async () => {
    const db = {
      $queryRaw: jest.fn(),
      $executeRaw: jest.fn(),
    };
    await expect(
      backfillExhibitionEmbeddings(db as never, { provider: null })
    ).resolves.toEqual({
      written: 0,
      unchanged: 0,
      skipped: 0,
      failed: 0,
      configured: false,
    });
    expect(db.$queryRaw).not.toHaveBeenCalled();
  });
});
