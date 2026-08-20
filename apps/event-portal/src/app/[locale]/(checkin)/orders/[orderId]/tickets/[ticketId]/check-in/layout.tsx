import { BackLink } from '@/components/nav/BackLink';
import { PageConfigs } from '@/libs';

// 使用表單頁面配置，避免預渲染問題
export const { dynamic, revalidate, fetchCache, ssr } = PageConfigs.form;

export default async function CheckInLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; orderId: string }>;
}) {
  const { locale, orderId } = await params;

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='page-container'>
        <div className='mb-8'>
          <BackLink href={`/${locale}/orders/${orderId}`} />
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>票券簽到</h1>
            <p className='text-gray-600'>掃描 QR Code 完成活動簽到</p>
          </div>
        </div>

        {/* 子頁面內容 */}
        <div className='space-y-6'>{children}</div>
      </div>
    </div>
  );
}
