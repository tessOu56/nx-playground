'use client';

import type { FC } from 'react';

import type { PageInfo } from '@/types';

interface PageButtonProps {
  page: PageInfo;
  isCurrentPage: boolean;
  onClick: (page: PageInfo) => void;
}

export const PageButton: FC<PageButtonProps> = ({
  page,
  isCurrentPage,
  onClick,
}) => {
  return (
    <button
      onClick={() => onClick(page)}
      className={`flex items-center flex-wrap space-x-1 px-2 py-1 rounded text-xs transition-colors hover:bg-gray-100 ${
        isCurrentPage
          ? 'bg-blue-100 text-blue-700 font-semibold cursor-default'
          : 'text-gray-600 hover:text-gray-900 cursor-pointer'
      }`}
      disabled={isCurrentPage}
    >
      <span className='font-mono'>{page.number}</span>
      <span className='hidden sm:inline'> - </span>
      <span className='hidden sm:inline'>{page.title}</span>
    </button>
  );
};
