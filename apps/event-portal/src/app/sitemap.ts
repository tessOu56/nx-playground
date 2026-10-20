import { type MetadataRoute } from 'next';

import { SUPPORTED_LOCALES } from '@/libs/constants';
import { publicSiteUrl } from '@/libs/seo/public-site-url';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = publicSiteUrl();
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1,
    },
    ...SUPPORTED_LOCALES.flatMap(locale => [
      {
        url: `${baseUrl}/${locale}`,
        lastModified,
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/${locale}/events`,
        lastModified,
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
    ]),
  ];
}
