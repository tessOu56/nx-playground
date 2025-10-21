/**
 * 統計數據行組件
 * 用於顯示專案統計資訊（Components, Hooks, Utilities）
 */

import { type FC } from 'react';

interface StatsRowProps {
  stats: {
    components?: number;
    hooks?: number;
    utilities?: number;
  };
}

export const StatsRow: FC<StatsRowProps> = ({ stats }) => {
  if (!stats || (!stats.components && !stats.hooks && !stats.utilities)) {
    return null;
  }

  return (
    <div className='flex gap-4 mb-4'>
      {stats.components !== undefined && (
        <div className='text-center'>
          <div className='text-2xl font-bold text-gray-900 dark:text-white'>
            {stats.components}+
          </div>
          <div className='text-xs text-gray-600 dark:text-gray-400'>Components</div>
        </div>
      )}
      {stats.hooks !== undefined && (
        <div className='text-center'>
          <div className='text-2xl font-bold text-gray-900 dark:text-white'>
            {stats.hooks}
          </div>
          <div className='text-xs text-gray-600 dark:text-gray-400'>Hooks</div>
        </div>
      )}
      {stats.utilities !== undefined && (
        <div className='text-center'>
          <div className='text-2xl font-bold text-gray-900 dark:text-white'>
            {stats.utilities}+
          </div>
          <div className='text-xs text-gray-600 dark:text-gray-400'>Utilities</div>
        </div>
      )}
    </div>
  );
};

