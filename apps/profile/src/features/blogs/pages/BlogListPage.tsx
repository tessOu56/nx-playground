import { logger } from '@nx-playground/logger';
/**
 * Blog list page - displays all blog posts sorted by year
 */

import { type FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { SEO } from '../../../components/SEO';
import { loadAllBlogMetadata } from '../../../lib/blogLoader';
import { type SupportedLocale } from '../../../lib/i18n/LocaleRouter';
import type { BlogMetadata } from '../../../types/blogData';
import { BlogCard } from '../components/BlogCard';

export const BlogListPage: FC = () => {
  const { locale } = useParams<{ locale: string }>();
  const currentLocale = (locale ?? 'en') as SupportedLocale;

  const [blogs, setBlogs] = useState<BlogMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  // Load blogs
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const blogData = await loadAllBlogMetadata(currentLocale);
        // Sort by year (newest first)
        const sortedBlogs = blogData.sort(
          (a, b) => (b.year || 0) - (a.year || 0)
        );
        setBlogs(sortedBlogs);
      } catch (error) {
        logger.error('Failed to load blogs', error, { locale: currentLocale });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentLocale]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-lg text-gray-600 dark:text-gray-400'>
          Loading blogs...
        </p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title='Blog'
        description='Read about my tech journey, development insights, and lessons learned. Articles covering React, TypeScript, Nx, monorepo architecture, and modern web development.'
        url='/blogs'
        tags={['Blog', 'Tech Journey', 'Development', 'React', 'TypeScript', 'Nx']}
      />
      
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4'>
        <div className='max-w-7xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-12'>
          <h1 className='text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            Blog
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>
            Annual tech journey and reflections: My work experience, learning,
            and growth
          </p>
        </div>

        {/* Blogs Grid */}
        {blogs.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {blogs.map(blog => (
              <BlogCard key={blog.slug} blog={blog} />
            ))}
          </div>
        ) : (
          <div className='text-center py-16'>
            <p className='text-lg text-gray-600 dark:text-gray-400'>
              No blogs found
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};
