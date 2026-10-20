import { type Metadata } from 'next';

import { FeaturedCities } from './components/FeaturedCities';
import { HeroSection } from './components/HeroSection';
import { UserFlowSection } from './components/UserFlowSection';

import { fetchPortalEvents } from '@/libs/api/event-stack-fetch';
import { demoCopy } from '@/libs/i18n/demo-copy';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = demoCopy(locale);
  const ogLocale =
    locale === 'en' ? 'en_US' : locale === 'ja' ? 'ja_JP' : 'zh_TW';
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    keywords: ['Taipei', 'Tokyo', 'exhibition', 'LINE', 'NX Playground'],
    openGraph: {
      title: copy.metaTitle,
      description: copy.metaDescription,
      locale: ogLocale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.metaTitle,
      description: copy.metaDescription,
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let events: Awaited<ReturnType<typeof fetchPortalEvents>> = [];
  try {
    events = await fetchPortalEvents();
  } catch {
    events = [];
  }

  return (
    <div className='min-h-screen bg-white'>
      <HeroSection />
      <FeaturedCities events={events} locale={locale} />
      <UserFlowSection locale={locale} />
    </div>
  );
}
