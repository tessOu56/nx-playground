import { demoCopy } from '@/libs/i18n/demo-copy';

export function NoEvents({
  variant = 'vendor',
  locale = 'zh-TW',
}: {
  variant?: 'vendor' | 'catalog';
  locale?: string;
}) {
  const isCatalog = variant === 'catalog';
  const copy = demoCopy(locale);

  return (
    <div
      className='rounded-xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center'
      data-testid='events-empty'
    >
      <h3 className='text-lg font-semibold text-gray-900'>
        {isCatalog ? copy.emptyCatalog : copy.vendorEmpty}
      </h3>
      <p className='mx-auto mt-2 max-w-md text-sm text-gray-600'>
        {isCatalog ? copy.emptyCatalogHint : copy.vendorEmptyHint}
      </p>
    </div>
  );
}
