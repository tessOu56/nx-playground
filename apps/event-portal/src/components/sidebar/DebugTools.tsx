'use client';

import { Button } from '@nx-playground/ui-components';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

interface DebugToolsProps {
  orderId?: string;
  className?: string;
}

export function DebugTools({ orderId, className }: DebugToolsProps) {
  const queryClient = useQueryClient();
  const params = useParams();

  // 動態獲取 orderId（如果沒有通過 props 傳遞）
  const currentOrderId = orderId ?? (params?.orderId as string);

  // 調試按鈕 - 清除 cache
  const clearCache = () => {
    if (currentOrderId) {
      queryClient.removeQueries({ queryKey: ['order', currentOrderId] });
    }
    window.location.reload();
  };

  // 如果沒有 orderId，不顯示調試工具
  if (!currentOrderId) {
    return null;
  }

  return (
    <div
      className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}
    >
      <h3 className='text-sm font-medium text-yellow-900 mb-2'>
        <span role='img' aria-label='調試'>
          🐛
        </span>{' '}
        調試工具
      </h3>
      <p className='text-xs text-yellow-700 mb-3'>
        如果 UI 沒有正確顯示，請點擊下方按鈕清除 cache
      </p>
      <Button
        onClick={clearCache}
        className='w-full bg-yellow-600 hover:bg-yellow-700 text-white'
        size='sm'
      >
        清除 Cache 並重新載入
      </Button>
    </div>
  );
}
