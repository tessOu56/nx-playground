interface SessionErrorProps {
  type: 'no-sessions' | 'invalid-sessions' | 'loading-error';
  eventTitle?: string;
  eventLocation?: string;
}

export function SessionError({
  type,
  eventTitle,
  eventLocation,
}: SessionErrorProps) {
  const getErrorContent = () => {
    switch (type) {
      case 'no-sessions':
        return {
          title: '暫無場次資料',
          message: '此活動目前沒有可選擇的場次，請稍後再試或聯繫主辦方',
          color: 'text-orange-500',
        };
      case 'invalid-sessions':
        return {
          title: '場次資料異常',
          message: '場次資料格式有誤，請聯繫主辦方確認',
          color: 'text-orange-500',
        };
      case 'loading-error':
        return {
          title: '載入場次資料失敗',
          message: '請檢查網路連線或稍後再試',
          color: 'text-red-500',
        };
      default:
        return {
          title: '場次資料異常',
          message: '請聯繫主辦方確認',
          color: 'text-orange-500',
        };
    }
  };

  const { title, message, color } = getErrorContent();

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-xl font-semibold text-gray-900 mb-4'>
        {eventTitle && eventLocation ? (
          <>
            {eventTitle} - 選擇場次
            <span className='text-sm text-gray-600 mx-2'>{eventLocation}</span>
          </>
        ) : (
          '選擇場次'
        )}
      </h2>
      <div className='text-center py-8'>
        <div className={`${color} text-lg font-medium mb-2`}>{title}</div>
        <p className='text-gray-600 text-sm'>{message}</p>
      </div>
    </div>
  );
}
