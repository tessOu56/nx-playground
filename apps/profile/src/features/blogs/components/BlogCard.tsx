/**
 * Documentation card component for search results
 */

import { Card, CardContent, CardHeader } from '@nx-playground/ui-components';
import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLocalizedNavigation } from '../../../lib/i18n/useLocalizedNavigation';
import { useBlogTranslation } from '../hooks/useBlogsTranslation';
import type { BlogPost } from '../types';

import { TagList } from './TagList';

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard: FC<BlogCardProps> = ({ post }) => {
  const { t } = useBlogTranslation();
  const { getLocalizedPath } = useLocalizedNavigation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(getLocalizedPath(`/blog/${post.slug}`));
  };

  return (
    <Card
      className='cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]'
      onClick={handleClick}
    >
      <CardHeader>
        <div className='flex items-start justify-between gap-2 mb-2'>
          <span className='text-xs font-medium px-2 py-1 rounded bg-secondary text-secondary-foreground capitalize'>
            {post.category}
          </span>
          <span className='text-xs text-muted-foreground'>
            {post.readingTime}
          </span>
        </div>
        <h3 className='text-xl font-bold text-foreground hover:text-primary transition-colors'>
          {post.title}
        </h3>
      </CardHeader>

      <CardContent>
        <p className='text-muted-foreground mb-4 line-clamp-3'>
          {post.excerpt}
        </p>

        <div className='flex items-center justify-between'>
          <TagList tags={post.tags.slice(0, 3)} compact />
          <time className='text-sm text-muted-foreground'>
            {new Date(post.date).toLocaleDateString(
              post.lang === 'zh-TW' ? 'zh-TW' : 'en-US'
            )}
          </time>
        </div>
      </CardContent>
    </Card>
  );
};
