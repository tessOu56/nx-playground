import { type Metadata } from 'next';

import { HeroSection } from './components/HeroSection';
import { UserFlowSection } from './components/UserFlowSection';

import { PageConfigs } from '@/libs';
import { demoCopy } from '@/libs/i18n/demo-copy';

export const { dynamic, revalidate, fetchCache, ssr } = PageConfigs.home;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = demoCopy(locale);
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    keywords: ['Taipei', 'Tokyo', 'exhibition', 'LINE', 'NX Playground'],
  };
}

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <HeroSection />
      <UserFlowSection />
    </div>
  );
}
