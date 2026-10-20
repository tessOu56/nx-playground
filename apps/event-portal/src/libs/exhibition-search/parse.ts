import type { CatalogQuery } from '../api/catalog-query';
import { parseCatalogQuery as parseCatalogUrlQuery } from '../api/catalog-query';
import { parseCatalogQuery as parseLineQuery } from '../line/bot/parse-query';
import { resolveTimeWindow, type ExhibitionRegion } from '../line/bot/time-window';

import type { ExhibitionSearchInput } from './types';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

function parseRegion(value: string): ExhibitionRegion | undefined {
  const normalized = value.trim().toUpperCase();
  if (normalized === 'TAIPEI' || normalized === 'TOKYO') return normalized;
  return undefined;
}

function parseLimit(raw: string | null): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return DEFAULT_LIMIT;
  return Math.min(Math.max(Math.trunc(n), 1), MAX_LIMIT);
}

export function exhibitionSearchFromLineText(
  text: string,
  now = new Date(),
  limit = 10
): ExhibitionSearchInput {
  const parsed = parseLineQuery(text, now);
  return {
    keyword: parsed.keyword,
    region: parsed.region,
    dateMode: 'window',
    windows: parsed.windows,
    limit,
    now,
  };
}

export function exhibitionSearchFromCatalog(
  query: CatalogQuery,
  now = new Date(),
  limit = 48
): ExhibitionSearchInput {
  const parsed = parseLineQuery(query.q, now);
  const region =
    query.city === 'all' ? parsed.region : (query.city as ExhibitionRegion);
  const windows: ExhibitionSearchInput['windows'] = {};
  const regions: ExhibitionRegion[] = region ? [region] : ['TAIPEI', 'TOKYO'];

  if (query.dates === 'month') {
    for (const item of regions) {
      windows[item] = resolveTimeWindow('this_month', item, now);
    }
    return {
      keyword: parsed.keyword,
      region,
      dateMode: 'window',
      windows,
      category: query.category,
      limit,
      now,
    };
  }

  if (query.dates === 'all' && parsed.timeWindow) {
    return {
      keyword: parsed.keyword,
      region,
      dateMode: 'window',
      windows: parsed.windows,
      category: query.category,
      limit,
      now,
    };
  }

  if (query.dates === 'all') {
    return {
      keyword: parsed.keyword,
      region,
      dateMode: 'all',
      category: query.category,
      limit,
      now,
    };
  }

  return {
    keyword: parsed.keyword,
    region,
    dateMode: query.dates,
    category: query.category,
    limit,
    now,
  };
}

export function parseExhibitionSearchParams(
  params: URLSearchParams,
  now = new Date()
): ExhibitionSearchInput {
  const catalog = parseCatalogUrlQuery(params);
  const regionParam = parseRegion(params.get('region') ?? '');
  const parsed = exhibitionSearchFromCatalog(catalog, now, parseLimit(params.get('limit')));
  if (regionParam) parsed.region = regionParam;
  return parsed;
}
