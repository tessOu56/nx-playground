import { type Metadata } from 'next';

import { getPageInfoByPath } from '@/libs';

export function generateMetadata(pathname: string): Metadata {
  const pageInfo = getPageInfoByPath(pathname);

  if (!pageInfo?.seo) {
    return {
      title: 'NX Playground — exhibitions in Taipei and Tokyo',
      description:
        'Search exhibitions in Taipei and Tokyo, then confirm on the official page or LINE.',
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
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nx-event-portal.vercel.app'}${pathname}`,
    },
  };
}
