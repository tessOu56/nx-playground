interface TicketErrorProps {
  type: 'no-session-selected' | 'no-tickets' | 'loading-error';
}

export function TicketError({ type }: TicketErrorProps) {
  const getErrorContent = () => {
    switch (type) {
      case 'no-session-selected':
        return {
          title: '請先選擇場次',
          message: '選擇場次後即可查看可購買的票卷',
          color: 'text-gray-400',
        };
      case 'no-tickets':
        return {
          title: '暫無票卷資料',
          message: '此場次目前沒有可購買的票卷，請聯繫主辦方確認',
          color: 'text-orange-500',
        };
      case 'loading-error':
        return {
          title: '載入票卷資料失敗',
          message: '請檢查網路連線或稍後再試',
          color: 'text-red-500',
        };
      default:
        return {
          title: '票卷資料異常',
          message: '請聯繫主辦方確認',
          color: 'text-orange-500',
        };
    }
  };

  const { title, message, color } = getErrorContent();

  return (
    <div className='bg-white rounded-lg shadow-md p-6' data-ticket-selector>
      <h2 className='text-xl font-semibold text-gray-900 mb-4'>選擇票卷</h2>
      <div className='text-center py-8'>
        <div className={`${color} text-lg font-medium mb-2`}>{title}</div>
        <p className='text-gray-600 text-sm'>{message}</p>
      </div>
    </div>
  );
}
