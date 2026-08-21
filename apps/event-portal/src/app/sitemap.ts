import { type MetadataRoute } from 'next';

import { pageNumbers } from '../libs';
import { publicSiteUrl } from '../libs/seo/public-site-url';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = publicSiteUrl();

  // 從頁面配置生成 sitemap 條目
  const pages = Object.values(pageNumbers)
    .filter(page => page.isPublic !== false) // 只包含公開頁面
    .map(page => ({
      url: `${baseUrl}${page.path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: page.number === 'P01' ? 1 : 0.8, // 首頁優先級最高
    }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...pages,
  ];
}
