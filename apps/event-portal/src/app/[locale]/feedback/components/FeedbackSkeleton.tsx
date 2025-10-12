export function FeedbackSkeleton() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='page-container'>
        <div className='space-y-6 animate-pulse'>
          {/* 頁面標題 */}
          <div className='text-center'>
            <div className='h-8 bg-gray-200 rounded w-48 mx-auto mb-4' />
            <div className='h-6 bg-gray-200 rounded w-96 mx-auto' />
          </div>

          {/* 回饋表單 */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='space-y-6'>
              {/* 回饋類型 */}
              <div>
                <div className='h-5 bg-gray-200 rounded w-20 mb-2' />
                <div className='h-10 bg-gray-200 rounded w-full' />
              </div>

              {/* 標題 */}
              <div>
                <div className='h-5 bg-gray-200 rounded w-16 mb-2' />
                <div className='h-10 bg-gray-200 rounded w-full' />
              </div>

              {/* 詳細描述 */}
              <div>
                <div className='h-5 bg-gray-200 rounded w-24 mb-2' />
                <div className='h-32 bg-gray-200 rounded w-full' />
              </div>

              {/* 聯絡方式 */}
              <div>
                <div className='h-5 bg-gray-200 rounded w-20 mb-2' />
                <div className='h-10 bg-gray-200 rounded w-full' />
              </div>

              {/* 優先級 */}
              <div>
                <div className='h-5 bg-gray-200 rounded w-16 mb-2' />
                <div className='h-10 bg-gray-200 rounded w-full' />
              </div>

              {/* 提交按鈕 */}
              <div className='pt-4'>
                <div className='h-12 bg-gray-200 rounded w-full' />
              </div>
            </div>
          </div>

          {/* 客服資訊 */}
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
            <div className='h-6 bg-blue-200 rounded w-32 mb-4' />
            <div className='space-y-3'>
              <div className='h-4 bg-blue-200 rounded w-full' />
              <div className='h-4 bg-blue-200 rounded w-3/4' />
              <div className='h-4 bg-blue-200 rounded w-5/6' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
