import type { PrismaClient } from '@prisma/client';

import type { NormalizedTaipeiEvent } from './normalize';

export type UpsertCounts = {
  created: number;
  updated: number;
  touched: number;
};

export async function upsertTaipeiEvents(
  prisma: PrismaClient,
  events: NormalizedTaipeiEvent[]
): Promise<UpsertCounts> {
  const counts: UpsertCounts = { created: 0, updated: 0, touched: 0 };

  for (const event of events) {
    const existing = await prisma.event.findUnique({
      where: {
        source_externalId: {
          source: event.source,
          externalId: event.externalId,
        },
      },
    });

    const data = {
      title: event.title,
      description: event.description,
      location: event.location,
      startDate: event.startDate,
      endDate: event.endDate,
      status: event.status,
      region: event.region,
      timezone: event.timezone,
      source: event.source,
      sourceUrl: event.sourceUrl,
      externalId: event.externalId,
      contentHash: event.contentHash,
      tags: event.tags,
      priceText: event.priceText,
      lastSeenAt: event.lastSeenAt,
      data: event.data,
    };

    if (!existing) {
      await prisma.event.create({
        data: { id: event.id, ...data },
      });
      counts.created += 1;
      continue;
    }

    if (existing.contentHash === event.contentHash) {
      await prisma.event.update({
        where: { id: existing.id },
        data: { lastSeenAt: event.lastSeenAt },
      });
      counts.touched += 1;
      continue;
    }

    await prisma.event.update({
      where: { id: existing.id },
      data,
    });
    counts.updated += 1;
  }

  return counts;
}
