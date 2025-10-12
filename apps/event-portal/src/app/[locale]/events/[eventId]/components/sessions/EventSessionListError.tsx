export function EventSessionListError() {
  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-lg font-semibold text-gray-900 mb-4'>場次資訊</h2>
      <div className='flex flex-col items-center justify-center py-12 space-y-4'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-red-500' />
        <div className='text-center space-y-2'>
          <div className='text-red-500 font-medium'>載入場次失敗</div>
          <div className='text-gray-500 text-sm'>
            無法獲取場次資訊，請稍後再試
          </div>
        </div>
      </div>
    </div>
  );
}
