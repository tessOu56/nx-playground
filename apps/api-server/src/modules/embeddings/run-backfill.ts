import { PrismaClient } from '@prisma/client';

import { loadRootEnv } from '../../common/prisma/load-root-env';
import { assertPostgresUrl } from '../../common/prisma/postgres-url';

import { isEmbeddingConfigured } from '@nx-playground/exhibition-embeddings';

import { backfillExhibitionEmbeddings } from './pipeline';

async function main() {
  loadRootEnv();
  const databaseUrl = process.env.DATABASE_URL?.trim() ?? '';
  if (!databaseUrl) {
    console.log(
      JSON.stringify({
        embeddings: { configured: false, skipped: true, reason: 'no-database' },
      })
    );
    return;
  }
  assertPostgresUrl(databaseUrl);

  if (!isEmbeddingConfigured()) {
    console.log(
      JSON.stringify({
        embeddings: {
          configured: false,
          skipped: true,
          reason: 'embedding-unconfigured',
        },
      })
    );
    return;
  }

  const prisma = new PrismaClient();
  try {
    const counts = await backfillExhibitionEmbeddings(prisma);
    console.log(JSON.stringify({ embeddings: counts }));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
