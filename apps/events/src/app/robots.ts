import { type MetadataRoute } from 'next';

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
    sitemap: 'https://events.nx-playground.local/sitemap.xml',
  };
}
