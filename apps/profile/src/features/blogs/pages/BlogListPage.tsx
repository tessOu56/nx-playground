/**
 * Blog list page - displays blog posts with filtering by year and tags
 */

import { type FC, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { BlogCard } from '../../../components/BlogCard';
import { loadAllBlogMetadata } from '../../../lib/blogLoader';
import { type SupportedLocale } from '../../../lib/i18n/LocaleRouter';
import type { BlogMetadata } from '../../../types/blogData';

export const BlogListPage: FC = () => {
  const { locale } = useParams<{ locale: string }>();
  const currentLocale = (locale ?? 'en') as SupportedLocale;
  const [searchParams] = useSearchParams();

  const [blogs, setBlogs] = useState<BlogMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Read URL params
  useEffect(() => {
    const yearParam = searchParams.get('year');
    const tagParam = searchParams.get('tag');
    
    if (yearParam) setSelectedYear(parseInt(yearParam));
    if (tagParam) setSelectedTag(tagParam);
  }, [searchParams]);

  // Load blogs
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const blogData = await loadAllBlogMetadata(currentLocale);
        setBlogs(blogData);
      } catch (error) {
        console.error('Error loading blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentLocale]);

  // Extract unique years and tags
  const years = useMemo(() => {
    const uniqueYears = Array.from(
      new Set(blogs.filter(b => b.year).map(b => b.year!))
    ).sort((a, b) => b - a); // Newest first
    return uniqueYears;
  }, [blogs]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    blogs.forEach(blog => blog.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [blogs]);

  // Filter blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      // Year filter
      if (selectedYear !== 'all' && blog.year !== selectedYear) {
        return false;
      }

      // Tag filter
      if (selectedTag && !blog.tags.includes(selectedTag)) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          blog.title.toLowerCase().includes(query) ||
          blog.excerpt.toLowerCase().includes(query) ||
          blog.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [blogs, selectedYear, selectedTag, searchQuery]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-lg text-gray-600 dark:text-gray-400'>Loading blogs...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            Blog
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>
            Annual tech journey and reflections: My work experience, learning, and growth
          </p>
        </div>

        {/* Search Bar */}
        <div className='max-w-2xl mx-auto mb-8'>
          <input
            type='search'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder='Search blogs...'
            className='w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {/* Filters */}
        <div className='flex flex-wrap gap-4 mb-8 justify-center'>
          {/* Year Filter */}
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Year:</span>
            <button
              onClick={() => setSelectedYear('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedYear === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {years.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedYear === year
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Tag Filter */}
          {selectedTag && (
            <div className='flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg'>
              <span className='text-sm text-blue-700 dark:text-blue-300'>
                Tag: {selectedTag}
              </span>
              <button
                onClick={() => setSelectedTag(null)}
                className='text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100'
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className='text-center mb-8 text-gray-600 dark:text-gray-400'>
          Found {filteredBlogs.length} blog{filteredBlogs.length !== 1 ? 's' : ''}
        </div>

        {/* Blogs Grid */}
        {filteredBlogs.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {filteredBlogs.map(blog => (
              <BlogCard key={blog.slug} blog={blog} />
            ))}
          </div>
        ) : (
          <div className='text-center py-16'>
            <p className='text-lg text-gray-600 dark:text-gray-400 mb-2'>
              No blogs found
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-500'>
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
