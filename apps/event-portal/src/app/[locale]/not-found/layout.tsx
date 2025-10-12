import { type Metadata } from 'next';

import { PageConfigs } from '@/libs';

// 使用靜態頁面配置，404 頁面不需要動態渲染
export const { dynamic, revalidate, fetchCache, ssr } = PageConfigs.static;

export const metadata: Metadata = {
  title: '頁面未找到 - NX Playground Events',
  description: '抱歉，您訪問的頁面不存在',
  keywords: ['404', '頁面未找到', 'NX Playground', 'Events'],
};

export default function NotFoundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='max-w-md w-full mx-auto px-4'>
        <div className='text-center'>
          <h1 className='text-6xl font-bold text-gray-900 mb-4'>404</h1>
          <h2 className='text-2xl font-semibold text-gray-700 mb-6'>
            頁面未找到
          </h2>
          <p className='text-gray-600 mb-8'>
            抱歉，您訪問的頁面不存在或已被移除
          </p>

          {/* 子頁面內容 */}
          {children}
        </div>
      </div>
    </div>
  );
}
