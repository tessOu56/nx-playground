export function VendorHeaderError() {
  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <div className='flex flex-col items-center justify-center py-12 space-y-4'>
        {/* 轉圈 loading */}
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-red-500' />

        {/* 錯誤訊息 */}
        <div className='text-center space-y-2'>
          <div className='text-red-500 font-medium'>查無此主辦方</div>
          <div className='text-gray-500 text-sm'>請檢查主辦方 ID 是否正確</div>
        </div>
      </div>
    </div>
  );
}
