import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { loadAllBlogs } from '../../../lib/blogLoader';
import type { SupportedLocale } from '../../../lib/i18n/LocaleRouter';
import { useLocalizedNavigation } from '../../../lib/i18n/useLocalizedNavigation';

interface TimelineItem {
  year: number;
  tech: string[];
  milestone: string;
  blogSlug: string;
  title: string;
}

export const TechTimeline: FC = () => {
  const { locale } = useParams<{ locale: string }>();
  const currentLocale = (locale ?? 'en') as SupportedLocale;
  const navigate = useNavigate();
  const { getLocalizedPath } = useLocalizedNavigation();

  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTimeline = async () => {
      try {
        const blogs = await loadAllBlogs(currentLocale);

        const timelineData = blogs
          .filter(
            blog => blog.year && blog.techStack && blog.techStack.length > 0
          )
          .sort((a, b) => b.year! - a.year!) // 2025 → 2019 (newest first)
          .map(blog => ({
            year: blog.year!,
            tech: blog.techStack!,
            milestone: blog.excerpt,
            blogSlug: blog.slug,
            title: blog.title,
          }));

        setTimeline(timelineData);
      } catch (error) {
        console.error('Error loading timeline:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTimeline();
  }, [currentLocale]);

  if (loading) {
    return (
      <section className='py-16 bg-white dark:bg-gray-800'>
        <div className='container mx-auto px-4'>
          <p className='text-center text-gray-600 dark:text-gray-400'>
            Loading timeline...
          </p>
        </div>
      </section>
    );
  }

  if (timeline.length === 0) {
    return null;
  }

  return (
    <section
      className='py-16 bg-white dark:bg-gray-800'
      role='region'
      aria-label='Tech Journey Timeline'
    >
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            Tech Journey Timeline
          </h2>
          <p className='text-lg text-gray-600 dark:text-gray-400'>
            My evolution from HTML/CSS/JS to Enterprise Monorepo Architecture
          </p>
        </div>

        {/* Timeline - Horizontal on desktop, vertical on mobile */}
        <div className='relative'>
          {/* Timeline Line */}
          <div className='hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 -translate-y-1/2' />

          <div className='grid grid-cols-1 md:grid-cols-7 gap-8 md:gap-4'>
            {timeline.map((item, index) => (
              <button
                key={item.year}
                onClick={() =>
                  navigate(getLocalizedPath(`/blogs/${item.blogSlug}`))
                }
                className='relative group cursor-pointer'
                aria-label={`View ${item.year} blog post: ${item.title}`}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(getLocalizedPath(`/blogs/${item.blogSlug}`));
                  }
                }}
              >
                {/* Year Badge */}
                <div className='relative z-10 mx-auto w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 group-hover:bg-purple-600 transition-all'>
                  {item.year}
                </div>

                {/* Content Card */}
                <div className='mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow group-hover:shadow-xl transition-all'>
                  <h3 className='font-semibold text-gray-900 dark:text-white mb-2 text-sm'>
                    {item.title}
                  </h3>

                  {/* Tech Stack */}
                  <div className='flex flex-wrap gap-1 mb-2'>
                    {item.tech.slice(0, 3).map(tech => (
                      <span
                        key={tech}
                        className='px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded'
                      >
                        {tech}
                      </span>
                    ))}
                    {item.tech.length > 3 && (
                      <span className='px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded'>
                        +{item.tech.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Milestone */}
                  <p className='text-xs text-gray-600 dark:text-gray-400 line-clamp-2'>
                    {item.milestone}
                  </p>
                </div>

                {/* Arrow indicator */}
                {index < timeline.length - 1 && (
                  <div className='hidden md:block absolute top-10 -right-2 text-gray-400'>
                    →
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* View All Blogs Link */}
        <div className='text-center mt-12'>
          <button
            onClick={() => navigate(getLocalizedPath('/blogs'))}
            className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            View All Blog Posts →
          </button>
        </div>
      </div>
    </section>
  );
};
