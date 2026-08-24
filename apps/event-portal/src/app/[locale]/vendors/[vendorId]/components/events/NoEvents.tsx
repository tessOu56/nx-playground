export function NoEvents({
  variant = 'vendor',
}: {
  variant?: 'vendor' | 'catalog';
}) {
  const isCatalog = variant === 'catalog';

  return (
    <div
      className='rounded-lg border border-dashed border-gray-200 bg-white px-6 py-12 text-center'
      data-testid='events-empty'
    >
      <h3 className='text-lg font-medium text-gray-900'>
        {isCatalog ? '目前沒有可報名的活動' : '暫無活動'}
      </h3>
      <p className='mt-2 text-sm text-gray-500'>
        {isCatalog
          ? '稍後再回來，或向主辦確認是否已發布。重新整理頁面可再試一次。'
          : '此主辦方目前沒有舉辦任何活動'}
      </p>
    </div>
  );
}
