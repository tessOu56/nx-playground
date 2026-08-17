'use client';

interface EventListErrorProps {
  onRetry?: () => void;
}

/** Shown when the event-stack API is unreachable — never fall back to inlined mock arrays. */
export function EventListError({ onRetry }: EventListErrorProps) {
  return (
    <div
      className='bg-white rounded-lg shadow-md p-6'
      role='alert'
      data-testid='event-stack-api-error'
    >
      <div className='flex flex-col items-center justify-center py-12 space-y-4'>
        <div className='text-center space-y-2'>
          <div className='text-red-600 font-medium'>無法連線活動 API</div>
          <div className='text-gray-500 text-sm'>
            列表來自 Nest（:3001）或 api-mock（:3011），不是內建假資料。請確認
            API 已啟動，或改
            <code className='mx-1 text-xs'>NEXT_PUBLIC_API_BASE_URL</code>。
          </div>
        </div>
        {onRetry ? (
          <button
            type='button'
            className='rounded-md bg-slate-900 px-4 py-2 text-sm text-white'
            onClick={onRetry}
          >
            重試
          </button>
        ) : null}
      </div>
    </div>
  );
}
