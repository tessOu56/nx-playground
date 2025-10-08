export function OrdersSkeleton() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='page-container'>
        <div className='space-y-6'>
          {/* 頁面標題骨架 */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='h-8 bg-gray-200 rounded w-1/3 mb-2 animate-pulse' />
            <div className='h-4 bg-gray-200 rounded w-2/3 animate-pulse' />
          </div>

          {/* 篩選和搜尋骨架 */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='flex-1'>
                <div className='h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse' />
                <div className='h-10 bg-gray-200 rounded animate-pulse' />
              </div>
              <div className='sm:w-48'>
                <div className='h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse' />
                <div className='h-10 bg-gray-200 rounded animate-pulse' />
              </div>
            </div>
          </div>

          {/* 訂單列表骨架 */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse' />
            <div className='space-y-4'>
              {[1, 2, 3].map(i => (
                <div key={i} className='border border-gray-200 rounded-lg p-4'>
                  <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
                    <div className='flex-1'>
                      <div className='flex items-center justify-between mb-2'>
                        <div className='h-5 bg-gray-200 rounded w-1/3 animate-pulse' />
                        <div className='h-6 bg-gray-200 rounded w-16 animate-pulse' />
                      </div>
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                        {[1, 2, 3, 4, 5, 6].map(j => (
                          <div key={j} className='space-y-1'>
                            <div className='h-3 bg-gray-200 rounded w-1/2 animate-pulse' />
                            <div className='h-4 bg-gray-200 rounded w-3/4 animate-pulse' />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className='flex flex-col gap-2 lg:w-48'>
                      <div className='h-8 bg-gray-200 rounded animate-pulse' />
                      <div className='h-8 bg-gray-200 rounded animate-pulse' />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
