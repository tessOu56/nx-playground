import { demoCopy } from '@/libs/i18n/demo-copy';
import type { CatalogSearchErrorKind } from '@/libs/api/catalog-search-ui';

function errorCopy(
  copy: ReturnType<typeof demoCopy>,
  kind: CatalogSearchErrorKind,
  retryAfterSec: number | null
): string {
  if (kind === 'rate-limit') {
    if (retryAfterSec) {
      return `${copy.searchErrorRateLimit} (${retryAfterSec}s)`;
    }
    return copy.searchErrorRateLimit;
  }
  if (kind === 'too-long') return copy.searchErrorTooLong;
  if (kind === 'network') return copy.searchErrorNetwork;
  return copy.searchErrorGeneric;
}

export function CatalogSearchStatus({
  locale,
  pending,
  slow,
  error,
  retryAfterSec,
  onRetry,
}: {
  locale: string;
  pending: boolean;
  slow: boolean;
  error: CatalogSearchErrorKind | null;
  retryAfterSec: number | null;
  onRetry: () => void;
}) {
  const copy = demoCopy(locale);

  if (error) {
    return (
      <div
        className='flex flex-col gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between'
        role='alert'
        data-testid='catalog-search-error'
      >
        <p className='text-sm leading-6 text-gray-800'>
          {errorCopy(copy, error, retryAfterSec)}
        </p>
        <button
          type='button'
          onClick={onRetry}
          className='inline-flex min-h-11 items-center justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 sm:min-h-9'
        >
          {copy.retry}
        </button>
      </div>
    );
  }

  if (!pending) return null;

  return (
    <p
      className='text-sm text-gray-600'
      role='status'
      aria-live='polite'
      data-testid='catalog-search-status'
    >
      {slow ? copy.searchSlow : copy.searching}
    </p>
  );
}
