export function VerifySkeleton() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='page-container'>
        <div className='space-y-6'>
          {/* 頁面標題骨架 */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='h-8 bg-gray-200 rounded w-1/3 mb-2' />
            <div className='h-4 bg-gray-200 rounded w-1/2' />
          </div>

          {/* 票券資訊骨架 */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='h-6 bg-gray-200 rounded w-1/4 mb-4' />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={`verify-${i}`}>
                  <div className='h-4 bg-gray-200 rounded w-1/3 mb-2' />
                  <div className='h-5 bg-gray-200 rounded w-2/3' />
                </div>
              ))}
            </div>
          </div>

          {/* 驗證結果骨架 */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='h-6 bg-gray-200 rounded w-1/3 mb-4' />
            <div className='text-center'>
              <div className='w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4' />
              <div className='h-6 bg-gray-200 rounded w-1/2 mx-auto mb-2' />
              <div className='h-4 bg-gray-200 rounded w-3/4 mx-auto' />
            </div>
          </div>

          {/* 按鈕骨架 */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='flex flex-col sm:flex-row gap-3'>
              <div className='flex-1 h-12 bg-gray-200 rounded' />
              <div className='flex-1 h-12 bg-gray-200 rounded' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
