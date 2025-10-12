import { PageConfigs } from '@/libs';

// 使用表單頁面配置，避免預渲染問題
export const { dynamic, revalidate, fetchCache, ssr } = PageConfigs.form;

export default function CheckInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='page-container'>
        {/* 頁面標題 - 簽到專用 */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>票券簽到</h1>
          <p className='text-gray-600'>掃描 QR Code 完成活動簽到</p>
        </div>

        {/* 子頁面內容 */}
        <div className='space-y-6'>{children}</div>
      </div>
    </div>
  );
}
