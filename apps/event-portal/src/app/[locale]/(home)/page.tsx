import { type Metadata } from 'next';

import { HeroSection } from './components/HeroSection';
import { UserFlowSection } from './components/UserFlowSection';

import { PageConfigs } from '@/libs';

export const { dynamic, revalidate, fetchCache, ssr } = PageConfigs.home;

export const metadata: Metadata = {
  title: 'NX Playground Events | 活動發現與報名',
  description: '發現活動、用 LINE 登入報名，票券與訂單綁在您的帳號。',
  keywords: ['LINE 登入', '活動平台', '報名', '票券', 'NX Playground Events'],
};

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
      <HeroSection />
      <UserFlowSection />
    </div>
  );
}
