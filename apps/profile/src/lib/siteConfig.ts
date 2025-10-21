/**
 * Site 全域配置
 * Layout, Header, Footer 共用的資料
 */

export interface SiteConfig {
  siteName: string;
  siteUrl: string;
  social: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export const siteConfig: SiteConfig = {
  siteName: 'NX Playground',
  siteUrl: 'https://your-domain.com',
  social: {
    github: 'https://github.com/yourusername',
  },
};

