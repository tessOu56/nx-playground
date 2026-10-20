import { PrismaClient } from '@prisma/client';

import { assertPostgresUrl, loadRootEnv } from '../shared/env';
import { upsertNormalizedEvents } from '../shared/persist';
import type { CollectorBatch } from '../shared/types';

import {
  fetchArtsCouncilFeed,
  normalizeArtsCouncilRss,
} from './arts-council';
import { fetchCcbtFeed, normalizeCcbtRss } from './ccbt';
import {
  fetchTokyoOpendataCsv,
  normalizeTokyoOpendataCsv,
} from './opendata';
import { fetchTeienExhibitions, normalizeTeienPayload } from './teien';

async function collectAll(): Promise<CollectorBatch[]> {
  const [teienRaw, artsRaw, ccbtRaw, openRaw] = await Promise.all([
    fetchTeienExhibitions(),
    fetchArtsCouncilFeed(),
    fetchCcbtFeed(),
    fetchTokyoOpendataCsv(),
  ]);
  const now = new Date();
  return [
    normalizeTeienPayload(teienRaw, now),
    normalizeArtsCouncilRss(artsRaw, now),
    normalizeCcbtRss(ccbtRaw, now),
    normalizeTokyoOpendataCsv(openRaw, now),
  ];
}

async function main() {
  loadRootEnv();
  const databaseUrl = process.env.DATABASE_URL?.trim() ?? '';
  if (!databaseUrl) {
    console.log('DATABASE_URL is not set; skipping Tokyo collectors.');
    process.exit(0);
  }
  assertPostgresUrl(databaseUrl);

  const batches = await collectAll();
  const prisma = new PrismaClient();
  try {
    const summary = [];
    for (const batch of batches) {
      const counts = await upsertNormalizedEvents(prisma, batch.events);
      summary.push({
        source: batch.source,
        fetched: batch.fetched,
        normalized: batch.events.length,
        ...counts,
      });
    }
    console.log(JSON.stringify({ region: 'TOKYO', collectors: summary }));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
