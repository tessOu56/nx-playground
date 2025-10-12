import { type Metadata } from 'next';
import { Suspense } from 'react';

import { HeroSection } from './components/HeroSection';
import { HomePageClient } from './components/HomePageClient';
import { HomeSkeleton } from './components/HomeSkeleton';
import { UserFlowSection } from './components/UserFlowSection';

import { PageConfigs } from '@/libs';

// 使用混合頁面配置，首頁可以緩存但有時需要更新
export const { dynamic, revalidate, fetchCache, ssr } = PageConfigs.home;

export const metadata: Metadata = {
  title: 'NX Playground Events - LINE 登入 | 活動平台',
  description:
    '使用 LINE 帳號登入，開始探索精彩活動。連接活動主辦方與參與者，提供簡化的活動發現和報名體驗',
  keywords: ['LINE 登入', '活動平台', '用戶流程', 'NX Playground', 'Events', 'LIFF'],
};

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
      {/* Hero Section */}
      <HeroSection />

      {/* 用戶流程 */}
      <UserFlowSection />

      {/* Client Component 處理互動邏輯 */}
      <section id='login-section' className='py-24 bg-gray-50'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
              LINE 登入
            </h2>
            <p className='mt-4 text-lg leading-8 text-gray-600'>
              使用您的 LINE 帳號登入，開始探索精彩活動
            </p>
          </div>

          <div className='mt-16 text-center'>
            <Suspense fallback={<HomeSkeleton />}>
              <HomePageClient />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  );
}
