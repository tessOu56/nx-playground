import { headers } from 'next/headers';

import { LabelledDemoBanner } from '@/components/demo/LabelledDemoBanner';
import { CatalogBackLink } from '@/components/nav/CatalogBackLink';
import { demoCopy } from '@/libs/i18n/demo-copy';
import { generateEventMetadata } from '@/libs/seo/metadataGenerators';

export const dynamic = 'force-dynamic';
export const generateMetadata = generateEventMetadata;

export default async function EventDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; eventId: string }>;
}) {
  const { locale } = await params;
  const copy = demoCopy(locale);

  // 檢查當前路由是否為 checkout
  // 使用更簡單的方法：直接檢查 URL 中的路徑段
  const headersList = await headers();
  const pathname =
    headersList.get('x-pathname') ?? headersList.get('x-url') ?? '';

  // 檢查當前路由是否為 checkout 頁面 - 確保 pathname 是字串且不為空
  const isCheckoutPage = pathname
    ? pathname.includes('/checkout') ||
      pathname.endsWith('/checkout') ||
      pathname.match(/\/[^/]+\/checkout$/) !== null
    : false;

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='page-container'>
        {/* 頁面標題 - 只在非 checkout 頁面顯示 */}
        {!isCheckoutPage && (
          <div className='mb-4'>
            <CatalogBackLink locale={locale} label={copy.backToEvents} />
            <div className='mt-3'>
              <LabelledDemoBanner locale={locale} />
            </div>
          </div>
        )}

        {/* 子頁面內容 */}
        {children}
      </div>
    </div>
  );
}
