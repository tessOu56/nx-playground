export const SEARCH_DEBOUNCE_MS = 300;
export const SEARCH_PENDING_MS = 150;
export const SEARCH_SLOW_MS = 800;

export type CatalogSearchErrorKind =
  | 'rate-limit'
  | 'too-long'
  | 'network'
  | 'generic';

export function catalogSearchErrorFromStatus(
  status: number
): CatalogSearchErrorKind | null {
  if (status === 200) return null;
  if (status === 429) return 'rate-limit';
  if (status === 414) return 'too-long';
  if (status >= 400) return 'generic';
  return null;
}

export function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const name = 'name' in error ? String(error.name) : '';
  return name === 'AbortError';
}

export function parseRetryAfterSec(value: string | null): number | null {
  if (!value) return null;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds > 0) {
    return Math.min(Math.ceil(seconds), 120);
  }
  return null;
}
