export interface MetaDataConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterSite?: string;
  canonical?: string;
}

export const createMetaDataConfig = (config: MetaDataConfig) => ({
  title: config.title ?? 'NX Playground Console',
  description: config.description ?? 'NX Playground Console Management System',
  keywords: config.keywords ?? ['nx-playground', 'console', 'management'],
  author: config.author ?? 'NX Playground Team',
  ogTitle: config.ogTitle ?? config.title ?? 'NX Playground Console',
  ogDescription:
    config.ogDescription ??
    config.description ??
    'NX Playground Console Management System',
  ogImage: config.ogImage ?? '/og-image.jpg',
  ogUrl: config.ogUrl ?? window.location.href,
  twitterCard: config.twitterCard ?? 'summary_large_image',
  twitterSite: config.twitterSite ?? '@nx-playground',
  canonical: config.canonical ?? window.location.href,
});
