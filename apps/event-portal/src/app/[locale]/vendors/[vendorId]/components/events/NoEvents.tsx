export function NoEvents() {
  return (
    <div className='text-center py-12'>
      <span
        className='text-gray-400 text-6xl mb-4'
        role='img'
        aria-label='日曆'
      >
        📅
      </span>
      <h3 className='text-lg font-medium text-gray-900 mb-2'>暫無活動</h3>
      <p className='text-gray-500'>此主辦方目前沒有舉辦任何活動</p>
    </div>
  );
}
