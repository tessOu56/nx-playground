/**
 * Documentation detail page
 */

import { type FC, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { type SupportedLocale } from '../../../lib/i18n/LocaleRouter';
import { BlogPost } from '../components/BlogPost';
import { LanguageToggle } from '../components/LanguageToggle';
import { ShareButtons } from '../components/ShareButtons';
import { TableOfContents } from '../components/TableOfContents';
import { TagList } from '../components/TagList';
import { useBlogTranslation } from '../hooks/useBlogsTranslation';
import type { BlogPost as BlogPostType } from '../types';
import { loadPostBySlug } from '../utils/loadDocs';

export const BlogPostPage: FC = () => {
  const { slug, locale } = useParams<{ slug: string; locale: string }>();
  const currentLocale = (locale ?? 'en') as SupportedLocale;

  const { t } = useBlogTranslation();

  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  // Load post
  useEffect(() => {
    const loadData = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        const loadedPost = await loadPostBySlug(slug, currentLocale);
        setPost(loadedPost);
      } catch (error) {
        console.error('Failed to load blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug, currentLocale]);

  // Redirect if no slug
  if (!slug) {
    return <Navigate to={`/${currentLocale}/blog`} replace />;
  }

  // Loading state
  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <p className='text-muted-foreground'>Loading...</p>
        </div>
      </div>
    );
  }

  // Not found
  if (!post) {
    return <Navigate to={`/${currentLocale}/blog`} replace />;
  }

  // Show fallback notice if language mismatch
  const isFallback = post.lang !== currentLocale;

  return (
    <div className='container mx-auto px-4 py-8'>
      <article className='max-w-4xl mx-auto'>
        {/* Header */}
        <header className='mb-8 flex justify-between items-start gap-4'>
          <div className='flex-1'>
            <h1 className='text-4xl md:text-5xl font-bold text-foreground mb-4'>
              {post.title}
            </h1>

            {/* Meta info */}
            <div className='flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4'>
              <time>
                {t('publishedOn')}:{' '}
                {new Date(post.date).toLocaleDateString(
                  post.lang === 'zh-TW' ? 'zh-TW' : 'en-US'
                )}
              </time>
              <span>•</span>
              <span>
                {t('readingTime')}: {post.readingTime}
              </span>
              <span>•</span>
              <span className='capitalize'>
                {t(`categories.${post.category}`)}
              </span>
            </div>

            {/* Tags */}
            <TagList tags={post.tags} />

            {/* Fallback notice */}
            {isFallback && (
              <div className='mt-4 p-3 bg-muted border border-border rounded-lg text-sm text-muted-foreground'>
                ⚠️ {t('fallbackNotice')}
              </div>
            )}
          </div>

          {/* Language toggle */}
          <LanguageToggle currentSlug={slug} />
        </header>

        {/* Content with TOC */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* TOC Sidebar */}
          <aside className='lg:col-span-1 order-2 lg:order-1'>
            <div className='sticky top-20'>
              <TableOfContents content={post.content} />
            </div>
          </aside>

          {/* Main content */}
          <div className='lg:col-span-3 order-1 lg:order-2'>
            <BlogPost content={post.content} />

            {/* Footer */}
            <footer className='mt-12 pt-8 border-t border-border'>
              <ShareButtons title={post.title} url={window.location.href} />
            </footer>
          </div>
        </div>
      </article>
    </div>
  );
};
