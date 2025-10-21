/**
 * Blog feature type definitions
 */

export type SupportedLocale = 'zh-TW' | 'en';

export type BlogCategory = 'apps' | 'libs';

export interface BlogPost {
  slug: string;
  title: string;
  category: BlogCategory;
  tags: string[];
  date: string;
  updated?: string;
  excerpt: string;
  content: string; // HTML content
  readingTime: string;
  lang: SupportedLocale;
  published: boolean;
  author?: string;
}
