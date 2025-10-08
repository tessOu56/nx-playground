export function PageSkeleton() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='page-container'>
        <div className='animate-pulse'>
          {/* 頁面標題骨架 */}
          <div className='text-center mb-8'>
            <div className='h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-2' />
            <div className='h-4 bg-gray-200 rounded w-48 mx-auto' />
          </div>

          {/* 主要內容骨架 */}
          <div className='space-y-6'>
            {/* 卡片骨架 */}
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <div className='space-y-4'>
                <div className='h-6 bg-gray-200 rounded w-3/4' />
                <div className='h-4 bg-gray-200 rounded w-1/2' />
                <div className='h-4 bg-gray-200 rounded w-2/3' />
              </div>
            </div>

            {/* 第二個卡片骨架 */}
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <div className='space-y-4'>
                <div className='h-6 bg-gray-200 rounded w-1/2' />
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='h-32 bg-gray-200 rounded' />
                  <div className='h-32 bg-gray-200 rounded' />
                </div>
              </div>
            </div>

            {/* 第三個卡片骨架 */}
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <div className='space-y-4'>
                <div className='h-6 bg-gray-200 rounded w-2/3' />
                <div className='space-y-2'>
                  <div className='h-4 bg-gray-200 rounded' />
                  <div className='h-4 bg-gray-200 rounded w-5/6' />
                  <div className='h-4 bg-gray-200 rounded w-4/6' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
