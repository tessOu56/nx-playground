import { type Metadata } from 'next';

import { PageConfigs } from '@/libs';

// 使用表單頁面配置，避免預渲染問題
export const { dynamic, revalidate, fetchCache, ssr } = PageConfigs.form;

export const metadata: Metadata = {
  title: '意見回饋 - NX Playground Events',
  description: '提供平台意見回饋和客服支援',
  keywords: ['意見回饋', '客服支援', '平台建議'],
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='page-container'>{children}</div>
    </div>
  );
}
