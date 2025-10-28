import { track } from '@nx-playground/analytics';
import { logger } from '@nx-playground/logger';
import { usePostViews } from '@nx-playground/supabase-client';
import { formatDate, formatNumber } from '@nx-playground/utils';
import { Eye, Users } from 'lucide-react';
import type { FC } from 'react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { loadBlog } from '../../../lib/blogLoader';
import type { SupportedLocale } from '../../../lib/i18n/LocaleRouter';
import { useLocalizedNavigation } from '../../../lib/i18n/useLocalizedNavigation';
import type { BlogPost } from '../../../types/blogData';

export const BlogPostPage: FC = () => {
  const { locale, slug } = useParams<{ locale: string; slug: string }>();
  const currentLocale = (locale ?? 'en') as SupportedLocale;
  const navigate = useNavigate();
  const { getLocalizedPath } = useLocalizedNavigation();

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const startTimeRef = useRef<number>(Date.now());

  // Track post views with Supabase
  const { stats, trackView } = usePostViews(slug || '');

  useEffect(() => {
    const loadData = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        logger.debug('Loading blog post', { slug, locale: currentLocale });

        const blogData = await logger.time('load-blog', async () => {
          return await loadBlog(slug, currentLocale);
        });

          setBlog(blogData);
          logger.info('Blog post loaded', {
            slug,
            title: blogData?.title,
            locale: currentLocale,
          });

          // Track blog view
          if (blogData) {
            track('blog_viewed', {
              slug,
              title: blogData.title,
              year: blogData.year || '',
              locale: currentLocale,
              readingTime: blogData.readingTime || 0,
            });
          }
      } catch (error) {
        logger.error('Failed to load blog post', error, {
          slug,
          locale: currentLocale,
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug, currentLocale]);

  // Track view on mount (with slight delay to avoid double counting)
  useEffect(() => {
    if (!slug) return;

    const timer = setTimeout(async () => {
      logger.debug('Tracking blog view', { slug });
      await trackView();
    }, 1000); // 1 second delay

      return () => clearTimeout(timer);
    }, [slug, trackView]);

  // Track reading time on unmount
  useEffect(() => {
    return () => {
      if (blog) {
        const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
        track('blog_read_time', {
          slug: slug || '',
          title: blog.title,
          timeSpent,
          completed: timeSpent >= (blog.readingTime || 0) * 60 * 0.8, // 80% of estimated time
        });
      }
    };
  }, [blog, slug]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-lg text-gray-600 dark:text-gray-400'>Loading...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            Blog Not Found
          </h1>
          <button
            onClick={() => navigate(getLocalizedPath('/blogs'))}
            className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  // Format publish date using utils
  const publishDate = formatDate(new Date(blog.publishDate), 'YYYY-MM-DD');

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <article className='max-w-4xl mx-auto px-4 py-12'>
        {/* Breadcrumb */}
        <nav className='mb-8'>
          <button
            onClick={() => navigate(getLocalizedPath('/blogs'))}
            className='text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2'
          >
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
            Back to Blogs
          </button>
        </nav>

        {/* Header */}
        <header className='mb-8'>
          {blog.coverImage && (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className='w-full h-64 md:h-96 object-cover rounded-xl mb-8'
            />
          )}

          <div className='flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4 flex-wrap'>
            <time dateTime={blog.publishDate}>{publishDate}</time>
            {blog.readingTime && <span>• {blog.readingTime} min read</span>}
            {blog.year && (
              <span className='px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold'>
                {blog.year}
              </span>
            )}

            {/* View Stats */}
            {stats && (
              <>
                <span className='flex items-center gap-1.5'>
                  <Eye className='w-4 h-4' />
                  {formatNumber(stats.totalViews)} views
                </span>
                <span className='flex items-center gap-1.5'>
                  <Users className='w-4 h-4' />
                  {formatNumber(stats.uniqueIps)} visitors
                </span>
              </>
            )}
          </div>

          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className='text-xl text-gray-600 dark:text-gray-400 mb-6'>
              {blog.excerpt}
            </p>
          )}

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className='flex flex-wrap gap-2 mb-6'>
              {blog.tags.map(tag => (
                <span
                  key={tag}
                  className='px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full'
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Tech Stack */}
          {blog.techStack && blog.techStack.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {blog.techStack.map(tech => (
                <span
                  key={tech}
                  className='px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded font-medium'
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <div
          className='prose prose-lg dark:prose-invert max-w-none mb-12'
          dangerouslySetInnerHTML={{ __html: renderMarkdown(blog.content) }}
        />

        {/* Footer */}
        <footer className='border-t border-gray-200 dark:border-gray-700 pt-8'>
          <div className='flex items-center justify-between'>
            <button
              onClick={() => navigate(getLocalizedPath('/blogs'))}
              className='px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600'
            >
              ← All Blogs
            </button>

            {blog.year && (
              <button
                onClick={() =>
                  navigate(getLocalizedPath(`/blogs?year=${blog.year}`))
                }
                className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
              >
                More from {blog.year} →
              </button>
            )}
          </div>
        </footer>
      </article>
    </div>
  );
};

// Custom markdown renderer
// Decision: Keep this lightweight implementation instead of adding react-markdown dependency
// Rationale: Works well for current needs, no additional bundle size, simple to maintain
// If more complex markdown features are needed in the future, consider react-markdown or remark-html
function renderMarkdown(markdown: string): string {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-blue-600 hover:underline">$1</a>'
  );

  // Code blocks
  html = html.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    '<pre><code class="language-$1">$2</code></pre>'
  );

  // Inline code
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">$1</code>'
  );

  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');

  // Lists
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // Wrap in paragraphs
  html = `<p>${html}</p>`;

  return html;
}
