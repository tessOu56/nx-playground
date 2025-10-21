/**
 * Status 徽章組件
 * 用於顯示專案狀態
 */

import { type FC } from 'react';

interface StatusBadgeProps {
  status: 'production' | 'development' | 'coming-soon';
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    production: {
      label: '生產中',
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
    development: {
      label: '開發中',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    },
    'coming-soon': {
      label: '即將推出',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    },
  };

  const config = statusConfig[status];

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

