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
        console.warn(`Blog ${slug}.${locale}.md not found, falling back to en`);
        const fallbackUrl = `/specs/blogs/${slug}.en.md`;
        const fallbackResponse = await fetch(fallbackUrl);
        if (!fallbackResponse.ok) {
          console.warn(`Blog not found: ${slug}`);
          return null;
        }
        return await fallbackResponse.text();
      }
      console.warn(`Blog not found: ${slug}`);
      return null;
    }
    const content = await response.text();
    return content;
  } catch (error) {
    console.error(`Error fetching blog ${slug}:`, error);
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
      console.warn(`No title in front matter for blog: ${slug}`);
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
    console.error(`Error parsing blog ${slug}:`, error);
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
  // Blog slugs in YYYY-MM format (newest first)
  const blogSlugs = [
    '2025-01',
    '2024-06',
    '2023-08',
    '2022-05',
    '2021-07',
    '2020-09',
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
      console.error(`Error loading blog ${slug}:`, error);
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
