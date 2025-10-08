'use client';

import { type FC } from 'react';

import { cn } from '../../../utils';
import { Button } from '../Button/Button';

export interface ToastItemProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  action?: {
    label: string;
    onClick: () => void;
  };
  index: number;
}

export const ToastItem: FC<ToastItemProps> = ({
  message,
  type = 'info',
  action,
  index,
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  // 根據位置計算透明度：由下往上(新到舊)依序為 100, 90, 60, 30, 其他 0
  const getOpacity = () => {
    switch (index) {
      case 0:
        return 1.0; // 最新的 (100%)
      case 1:
        return 0.9; // 第二個 (90%)
      case 2:
        return 0.6; // 第三個 (60%)
      case 3:
        return 0.3; // 第四個 (30%)
      default:
        return 0.0; // 其他 (0%)
    }
  };
  const opacity = getOpacity();

  return (
    <div
      className={cn(
        'flex items-center justify-between w-[264px] px-4 py-3 rounded-md border shadow-sm transition-opacity duration-300',
        getTypeStyles()
      )}
      style={{
        opacity,
      }}
    >
      <div className='flex-1 min-w-0'>
        <p className='text-sm leading-5 line-clamp-2'>{message}</p>
      </div>
      {action && (
        <Button
          variant='outline'
          size='sm'
          onClick={action.onClick}
          className='ml-4 h-7 w-8 px-0 text-xs'
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};
