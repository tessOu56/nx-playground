import { type Metadata } from 'next';
import { connection } from 'next/server';

import { FeaturedCities } from './components/FeaturedCities';
import { HeroSection } from './components/HeroSection';
import { UserFlowSection } from './components/UserFlowSection';

import { loadPortalCatalog } from '@/libs/exhibition-search/load-portal';
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
  await connection();
  const { locale } = await params;
  let events: Awaited<ReturnType<typeof loadPortalCatalog>> = [];
  try {
    events = await loadPortalCatalog();
  } catch {
    events = [];
  }

  return (
    <div className='min-h-screen bg-background'>
      <HeroSection />
      <FeaturedCities events={events} locale={locale} />
      <UserFlowSection locale={locale} />
    </div>
  );
}
