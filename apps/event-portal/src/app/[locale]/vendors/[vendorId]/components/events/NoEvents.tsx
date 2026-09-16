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
      className='rounded-lg border border-dashed border-gray-200 bg-white px-6 py-12 text-center'
      data-testid='events-empty'
    >
      <h3 className='text-lg font-medium text-gray-900'>
        {isCatalog ? copy.emptyCatalog : copy.vendorEmpty}
      </h3>
      <p className='mt-2 text-sm text-gray-500'>
        {isCatalog ? copy.emptyCatalogHint : copy.vendorEmptyHint}
      </p>
    </div>
  );
}
