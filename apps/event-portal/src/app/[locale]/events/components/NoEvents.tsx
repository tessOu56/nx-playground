import { demoCopy } from '@/libs/i18n/demo-copy';

export function NoEvents({ locale = 'zh-TW' }: { locale?: string }) {
  const copy = demoCopy(locale);

  return (
    <div
      className='rounded-xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center'
      data-testid='events-empty'
    >
      <h3 className='text-lg font-semibold text-gray-900'>
        {copy.emptyCatalog}
      </h3>
      <p className='mx-auto mt-2 max-w-md text-sm text-gray-600'>
        {copy.emptyCatalogHint}
      </p>
    </div>
  );
}
