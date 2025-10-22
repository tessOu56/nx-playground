import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import type { BlogMetadata } from '../types/blogData';
import { useLocalizedNavigation } from '../lib/i18n/useLocalizedNavigation';

interface BlogCardProps {
  blog: BlogMetadata;
}

export const BlogCard: FC<BlogCardProps> = ({ blog }) => {
  const navigate = useNavigate();
  const { getLocalizedPath } = useLocalizedNavigation();

  const handleClick = () => {
    navigate(getLocalizedPath(`/blogs/${blog.slug}`));
  };

  const publishDate = new Date(blog.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article
      onClick={handleClick}
      className='group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden'
      role='button'
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Read blog post: ${blog.title}`}
    >
      {/* Cover Image */}
      {blog.coverImage && (
        <div className='relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700'>
          <img
            src={blog.coverImage}
            alt={blog.title}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
            loading='lazy'
          />
          {blog.year && (
            <div className='absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold'>
              {blog.year}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className='p-6'>
        {/* Title */}
        <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className='text-gray-600 dark:text-gray-400 mb-4 line-clamp-3'>
          {blog.excerpt}
        </p>

        {/* Meta Info */}
        <div className='flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4'>
          <time dateTime={blog.publishDate}>{publishDate}</time>
          {blog.readingTime && (
            <span className='flex items-center gap-1'>
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
                  d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              {blog.readingTime} min read
            </span>
          )}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {blog.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className='px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full'
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Tech Stack */}
        {blog.techStack && blog.techStack.length > 0 && (
          <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
            <div className='flex flex-wrap gap-2'>
              {blog.techStack.slice(0, 4).map(tech => (
                <span
                  key={tech}
                  className='px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded'
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

