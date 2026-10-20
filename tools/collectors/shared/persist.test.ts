import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { PrismaClient } from '@prisma/client';

import { upsertNormalizedEvents } from './persist';
import type { NormalizedExhibition } from './types';

function sample(overrides: Partial<NormalizedExhibition> = {}): NormalizedExhibition {
  const start = new Date('2026-10-02T15:00:00.000Z');
  const end = new Date('2026-12-20T14:59:59.999Z');
  return {
    id: 'teien-art-museum-marimekko',
    title: 'マリメッコ展',
    description: '公式ページの展覧会摘要。詳細：https://www.teien-art-museum.ne.jp/',
    location: '東京都庭園美術館',
    startDate: start,
    endDate: end,
    status: 'published',
    region: 'TOKYO',
    timezone: 'Asia/Tokyo',
    source: 'teien-art-museum',
    sourceUrl: 'https://www.teien-art-museum.ne.jp/exhibition/marimekko/',
    externalId: 'marimekko',
    contentHash: 'hash-1',
    tags: ['展覧会', '東京'],
    priceText: null,
    lastSeenAt: new Date('2026-10-20T00:00:00.000Z'),
    data: {
      kind: 'exhibition',
      source: 'teien-art-museum',
      summaryOnly: true,
      i18n: {
        title: { ja: 'マリメッコ展', en: 'Marimekko' },
        description: { ja: '摘要' },
        location: { ja: '東京都庭園美術館' },
      },
    },
    ...overrides,
  };
}

function mockPrisma(existing?: { id: string; contentHash: string }) {
  const created: unknown[] = [];
  const updated: unknown[] = [];
  const prisma = {
    event: {
      findUnique: async () => existing ?? null,
      create: async ({ data }: { data: unknown }) => {
        created.push(data);
        return data;
      },
      update: async ({ data }: { data: unknown }) => {
        updated.push(data);
        return data;
      },
    },
  };
  return { prisma: prisma as unknown as PrismaClient, created, updated };
}

describe('upsertNormalizedEvents', () => {
  it('creates, touches unchanged hashes, and updates changed hashes', async () => {
    const create = mockPrisma();
    const createdCounts = await upsertNormalizedEvents(create.prisma, [sample()]);
    assert.equal(createdCounts.created, 1);
    assert.equal(create.created.length, 1);

    const touch = mockPrisma({ id: 'keep', contentHash: 'hash-1' });
    const touched = await upsertNormalizedEvents(touch.prisma, [
      sample({ lastSeenAt: new Date('2026-10-21T00:00:00.000Z') }),
    ]);
    assert.equal(touched.touched, 1);
    assert.deepEqual(touch.updated[0], {
      lastSeenAt: new Date('2026-10-21T00:00:00.000Z'),
    });

    const update = mockPrisma({ id: 'keep', contentHash: 'old' });
    const updated = await upsertNormalizedEvents(update.prisma, [
      sample({ contentHash: 'hash-2' }),
    ]);
    assert.equal(updated.updated, 1);
    assert.equal(update.updated.length, 1);
  });
});
