export function NotFoundSkeleton() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='page-container'>
        <div className='space-y-4'>
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <div className='flex-1 sm:flex-none h-10 bg-gray-200 rounded-md animate-pulse' />
            <div className='flex-1 sm:flex-none h-10 bg-gray-200 rounded-md animate-pulse' />
          </div>

          <div className='text-sm text-gray-500 mt-6'>
            <div className='h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse' />
          </div>
        </div>
      </div>
    </div>
  );
}
