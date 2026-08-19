'use client';

interface EventListErrorProps {
  onRetry?: () => void;
}

/** Shown when the event-stack API is unreachable — never fall back to inlined mock arrays. */
export function EventListError({ onRetry }: EventListErrorProps) {
  return (
    <div
      className='rounded-lg bg-white p-6 shadow-md'
      role='alert'
      data-testid='event-stack-api-error'
    >
      <div className='flex flex-col items-center justify-center space-y-4 py-12'>
        <div className='space-y-2 text-center'>
          <div className='font-medium text-red-600'>目前無法載入活動</div>
          <div className='text-sm text-gray-500'>請稍後再試。</div>
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
