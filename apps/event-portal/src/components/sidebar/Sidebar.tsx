'use client';

import { Sidebar as BaseSidebar } from '@nx-playground/ui-components';
import { type FC } from 'react';

import { DebugTools } from './DebugTools';

interface SidebarProps {
  className?: string;
  orderId?: string;
}

export const EventsSidebar: FC<SidebarProps> = ({ className, orderId }) => {
  return (
    <BaseSidebar
      className={className}
      title='🔧 開發工具'
      description='系統狀態和除錯資訊'
    >
      {/* 系統狀態 */}
      <div className='mb-8'>
        <div className='bg-gray-50 rounded-lg p-4'>
          <h3 className='text-sm font-medium text-gray-900 mb-2'>系統狀態</h3>
          <p className='text-sm text-gray-600'>系統運行正常</p>
        </div>
      </div>

      {/* 除錯資訊 */}
      <div className='mb-8'>
        <div className='bg-gray-50 rounded-lg p-4'>
          <h3 className='text-sm font-medium text-gray-900 mb-2'>除錯資訊</h3>
          <p className='text-sm text-gray-600'>無特殊資訊</p>
        </div>
      </div>

      {/* 調試工具 */}
      <div className='mb-8'>
        <DebugTools orderId={orderId} />
      </div>
    </BaseSidebar>
  );
};
