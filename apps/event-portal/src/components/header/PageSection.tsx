'use client';

import { Fragment, type FC } from 'react';

import { PageButton } from './PageButton';

import type { PageInfo } from '@/types';

interface PageSectionProps {
  title: string;
  pages: PageInfo[];
  currentPathname: string;
  onPageClick: (page: PageInfo) => void;
}

export const PageSection: FC<PageSectionProps> = ({
  title,
  pages,
  currentPathname,
  onPageClick,
}) => {
  const isCurrentPage = (page: PageInfo) => {
    return (
      page.path.replace(/\/\[.*?\]/g, '/[id]') ===
      currentPathname.replace(/\/\[.*?\]/g, '/[id]')
    );
  };

  if (pages.length === 0) {
    return null;
  }

  return (
    <div className='flex items-center space-x-3 overflow-x-auto'>
      <div className='flex items-center space-x-2'>
        <span className='text-xs text-gray-500 font-medium whitespace-nowrap'>
          {title}
        </span>
        {pages.map((page, index) => (
          <Fragment key={page.number}>
            <PageButton
              page={page}
              isCurrentPage={isCurrentPage(page)}
              onClick={onPageClick}
            />
            {index < pages.length - 1 && (
              <span className='text-gray-300 text-xs'>|</span>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
