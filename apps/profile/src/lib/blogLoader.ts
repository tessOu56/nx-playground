import { logger } from '@nx-playground/logger';
import matter from 'gray-matter';

import type { BlogPost, BlogMetadata } from '../types/blogData';
import type { SupportedLocale } from './i18n/LocaleRouter';

/**
 * Fetch blog markdown content from specs/blogs/
 * Supports bilingual files: YYYY-MM.en.md and YYYY-MM.zh-TW.md
 */
async function fetchBlog(
  slug: string,
  locale: SupportedLocale
): Promise<string | null> {
  // Try locale-specific version first
  const url = `/specs/blogs/${slug}.${locale}.md`;

  try {
    const response = await fetch(url);
      if (!response.ok) {
        // If zh-TW not found, fallback to English
        if (locale === 'zh-TW') {
          logger.warn(`Blog not found for locale, falling back to en`, { slug, locale });
          const fallbackUrl = `/specs/blogs/${slug}.en.md`;
          const fallbackResponse = await fetch(fallbackUrl);
          if (!fallbackResponse.ok) {
            logger.warn(`Blog not found`, { slug });
            return null;
          }
          return await fallbackResponse.text();
        }
        logger.warn(`Blog not found`, { slug, locale });
        return null;
      }
      const content = await response.text();
      return content;
    } catch (error) {
      logger.error(`Failed to fetch blog`, error, { slug, locale });
      return null;
    }
}

/**
 * Parse blog markdown with front matter
 */
function parseBlog(content: string, slug: string): BlogPost | null {
  try {
    const { data, content: markdown } = matter(content);

    if (!data.title) {
      logger.warn(`Blog missing title in front matter`, { slug });
      return null;
    }

    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = markdown.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return {
      id: data.id || slug,
      slug: data.slug || slug,
      title: data.title,
      excerpt: data.excerpt || '',
      content: markdown,
      publishDate: data.publishDate || data.date || new Date().toISOString(),
      year: data.year,
      techStack: data.techStack || [],
      tags: data.tags || [],
      coverImage: data.coverImage,
      author: data.author,
      readingTime: data.readingTime || readingTime,
    };
  } catch (error) {
    logger.error(`Failed to parse blog`, error, { slug });
    return null;
  }
}

/**
 * Load a single blog post
 */
export async function loadBlog(
  slug: string,
  locale: SupportedLocale = 'en'
): Promise<BlogPost | null> {
  const content = await fetchBlog(slug, locale);
  if (!content) return null;

  return parseBlog(content, slug);
}

/**
 * Load all blogs
 * Note: This is a placeholder. In production, you'd maintain a manifest
 * or scan the directory server-side.
 */
export async function loadAllBlogs(
  locale: SupportedLocale = 'en'
): Promise<BlogPost[]> {
  // Blog slugs in YYYY-12 format (all published in December)
  const blogSlugs = [
    '2025-12',
    '2024-12',
    '2023-12',
    '2022-12',
    '2021-12',
    '2020-12',
    '2019-12',
  ];

  const blogs: BlogPost[] = [];

  for (const slug of blogSlugs) {
    try {
      const blog = await loadBlog(slug, locale);
      if (blog) {
        blogs.push(blog);
      }
    } catch (error) {
      logger.error(`Failed to load blog`, error, { slug, locale });
    }
  }

  // Sort by publish date (newest first)
  return blogs.sort(
    (a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

/**
 * Get blog metadata only (without full content)
 */
export async function loadBlogMetadata(
  slug: string,
  locale: SupportedLocale = 'en'
): Promise<BlogMetadata | null> {
  const blog = await loadBlog(slug, locale);
  if (!blog) return null;

  const { content, ...metadata } = blog;
  return metadata;
}

/**
 * Get all blog metadata (for list pages)
 */
export async function loadAllBlogMetadata(
  locale: SupportedLocale = 'en'
): Promise<BlogMetadata[]> {
  const blogs = await loadAllBlogs(locale);
  return blogs.map(({ content, ...metadata }) => metadata);
}

/**
 * Filter blogs by year
 */
export async function loadBlogsByYear(
  year: number,
  locale: SupportedLocale = 'en'
): Promise<BlogPost[]> {
  const blogs = await loadAllBlogs(locale);
  return blogs.filter(blog => blog.year === year);
}

/**
 * Filter blogs by tag
 */
export async function loadBlogsByTag(
  tag: string,
  locale: SupportedLocale = 'en'
): Promise<BlogPost[]> {
  const blogs = await loadAllBlogs(locale);
  return blogs.filter(blog => blog.tags.includes(tag));
}
