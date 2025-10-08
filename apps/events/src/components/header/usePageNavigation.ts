'use client';

import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

import { getPageNumbersWithLocale } from '@/libs';
import { useLocalizedRouter } from '@/libs/i18n';
import type { PageInfo } from '@/types';

export function usePageNavigation() {
  const pathname = usePathname();
  const router = useLocalizedRouter();
  const locale = useLocale();
  const { mainFlowPages, orderStatusPages } = getPageNumbersWithLocale(locale);

  const handlePageClick = (page: PageInfo) => {
    // 處理動態路由，使用示例 ID
    let targetPath = page.path as string;
    if (page.path.includes('[orderId]')) {
      targetPath = page.path.replace('[orderId]', 'demo-order-123');
    } else if (page.path.includes('[id]')) {
      targetPath = page.path.replace('[id]', 'demo-id-123');
    }

    // 路徑已經包含 locale，直接使用
    router.push(targetPath);
  };

  return {
    pathname,
    locale,
    mainFlowPages,
    orderStatusPages,
    handlePageClick,
  };
}
