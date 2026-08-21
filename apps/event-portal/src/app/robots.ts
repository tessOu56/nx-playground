import { type MetadataRoute } from 'next';

import { publicSiteUrl } from '../libs/seo/public-site-url';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/staff',
          '/payment/',
          '/orders/',
          '/my-registrations',
          '/debug',
        ],
      },
    ],
    sitemap: `${publicSiteUrl()}/sitemap.xml`,
  };
}
