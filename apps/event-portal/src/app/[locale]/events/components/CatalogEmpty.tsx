import { LineOfficialCta } from '@/components/line/LineOfficialCta';
import type { CatalogEmptyKind, CatalogQuery } from '@/libs/api/catalog-query';
import { demoCopy } from '@/libs/i18n/demo-copy';

export function CatalogEmpty({
  kind,
  locale,
  query,
  onClearFilters,
}: {
  kind: CatalogEmptyKind;
  locale: string;
  query: CatalogQuery;
  onClearFilters?: () => void;
}) {
  const copy = demoCopy(locale);
  const title =
    kind === 'city' && query.city !== 'all'
      ? copy.emptyCity(query.city)
      : kind === 'ended'
        ? copy.emptyEnded
        : kind === 'search'
          ? copy.emptySearch
          : copy.emptyCatalog;
  const hint =
    kind === 'city'
      ? copy.emptyCityHint
      : kind === 'ended'
        ? copy.emptyEndedHint
        : kind === 'search'
          ? copy.emptySearchHint
          : copy.emptyCatalogHint;
  const testId =
    kind === 'catalog' ? 'events-empty' : `events-${kind}-empty`;

  return (
    <div
      className='rounded-xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center'
      data-testid={testId}
    >
      <h2 className='text-lg font-semibold text-gray-900'>{title}</h2>
      <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600'>
        {hint}
      </p>
      <div className='mt-5 flex flex-wrap items-center justify-center gap-3'>
        {onClearFilters && kind !== 'catalog' ? (
          <button
            type='button'
            onClick={onClearFilters}
            className='rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800'
          >
            {copy.clearFilters}
          </button>
        ) : null}
        <LineOfficialCta locale={locale} />
      </div>
    </div>
  );
}
