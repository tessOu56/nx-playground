import type { CityFilter, DateFilter } from './catalog-filters';

export type CatalogQuery = {
  q: string;
  city: CityFilter;
  dates: DateFilter;
  category: string;
};

const CITIES: readonly CityFilter[] = ['all', 'TAIPEI', 'TOKYO'];
const DATES: readonly DateFilter[] = [
  'all',
  'now',
  'upcoming',
  'month',
  'past',
];
export const MAX_QUERY_TEXT = 80;

export type CatalogEmptyKind = 'catalog' | 'search' | 'city' | 'ended';

function first(value: string | string[] | undefined | null): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

function isSearchReader(
  search: unknown
): search is { get(name: string): string | null } {
  return !!search && typeof (search as { get?: unknown }).get === 'function';
}

export function parseCityFilter(
  value: string | string[] | undefined | null
): CityFilter {
  const city = first(value);
  return CITIES.includes(city as CityFilter) ? (city as CityFilter) : 'all';
}

export function parseDateFilter(
  value: string | string[] | undefined | null
): DateFilter {
  const dates = first(value);
  return DATES.includes(dates as DateFilter) ? (dates as DateFilter) : 'all';
}

export function parseCatalogQuery(
  search:
    | URLSearchParams
    | { get(name: string): string | null }
    | Record<string, string | string[] | undefined>
    | null
    | undefined
): CatalogQuery {
  const read = (key: string): string => {
    if (!search) return '';
    if (isSearchReader(search)) return search.get(key) ?? '';
    return first(search[key]);
  };

  return {
    q: commitSearchText(read('q')),
    city: parseCityFilter(read('city')),
    dates: parseDateFilter(read('dates')),
    category: commitSearchText(read('category')),
  };
}

/** Trim and cap free-text the same way URL parse does — not while the user is mid-keystroke. */
export function commitSearchText(value: string): string {
  return value.trim().slice(0, MAX_QUERY_TEXT);
}

export function sameCatalogQuery(a: CatalogQuery, b: CatalogQuery): boolean {
  return (
    a.q === b.q &&
    a.city === b.city &&
    a.dates === b.dates &&
    a.category === b.category
  );
}

export function catalogPath(locale: string): string {
  return `/${locale}/events`;
}

export function isCatalogHref(locale: string, href: string): boolean {
  if (!href.startsWith('/') || href.startsWith('//') || href.includes('\\')) {
    return false;
  }
  const [path] = href.split('?');
  return path === catalogPath(locale);
}

export function catalogHrefStorageKey(locale: string): string {
  return `nx-catalog:${locale}`;
}

export function rememberCatalogHref(locale: string, href: string): void {
  if (typeof sessionStorage === 'undefined') return;
  if (!isCatalogHref(locale, href)) return;
  try {
    sessionStorage.setItem(catalogHrefStorageKey(locale), href);
  } catch {
    /* private mode / quota */
  }
}

export function readRememberedCatalogHref(
  locale: string,
  fallback: string
): string {
  if (typeof sessionStorage === 'undefined') return fallback;
  try {
    const stored = sessionStorage.getItem(catalogHrefStorageKey(locale));
    if (stored && isCatalogHref(locale, stored)) return stored;
  } catch {
    /* ignore */
  }
  return fallback;
}

export function catalogQueryString(query: CatalogQuery): string {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.city !== 'all') params.set('city', query.city);
  if (query.dates !== 'all') params.set('dates', query.dates);
  if (query.category) params.set('category', query.category);
  return params.toString();
}

export function catalogHref(
  locale: string,
  query: Partial<CatalogQuery> = {}
): string {
  const qs = catalogQueryString({
    q: query.q ?? '',
    city: query.city ?? 'all',
    dates: query.dates ?? 'all',
    category: query.category ?? '',
  });
  return qs ? `/${locale}/events?${qs}` : `/${locale}/events`;
}

export function catalogEmptyKind({
  total,
  filtered,
  query,
}: {
  total: number;
  filtered: number;
  query: CatalogQuery;
}): CatalogEmptyKind | null {
  if (filtered > 0) return null;
  if (total === 0) return 'catalog';
  const hasSearch = query.q.length > 0 || query.category.length > 0;
  if (!hasSearch && query.dates === 'past') return 'ended';
  if (!hasSearch && query.city !== 'all' && query.dates === 'all')
    return 'city';
  return 'search';
}
