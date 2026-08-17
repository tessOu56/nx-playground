interface EventInfoHeaderErrorProps {
  kind?: 'api' | 'not-found';
}

export function EventInfoHeaderError({
  kind = 'not-found',
}: EventInfoHeaderErrorProps) {
  const isApi = kind === 'api';
  return (
    <div
      className='bg-white rounded-lg shadow-md p-6'
      role='alert'
      data-testid={isApi ? 'event-stack-api-error' : 'event-not-found'}
    >
      <div className='flex flex-col items-center justify-center py-12 space-y-4'>
        <div className='text-center space-y-2'>
          <div className='text-red-600 font-medium'>
            {isApi ? '無法連線活動 API' : '查無此活動'}
          </div>
          <div className='text-gray-500 text-sm'>
            {isApi
              ? '詳情頁不會改用內建 mock 陣列。請啟動 Nest 或 api-mock 後重試。'
              : '請確認網址是否正確'}
          </div>
        </div>
      </div>
    </div>
  );
}
