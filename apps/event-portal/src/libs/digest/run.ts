import { generateWeeklyDigest } from './generate';
import { loadDigestCatalog, type DigestCatalogSource } from './load';
import { createConfiguredPublishers } from './publish';
import type {
  DigestExhibition,
  DigestMessage,
  DigestPublisher,
  PublishResult,
  WeeklyDigest,
} from './types';

export type RunWeeklyDigestOptions = {
  now?: Date;
  origin: string;
  exhibitions?: readonly DigestExhibition[];
  source?: DigestCatalogSource;
  publishers?: DigestPublisher[];
  databaseUrl?: string;
};

export type WeeklyDigestRun = {
  source: DigestCatalogSource;
  digest: WeeklyDigest;
  messages: DigestMessage[];
  publishes: PublishResult[];
};

export async function runWeeklyDigest(
  options: RunWeeklyDigestOptions
): Promise<WeeklyDigestRun> {
  const now = options.now ?? new Date();
  const catalog = options.exhibitions
    ? {
        source: options.source ?? 'sample',
        items: options.exhibitions,
      }
    : await loadDigestCatalog(now, options.databaseUrl);
  const generated = generateWeeklyDigest(
    catalog.items,
    now,
    options.origin
  );
  const publishers = options.publishers ?? createConfiguredPublishers();
  const publishes: PublishResult[] = [];
  for (const publisher of publishers) {
    publishes.push(await publisher.publish(generated.messages));
  }
  return {
    source: catalog.source,
    digest: generated.digest,
    messages: generated.messages,
    publishes,
  };
}

export function digestRunSummary(run: WeeklyDigestRun) {
  return {
    source: run.source,
    weekStart: run.digest.weekStart.toISOString(),
    weekEnd: run.digest.weekEnd.toISOString(),
    cities: Object.fromEntries(
      run.digest.cities.map(section => [
        section.city,
        {
          upcoming: section.upcoming.length,
          newlyAdded: section.newlyAdded.length,
        },
      ])
    ),
    locales: run.messages.map(message => message.locale),
    publishes: run.publishes,
  };
}
