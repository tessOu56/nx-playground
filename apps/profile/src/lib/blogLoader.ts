import matter from 'gray-matter';

import type { BlogPost, BlogMetadata } from '../types/blogData';
import type { SupportedLocale } from './i18n/LocaleRouter';

/**
 * Fetch blog markdown content from specs/blogs/
 */
async function fetchBlog(
  slug: string,
  locale: SupportedLocale
): Promise<string | null> {
  const fileName = locale === 'zh-TW' ? `${slug}.zh-TW.md` : `${slug}.md`;
  const url = `/specs/blogs/${fileName}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Try fallback locale
      const fallbackFile =
        locale === 'zh-TW' ? `${slug}.md` : `${slug}.zh-TW.md`;
      const fallbackUrl = `/specs/blogs/${fallbackFile}`;

      const fallbackResponse = await fetch(fallbackUrl);
      if (!fallbackResponse.ok) {
        console.warn(`Blog not found: ${slug}`);
        return null;
      }
      return await fallbackResponse.text();
    }
    return await response.text();
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
  // Hardcoded blog slugs for now
  // TODO: Generate this list dynamically or from a manifest file
  const blogSlugs = [
    '2025-nx-deep-dive',
    '2024-architecture-patterns',
    '2023-monorepo-adventure',
    '2022-typescript-mastery',
    '2021-fullstack-evolution',
    '2020-react-journey',
    '2019-tech-review',
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
