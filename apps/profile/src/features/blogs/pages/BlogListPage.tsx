/**
 * Documentation search page - displays all technical documents with search and filtering
 */

import { type FC, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { type SupportedLocale } from '../../../lib/i18n/LocaleRouter';
import { BlogCard } from '../components/BlogCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { SearchBar } from '../components/SearchBar';
import { TagFilter } from '../components/TagFilter';
import { useBlogTranslation } from '../hooks/useBlogTranslation';
import type { BlogCategory, BlogPost } from '../types';
import { getAllTags, loadAllPosts } from '../utils/loadDocs';

export const BlogListPage: FC = () => {
  const { locale } = useParams<{ locale: string }>();
  const currentLocale = (locale ?? 'en') as SupportedLocale;
  const [searchParams, setSearchParams] = useSearchParams();

  const { t } = useBlogTranslation();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    BlogCategory | 'all'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Read tag from URL params on mount
  useEffect(() => {
    const tagFromUrl = searchParams.get('tag');
    if (tagFromUrl) {
      setSelectedTag(tagFromUrl);
      // Clear URL param after reading
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Load posts and tags
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [loadedPosts, loadedTags] = await Promise.all([
          loadAllPosts(currentLocale),
          getAllTags(currentLocale),
        ]);
        setPosts(loadedPosts);
        setAllTags(loadedTags);
      } catch (error) {
        console.error('Failed to load blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentLocale]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Category filter
      if (selectedCategory !== 'all' && post.category !== selectedCategory) {
        return false;
      }

      // Tag filter
      if (selectedTag && !post.tags.includes(selectedTag)) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [posts, selectedCategory, selectedTag, searchQuery]);

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <p className='text-muted-foreground'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Search-focused Header */}
      <header className='mb-8 max-w-3xl mx-auto'>
        <h1 className='text-3xl md:text-4xl font-bold text-foreground mb-3 text-center'>
          {t('title')}
        </h1>
        <p className='text-base text-muted-foreground text-center mb-6'>
          {t('subtitle')}
        </p>

        {/* Prominent Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t('searchPlaceholder')}
        />
      </header>

      {/* Filters */}
      <div className='mb-6 space-y-4'>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <TagFilter
          tags={allTags}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
        />
      </div>

      {/* Results Count & Active Filters */}
      {!loading && (
        <div className='mb-4 flex items-center gap-2 text-sm'>
          <span className='text-muted-foreground'>
            找到{' '}
            <span className='font-semibold text-foreground'>
              {filteredPosts.length}
            </span>{' '}
            個文件
          </span>
          {selectedTag && (
            <span className='inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs'>
              標籤: {selectedTag}
              <button
                onClick={() => setSelectedTag(null)}
                className='hover:bg-primary/20 rounded-full p-0.5'
              >
                <svg
                  className='h-3 w-3'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </span>
          )}
          {searchQuery && (
            <span className='inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs'>
              搜尋: {searchQuery}
              <button
                onClick={() => setSearchQuery('')}
                className='hover:bg-primary/20 rounded-full p-0.5'
              >
                <svg
                  className='h-3 w-3'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredPosts.map(post => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className='text-center py-16'>
          <svg
            className='mx-auto h-16 w-16 text-muted-foreground mb-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <p className='text-lg text-muted-foreground mb-2'>{t('noResults')}</p>
          <p className='text-sm text-muted-foreground'>
            試試調整搜尋關鍵字或標籤篩選
          </p>
        </div>
      )}
    </div>
  );
};
