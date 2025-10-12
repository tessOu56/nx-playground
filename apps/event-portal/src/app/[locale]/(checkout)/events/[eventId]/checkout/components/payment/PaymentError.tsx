interface PaymentErrorProps {
  type: 'no-payment-methods' | 'loading-error';
}

export function PaymentError({ type }: PaymentErrorProps) {
  const getErrorContent = () => {
    switch (type) {
      case 'no-payment-methods':
        return {
          title: '暫無可用付款方式',
          message: '此活動目前沒有可用的付款方式，請聯繫主辦方確認',
          color: 'text-orange-500',
        };
      case 'loading-error':
        return {
          title: '載入付款方式失敗',
          message: '請檢查網路連線或稍後再試',
          color: 'text-red-500',
        };
      default:
        return {
          title: '付款方式異常',
          message: '請聯繫主辦方確認',
          color: 'text-orange-500',
        };
    }
  };

  const { title, message, color } = getErrorContent();

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-xl font-semibold text-gray-900 mb-4'>選擇付款方式</h2>
      <div className='text-center py-8'>
        <div className={`${color} text-lg font-medium mb-2`}>{title}</div>
        <p className='text-gray-600 text-sm'>{message}</p>
      </div>
    </div>
  );
}
