'use client';

import type { FC } from 'react';

import { PageSection } from './PageSection';
import { usePageNavigation } from './usePageNavigation';

interface PageNumberBreadcrumbProps {
  className?: string;
  maxItems?: number;
}

export const PageNumberBreadcrumb: FC<PageNumberBreadcrumbProps> = ({
  className = '',
  maxItems: _maxItems = 5,
}) => {
  const { pathname, locale, mainFlowPages, orderStatusPages, handlePageClick } =
    usePageNavigation();

  return (
    <div
      className={`bg-gray-50 border-b border-gray-200 py-3 px-4 ${className}`}
    >
      <div className='max-w-7xl mx-auto space-y-3'>
        {/* 第一行：主要流程頁面 (P01-P08) */}
        <PageSection
          title={locale === 'en' ? 'Main Flow:' : '主要流程:'}
          pages={mainFlowPages}
          currentPathname={pathname}
          onPageClick={handlePageClick}
        />

        {/* 第二行：訂單狀態頁面 (P05a-P05f, P09+) */}
        <PageSection
          title={locale === 'en' ? 'Order Status:' : '訂單狀態:'}
          pages={orderStatusPages}
          currentPathname={pathname}
          onPageClick={handlePageClick}
        />
      </div>
    </div>
  );
};
