/**
 * Documentation card component for search results
 */

import { Card, CardContent, CardHeader } from '@nx-playground/ui-components';
import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLocalizedNavigation } from '../../../lib/i18n/useLocalizedNavigation';
import type { BlogMetadata } from '../../../types/blogData';

import { TagList } from './TagList';

interface BlogCardProps {
  blog: BlogMetadata;
}

export const BlogCard: FC<BlogCardProps> = ({ blog }) => {
  const { getLocalizedPath } = useLocalizedNavigation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(getLocalizedPath(`/blogs/${blog.slug}`));
  };

  return (
    <Card
      className='cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]'
      onClick={handleClick}
    >
      <CardHeader>
        <div className='flex items-start justify-between gap-2 mb-2'>
          {blog.year && (
            <span className='text-xs font-medium px-2 py-1 rounded bg-secondary text-secondary-foreground'>
              {blog.year}
            </span>
          )}
          {blog.readingTime && (
            <span className='text-xs text-muted-foreground'>
              {blog.readingTime} min read
            </span>
          )}
        </div>
        <h3 className='text-xl font-bold text-foreground hover:text-primary transition-colors'>
          {blog.title}
        </h3>
      </CardHeader>

      <CardContent>
        <p className='text-muted-foreground mb-4 line-clamp-3'>
          {blog.excerpt}
        </p>

        <div className='flex items-center justify-between'>
          <TagList tags={blog.tags?.slice(0, 3) || []} compact />
          <time className='text-sm text-muted-foreground'>
            {new Date(blog.publishDate).toLocaleDateString('en-US')}
          </time>
        </div>
      </CardContent>
    </Card>
  );
};
