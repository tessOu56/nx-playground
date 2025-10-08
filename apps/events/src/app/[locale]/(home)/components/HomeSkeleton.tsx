export function HomeSkeleton() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='page-container'>
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
          <div className='max-w-md w-full'>
            {/* Logo 區域 */}
            <div className='text-center mb-8'>
              <div className='w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse' />
              <div className='h-8 bg-gray-200 rounded w-48 mx-auto animate-pulse' />
              <div className='h-4 bg-gray-200 rounded w-32 mx-auto mt-2 animate-pulse' />
            </div>

            {/* 登入按鈕區域 */}
            <div className='space-y-4'>
              {/* LINE 登入按鈕 */}
              <div className='bg-green-500 rounded-lg p-4 animate-pulse'>
                <div className='flex items-center justify-center space-x-3'>
                  <div className='w-6 h-6 bg-white rounded-full' />
                  <div className='h-5 bg-white rounded w-32' />
                </div>
              </div>

              {/* 其他登入選項 */}
              <div className='space-y-3'>
                <div className='h-12 bg-gray-200 rounded-lg animate-pulse' />
                <div className='h-12 bg-gray-200 rounded-lg animate-pulse' />
              </div>
            </div>

            {/* 說明文字 */}
            <div className='mt-8 text-center space-y-3'>
              <div className='h-4 bg-gray-200 rounded w-full animate-pulse' />
              <div className='h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
