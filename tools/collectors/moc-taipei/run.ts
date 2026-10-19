import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { PrismaClient } from '@prisma/client';

import { fetchMocExhibitions } from './fetch';
import { normalizeMocRecords } from './normalize';
import { upsertTaipeiEvents } from './persist';

function loadRootEnv(cwd = process.cwd()) {
  for (const name of ['.env', '.env.local']) {
    const filePath = resolve(cwd, name);
    if (!existsSync(filePath)) continue;
    for (const raw of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq <= 0) continue;
      const key = line.slice(0, eq).trim();
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
      if (process.env[key] !== undefined) continue;
      let value = line.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  }
}

function assertPostgresUrl(url: string): string {
  const trimmed = url.trim();
  if (
    trimmed.startsWith('file:') ||
    trimmed.includes('mode=memory') ||
    !/^postgres(ql)?:\/\//i.test(trimmed)
  ) {
    throw new Error('DATABASE_URL must be postgresql.');
  }
  return trimmed;
}

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
    const counts = await upsertTaipeiEvents(prisma, events);
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
