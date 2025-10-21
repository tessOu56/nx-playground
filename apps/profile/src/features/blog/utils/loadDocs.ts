/**
 * Documentation loading utilities
 * Uses Vite's import.meta.glob to dynamically load Markdown files
 */

import matter from 'gray-matter';
import readingTime from 'reading-time';
import { remark } from 'remark';
import html from 'remark-html';
import type { BlogPost, BlogCategory, SupportedLocale } from '../types';

/**
 * Dynamically import all Markdown files from docs directory
 * Using Vite's import.meta.glob with ?raw query to get file contents
 */
const docsModules = import.meta.glob<string>('/docs/**/*.md', {
  query: '?raw',
  import: 'default',
});

/**
 * Parse Markdown file content and extract metadata
 */
async function parseMarkdownFile(
  filePath: string,
  content: string
): Promise<BlogPost | null> {
  try {
    // Parse front matter
    const { data, content: markdownContent } = matter(content);

    // Skip if not published
    if (data.published === false) {
      return null;
    }

    // Extract category and locale from file path
    // Path format: /docs/apps/zh-TW/FILENAME.md or /docs/libs/en/FILENAME.md
    const pathMatch = filePath.match(
      /\/docs\/(apps|libs)\/(zh-TW|en)\/(.+)\.md$/
    );
    if (!pathMatch) {
      console.warn(`Invalid file path format: ${filePath}`);
      return null;
    }

    const [, category, lang, filename] = pathMatch;

    // Convert Markdown to HTML
    const processedContent = await remark().use(html).process(markdownContent);
    const htmlContent = processedContent.toString();

    // Calculate reading time
    const stats = readingTime(markdownContent);

    // Create slug from filename
    const slug = filename.toLowerCase().replace(/\s+/g, '-');

    return {
      slug,
      title: data.title || filename,
      category: category as BlogCategory,
      tags: data.tags || [],
      date: data.date || new Date().toISOString().split('T')[0],
      updated: data.updated,
      excerpt: data.excerpt || '',
      content: htmlContent,
      readingTime: stats.text,
      lang: lang as SupportedLocale,
      published: data.published !== false,
      author: data.author,
    };
  } catch (error) {
    console.error(`Error parsing file ${filePath}:`, error);
    return null;
  }
}

/**
 * Load all blog posts for a given locale
 * Falls back to zh-TW if locale content is not available
 */
export async function loadAllPosts(
  locale: SupportedLocale = 'zh-TW'
): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];
  const fallbackPosts: Map<string, BlogPost> = new Map();

  // Load all matching files
  for (const [path, loader] of Object.entries(docsModules)) {
    // Skip non-matching locales
    if (!path.includes(`/${locale}/`) && !path.includes('/zh-TW/')) {
      continue;
    }

    try {
      const content = await loader();
      const post = await parseMarkdownFile(path, content);

      if (post) {
        if (post.lang === locale) {
          posts.push(post);
        } else if (post.lang === 'zh-TW') {
          // Store as fallback
          fallbackPosts.set(post.slug, post);
        }
      }
    } catch (error) {
      console.error(`Error loading ${path}:`, error);
    }
  }

  // Add fallback posts for missing locales
  if (locale !== 'zh-TW') {
    const existingSlugs = new Set(posts.map(p => p.slug));
    for (const [slug, fallbackPost] of fallbackPosts) {
      if (!existingSlugs.has(slug)) {
        posts.push({ ...fallbackPost, lang: locale }); // Mark as current locale but with fallback content
      }
    }
  }

  // Sort by date (newest first)
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Load a single post by slug
 * Falls back to zh-TW if locale version is not available
 */
export async function loadPostBySlug(
  slug: string,
  locale: SupportedLocale = 'zh-TW'
): Promise<BlogPost | null> {
  // Try to find the post in the requested locale
  const localePath = `/docs/apps/${locale}/${slug.toUpperCase()}.md`;
  const libsLocalePath = `/docs/libs/${locale}/${slug.toUpperCase()}.md`;

  // Try apps first
  if (docsModules[localePath]) {
    try {
      const content = await docsModules[localePath]();
      return await parseMarkdownFile(localePath, content);
    } catch (error) {
      console.error(`Error loading ${localePath}:`, error);
    }
  }

  // Try libs
  if (docsModules[libsLocalePath]) {
    try {
      const content = await docsModules[libsLocalePath]();
      return await parseMarkdownFile(libsLocalePath, content);
    } catch (error) {
      console.error(`Error loading ${libsLocalePath}:`, error);
    }
  }

  // Fallback to zh-TW if not found
  if (locale !== 'zh-TW') {
    const fallbackPath = `/docs/apps/zh-TW/${slug.toUpperCase()}.md`;
    const fallbackLibsPath = `/docs/libs/zh-TW/${slug.toUpperCase()}.md`;

    if (docsModules[fallbackPath]) {
      try {
        const content = await docsModules[fallbackPath]();
        const post = await parseMarkdownFile(fallbackPath, content);
        return post ? { ...post, lang: locale } : null;
      } catch (error) {
        console.error(`Error loading fallback ${fallbackPath}:`, error);
      }
    }

    if (docsModules[fallbackLibsPath]) {
      try {
        const content = await docsModules[fallbackLibsPath]();
        const post = await parseMarkdownFile(fallbackLibsPath, content);
        return post ? { ...post, lang: locale } : null;
      } catch (error) {
        console.error(`Error loading fallback ${fallbackLibsPath}:`, error);
      }
    }
  }

  return null;
}

/**
 * Get all unique tags from all posts
 */
export async function getAllTags(
  locale: SupportedLocale = 'zh-TW'
): Promise<string[]> {
  const posts = await loadAllPosts(locale);
  const tagsSet = new Set<string>();

  posts.forEach(post => {
    post.tags.forEach(tag => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(
  category: BlogCategory,
  locale: SupportedLocale = 'zh-TW'
): Promise<BlogPost[]> {
  const posts = await loadAllPosts(locale);
  return posts.filter(post => post.category === category);
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(
  tag: string,
  locale: SupportedLocale = 'zh-TW'
): Promise<BlogPost[]> {
  const posts = await loadAllPosts(locale);
  return posts.filter(post => post.tags.includes(tag));
}
