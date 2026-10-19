-- CreateEnum
CREATE TYPE "ExhibitionRegion" AS ENUM ('TAIPEI', 'TOKYO');

-- AlterTable
ALTER TABLE "events"
  ADD COLUMN "region" "ExhibitionRegion",
  ADD COLUMN "timezone" TEXT,
  ADD COLUMN "source" TEXT,
  ADD COLUMN "sourceUrl" TEXT,
  ADD COLUMN "externalId" TEXT,
  ADD COLUMN "contentHash" TEXT,
  ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "priceText" TEXT,
  ADD COLUMN "lastSeenAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "events_source_externalId_key" ON "events"("source", "externalId");

-- CreateIndex
CREATE INDEX "events_region_idx" ON "events"("region");

-- CreateIndex
CREATE INDEX "events_lastSeenAt_idx" ON "events"("lastSeenAt");
