import { type Metadata } from 'next';

import { getPageInfoByPath } from '@/libs';

export function generateMetadata(pathname: string): Metadata {
  const pageInfo = getPageInfoByPath(pathname);

  if (!pageInfo?.seo) {
    return {
      title: 'NX Playground Events - 活動管理平台',
      description: '基於 LIFF 的活動管理平台，提供豐富的活動體驗',
    };
  }

  const { seo } = pageInfo;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.join(', ') ?? '',
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
  };
}

export function generatePageMetadata(pathname: string): Metadata {
  const baseMetadata = generateMetadata(pathname);

  return {
    ...baseMetadata,
    alternates: {
      canonical: `https://events.nx-playground.local${pathname}`,
    },
  };
}
