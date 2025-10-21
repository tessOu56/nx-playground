/**
 * Category 徽章組件
 * 用於顯示專案分類
 */

import { type FC } from 'react';

interface CategoryBadgeProps {
  category: string;
  type?: 'app' | 'lib';
}

export const CategoryBadge: FC<CategoryBadgeProps> = ({ category, type }) => {
  // Apps 分類顏色
  const appCategoryColors = {
    react: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    angular: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    vue: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    nextjs: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  };

  // Libs 分類顏色
  const libCategoryColors = {
    ui: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    data: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    utils: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  const colorClass =
    type === 'lib'
      ? libCategoryColors[category as keyof typeof libCategoryColors]
      : appCategoryColors[category as keyof typeof appCategoryColors];

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        colorClass ?? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      }`}
    >
      {category.toUpperCase()}
    </span>
  );
};

