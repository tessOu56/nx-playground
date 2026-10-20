import { PrismaClient } from '@prisma/client';

import { assertPostgresUrl, loadRootEnv } from '../shared/env';
import { upsertNormalizedEvents } from '../shared/persist';

import { fetchMocExhibitions } from './fetch';
import { normalizeMocRecords } from './normalize';

async function main() {
  loadRootEnv();
  const databaseUrl = process.env.DATABASE_URL?.trim() ?? '';
  if (!databaseUrl) {
    console.log('DATABASE_URL is not set; skipping Taipei collector.');
    process.exit(0);
  }
  assertPostgresUrl(databaseUrl);

  const raw = await fetchMocExhibitions();
  const incoming = Array.isArray(raw) ? raw.length : 0;
  const events = normalizeMocRecords(raw);
  const prisma = new PrismaClient();
  try {
    const counts = await upsertNormalizedEvents(prisma, events);
    console.log(
      JSON.stringify({
        source: 'moc-opendata',
        fetched: incoming,
        normalized: events.length,
        ...counts,
      })
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
