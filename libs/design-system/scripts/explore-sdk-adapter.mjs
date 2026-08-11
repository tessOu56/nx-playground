#!/usr/bin/env node
/**
 * T-ds-2026-002 — explore-design-sdk consumer adapter.
 *
 * explore-design-sdk (@explore-design/sdk + @explore-design/tokens) is the SSOT for
 * L1 primitives / L2 semantic catalog / L3 per-application semantic maps (see
 * ../../../explore-design-sdk/AGENTS.md). libs/design-system stays the Style
 * Dictionary / Tailwind + Vanilla Extract *output* adapter for this monorepo's own
 * apps (`pnpm design:tokens` — src/tokens/raw/*.json — unchanged, still SSOT for
 * the actual shipped CSS/Tailwind config in apps/*).
 *
 * This script is the read-only bridge between the two: it resolves each configured
 * SDK application map with @explore-design/sdk and writes the result next to the
 * existing generated token artifacts, so design-system consumers/reviewers can diff
 * "what the SDK says an app's tokens should be" against "what design-system actually
 * ships" (src/tokens/raw/*.json) without design-system's own build depending on the
 * SDK at runtime.
 *
 * Run: pnpm --filter @nx-playground/design-system run tokens:explore-sdk
 *      (or: pnpm design:tokens:explore-sdk from repo root)
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createExploreSdk } from '@explore-design/sdk';

const here = dirname(fileURLToPath(import.meta.url));
const generatedDir = join(here, '../src/tokens/generated');

// nx-playground app -> explore-design-sdk application map id.
// "enterprise" already exists in explore-design-sdk/packages/tokens/applications/
// and maps 1:1 onto apps/enterprise-admin + libs/design-system's own
// src/tokens/raw/enterprise-tokens.json Style Dictionary theme.
const APP_MAP_IDS = ['enterprise'];

const sdk = createExploreSdk();

const report = {
  generatedAt: new Date().toISOString(),
  tokensRoot: sdk.tokensRoot,
  sdkPackage: '@explore-design/sdk (file: dependency -> ../explore-design-sdk/packages/sdk)',
  applications: {},
};

for (const appId of APP_MAP_IDS) {
  const resolved = sdk.resolveAll(appId);
  report.applications[appId] = {
    tokenCount: resolved.length,
    tokens: Object.fromEntries(resolved.map((t) => [t.semantic, t.value])),
  };
  console.log(`  \u2705 Resolved ${resolved.length} semantic tokens for "${appId}" via @explore-design/sdk`);
}

mkdirSync(generatedDir, { recursive: true });
const outputPath = join(generatedDir, 'explore-sdk-resolved.json');
writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\n');
console.log(`  \ud83d\udcc1 Wrote ${outputPath}`);
