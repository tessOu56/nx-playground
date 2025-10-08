interface OrderErrorProps {
  type: 'no-event-data' | 'no-sessions' | 'loading-error';
  showButton?: boolean;
}

export function OrderError({ type, showButton = true }: OrderErrorProps) {
  const getErrorContent = () => {
    switch (type) {
      case 'no-event-data':
        return {
          title: '找不到活動資料',
          message: '請確認活動 ID 是否正確',
          buttonText: '無法結帳',
          color: 'text-red-500',
        };
      case 'no-sessions':
        return {
          title: '活動資料異常',
          message: '無法計算訂單，請先解決活動資料問題',
          buttonText: '無法結帳',
          color: 'text-red-500',
        };
      case 'loading-error':
        return {
          title: '載入活動資料失敗',
          message: '請檢查網路連線或稍後再試',
          buttonText: '無法結帳',
          color: 'text-red-500',
        };
      default:
        return {
          title: '訂單資料異常',
          message: '無法進行結帳，請聯繫主辦方確認',
          buttonText: '無法結帳',
          color: 'text-red-500',
        };
    }
  };

  const { title, message, buttonText, color } = getErrorContent();

  return (
    <div className='sticky bottom-0 z-50 bg-white border-t shadow-lg p-4'>
      <div className='max-w-4xl mx-auto'>
        <div className='text-center py-4'>
          <div className='text-gray-400 text-lg font-medium mb-2'>訂單總計</div>
          <div className={`${color} text-lg font-medium mb-2`}>{title}</div>
          <p className='text-gray-500 text-sm mb-4'>{message}</p>
          {showButton && (
            <button
              disabled
              className='w-full h-11 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed'
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
