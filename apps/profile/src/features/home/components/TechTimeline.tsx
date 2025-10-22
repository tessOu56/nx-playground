import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { loadAllBlogs } from '../../../lib/blogLoader';
import type { SupportedLocale } from '../../../lib/i18n/LocaleRouter';
import { useLocalizedNavigation } from '../../../lib/i18n/useLocalizedNavigation';
import './TechTimeline.css';

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

  const [featured, setFeatured] = useState<TimelineItem[]>([]);
  const [others, setOthers] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

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

        // Latest 3 years get full screens
        setFeatured(timelineData.slice(0, 3));
        // Remaining years in summary screen
        setOthers(timelineData.slice(3));
      } catch (error) {
        console.error('Error loading timeline:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTimeline();
  }, [currentLocale]);

  // Auto-snap to sections when scrolling
  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    const handleScroll = () => {
      const scrollTop = timeline.scrollTop;
      const sectionHeight = window.innerHeight;
      const currentIndex = Math.round(scrollTop / sectionHeight);
      setCurrentSection(currentIndex);
    };

    timeline.addEventListener('scroll', handleScroll, { passive: true });
    return () => timeline.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to next section
  const scrollToNext = (fromIndex: number) => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    const sectionHeight = window.innerHeight;
    const nextSection = fromIndex + 1;
    const maxSections = featured.length + (others.length > 0 ? 1 : 0);

    if (nextSection < maxSections) {
      timeline.scrollTo({
        top: nextSection * sectionHeight,
        behavior: 'smooth',
      });
    }
  };

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

  if (featured.length === 0 && others.length === 0) {
    return null;
  }

  return (
    <div
      ref={timelineRef}
      className='timeline-container overflow-y-auto snap-y snap-mandatory'
      style={{
        height: '100vh',
      }}
      role='region'
      aria-label='Tech Journey Timeline'
    >
      {/* Featured years: full screens */}
      {featured.map((item, index) => (
        <article
          key={item.year}
          className='timeline-section snap-start snap-always min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative'
          aria-label={`Tech journey in ${item.year}: ${item.title}`}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              navigate(getLocalizedPath(`/blogs/${item.blogSlug}`));
            }
          }}
          role='button'
          data-header-dark={index % 2 !== 0 ? 'true' : undefined}
          style={{
            background:
              index % 2 === 0
                ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <div className='container mx-auto px-4 text-center'>
            {/* Year */}
            <h2
              className='text-8xl md:text-9xl font-bold mb-6 motion-safe:transition-transform motion-safe:hover:scale-110'
              style={{
                color: index % 2 === 0 ? '#1a202c' : '#ffffff',
                textShadow:
                  index % 2 === 0 ? 'none' : '0 4px 8px rgba(0,0,0,0.3)',
              }}
            >
              {item.year}
            </h2>

            {/* Title */}
            <h3
              className='text-2xl md:text-4xl font-semibold mb-6 max-w-3xl mx-auto'
              style={{ color: index % 2 === 0 ? '#2d3748' : '#ffffff' }}
            >
              {item.title}
            </h3>

            {/* Tech Stack */}
            <div className='flex flex-wrap gap-3 justify-center mb-8 max-w-4xl mx-auto'>
              {item.tech.map(tech => (
                <span
                  key={tech}
                  className='px-4 py-2 rounded-lg font-medium text-sm motion-safe:transition-transform motion-safe:hover:scale-105'
                  style={{
                    background:
                      index % 2 === 0
                        ? 'rgba(99, 102, 241, 0.1)'
                        : 'rgba(255, 255, 255, 0.2)',
                    color: index % 2 === 0 ? '#4f46e5' : '#ffffff',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Milestone */}
            <p
              className='text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed'
              style={{
                color: index % 2 === 0 ? '#4a5568' : 'rgba(255,255,255,0.9)',
              }}
            >
              {item.milestone}
            </p>

            {/* Read More Button */}
            <button
              onClick={() =>
                navigate(getLocalizedPath(`/blogs/${item.blogSlug}`))
              }
              className='px-8 py-4 rounded-lg font-medium text-lg shadow-lg motion-safe:transition-all motion-safe:hover:shadow-xl motion-safe:hover:-translate-y-1'
              style={{
                background:
                  index % 2 === 0
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : '#ffffff',
                color: index % 2 === 0 ? '#ffffff' : '#1a202c',
              }}
              aria-label={`Read full blog post: ${item.title}`}
            >
              Read More →
            </button>

            {/* Down Arrow Button */}
            {(index < featured.length - 1 || others.length > 0) && (
              <button
                onClick={() => scrollToNext(index)}
                className='absolute bottom-8 left-1/2 transform -translate-x-1/2 motion-safe:animate-bounce hover:scale-110 transition-transform duration-300'
                aria-label='Scroll to next section'
              >
                <div
                  className='w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm border-2 transition-all duration-300'
                  style={{
                    background:
                      index % 2 === 0
                        ? 'rgba(99, 102, 241, 0.2)'
                        : 'rgba(255, 255, 255, 0.2)',
                    borderColor:
                      index % 2 === 0
                        ? 'rgba(99, 102, 241, 0.5)'
                        : 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  <svg
                    className='w-6 h-6'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    style={{
                      color: index % 2 === 0 ? '#4f46e5' : '#ffffff',
                    }}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 14l-7 7m0 0l-7-7m7 7V3'
                    />
                  </svg>
                </div>
              </button>
            )}
          </div>
        </article>
      ))}

      {/* Others: Summary screen */}
      {others.length > 0 && (
        <article
          className='timeline-section snap-start snap-always min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 relative'
          data-header-dark='true'
        >
          <div className='container mx-auto px-4 text-center'>
            <h2 className='text-5xl font-bold text-white mb-12'>
              Earlier Years
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12'>
              {others.map(item => (
                <button
                  key={item.year}
                  onClick={() =>
                    navigate(getLocalizedPath(`/blogs/${item.blogSlug}`))
                  }
                  className='bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all text-left'
                  aria-label={`View ${item.year} blog: ${item.title}`}
                >
                  <div className='flex items-center gap-4 mb-3'>
                    <span className='text-3xl font-bold text-white'>
                      {item.year}
                    </span>
                    <div className='h-px flex-1 bg-white/30' />
                  </div>
                  <h3 className='text-xl font-semibold text-white mb-2 line-clamp-1'>
                    {item.title}
                  </h3>
                  <p className='text-white/80 text-sm line-clamp-2 mb-3'>
                    {item.milestone}
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {item.tech.slice(0, 3).map(tech => (
                      <span
                        key={tech}
                        className='px-2 py-1 bg-white/20 text-white text-xs rounded'
                      >
                        {tech}
                      </span>
                    ))}
                    {item.tech.length > 3 && (
                      <span className='px-2 py-1 bg-white/20 text-white text-xs rounded'>
                        +{item.tech.length - 3}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Dynamic button with animated underline */}
            <button
              onClick={() => navigate(getLocalizedPath('/blogs'))}
              className='group relative inline-flex items-center gap-2 text-white text-lg font-medium hover:text-white/90 transition-colors duration-200'
              aria-label='View all blog posts'
            >
              <span>Explore All Blog Posts</span>
              <svg
                className='w-5 h-5 transition-transform duration-200 group-hover:translate-x-1'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>

              {/* Animated underline */}
              <div className='absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-500 ease-out group-hover:w-full' />
            </button>
          </div>
        </article>
      )}
    </div>
  );
};
