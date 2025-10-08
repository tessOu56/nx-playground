export function EventInfoHeaderError() {
  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <div className='flex flex-col items-center justify-center py-12 space-y-4'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-red-500' />
        <div className='text-center space-y-2'>
          <div className='text-red-500 font-medium'>查無此活動</div>
          <div className='text-gray-500 text-sm'>請確認網址是否正確</div>
        </div>
      </div>
    </div>
  );
}
