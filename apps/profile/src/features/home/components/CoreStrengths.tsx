import { type FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { techStack } from '@nx-playground/tech-stack-data';

import { useLocalizedNavigation } from '../../../lib/i18n/useLocalizedNavigation';
import './CoreStrengths.css';

export const CoreStrengths: FC = () => {
  const navigate = useNavigate();
  const { getLocalizedPath } = useLocalizedNavigation();
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);

  // Track scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // Categorize tech stack
  const frontendTech = techStack.filter(
    t =>
      t.category === 'frontend' ||
      [
        'React',
        'Vue',
        'Angular',
        'TypeScript',
        'Vite',
        'Next.js',
        'Tailwind',
        'CSS',
      ].some(name => t.name.includes(name))
  );

  const backendTech = techStack.filter(
    t =>
      t.category === 'backend' ||
      [
        'Node',
        'Express',
        'NestJS',
        'PostgreSQL',
        'MongoDB',
        'GraphQL',
        'Prisma',
      ].some(name => t.name.includes(name))
  );

  const devopsTech = techStack.filter(
    t =>
      t.category === 'tools' ||
      t.category === 'deployment' ||
      ['Docker', 'Nx', 'GitHub', 'Vercel', 'Cloudflare', 'CI', 'pnpm'].some(
        name => t.name.includes(name)
      )
  );

  // Pause animations when not in viewport (performance optimization)
  useEffect(() => {
    const rows = document.querySelectorAll('.carousel-track');

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('paused');
          } else {
            entry.target.classList.add('paused');
          }
        });
      },
      { threshold: 0.1 }
    );

    rows.forEach(row => observer.observe(row));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className='relative min-h-screen flex flex-col justify-center overflow-hidden bg-white dark:bg-gray-900 py-16'
      role='region'
      aria-label='Tech Stack Showcase'
    >
      {/* Dynamic Parallax Background Layers */}
      <div className='absolute inset-0 pointer-events-none' aria-hidden='true'>
        {/* Frontend row background - Blue */}
        <div
          className='absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl transition-all duration-1000'
          style={{
            top: '15%',
            left: '10%',
            transform: `translateY(${scrollY * 0.2}px) translateX(${
              hoveredRow === 0 ? '20px' : '0px'
            })`,
            opacity: hoveredRow === 0 ? 0.3 : 0.1,
          }}
        />

        {/* Backend row background - Green */}
        <div
          className='absolute w-96 h-96 bg-green-500/10 rounded-full blur-3xl transition-all duration-1000'
          style={{
            top: '50%',
            right: '10%',
            transform: `translateY(${scrollY * 0.3}px) translateX(${
              hoveredRow === 1 ? '-20px' : '0px'
            })`,
            opacity: hoveredRow === 1 ? 0.3 : 0.1,
          }}
        />

        {/* DevOps row background - Purple */}
        <div
          className='absolute w-80 h-80 bg-purple-500/10 rounded-full blur-3xl transition-all duration-1000'
          style={{
            bottom: '15%',
            left: '30%',
            transform: `translateY(${scrollY * 0.15}px) translateX(${
              hoveredRow === 2 ? '20px' : '0px'
            })`,
            opacity: hoveredRow === 2 ? 0.3 : 0.1,
          }}
        />

        {/* Additional floating elements */}
        <div
          className='absolute w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl transition-all duration-2000'
          style={{
            top: '25%',
            right: '30%',
            transform: `translateY(${scrollY * 0.1}px) rotate(${
              scrollY * 0.05
            }deg)`,
          }}
        />
        <div
          className='absolute w-48 h-48 bg-pink-500/5 rounded-full blur-2xl transition-all duration-2000'
          style={{
            bottom: '25%',
            right: '20%',
            transform: `translateY(${scrollY * 0.25}px) rotate(${
              -scrollY * 0.03
            }deg)`,
          }}
        />
      </div>

      {/* Content */}
      <div className='relative z-10'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            Tech Stack
          </h2>
          <p className='text-xl text-gray-600 dark:text-gray-400'>
            Technologies I use to build modern web applications
          </p>
        </div>

        {/* Row 1: Frontend - Widest (90vw) */}
        <div
          className='carousel-row'
          style={{ maxWidth: '90vw', margin: '0 auto' }}
        >
          <div
            className={`carousel-track animate-scroll-left ${
              hoveredRow === 0 ? 'paused' : ''
            }`}
            aria-label='Frontend technologies'
            onMouseEnter={() => setHoveredRow(0)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            {[...frontendTech, ...frontendTech].map((tech, i) => (
              <button
                key={i}
                onClick={() =>
                  navigate(
                    getLocalizedPath(
                      `/search?q=${encodeURIComponent(tech.name)}`
                    )
                  )
                }
                className='tech-badge px-6 py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-medium text-lg whitespace-nowrap motion-safe:hover:scale-110 motion-safe:transition-transform cursor-pointer'
                aria-label={`Search for ${tech.name}`}
              >
                {tech.name}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Backend - Medium (80vw) */}
        <div
          className='carousel-row'
          style={{ maxWidth: '80vw', margin: '0 auto' }}
        >
          <div
            className={`carousel-track animate-scroll-right ${
              hoveredRow === 1 ? 'paused' : ''
            }`}
            aria-label='Backend technologies'
            onMouseEnter={() => setHoveredRow(1)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            {[...backendTech, ...backendTech].map((tech, i) => (
              <button
                key={i}
                onClick={() =>
                  navigate(
                    getLocalizedPath(
                      `/search?q=${encodeURIComponent(tech.name)}`
                    )
                  )
                }
                className='tech-badge px-6 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg font-medium text-lg whitespace-nowrap motion-safe:hover:scale-110 motion-safe:transition-transform cursor-pointer'
                aria-label={`Search for ${tech.name}`}
              >
                {tech.name}
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: DevOps - Narrowest (70vw) */}
        <div
          className='carousel-row'
          style={{ maxWidth: '70vw', margin: '0 auto' }}
        >
          <div
            className={`carousel-track animate-scroll-left ${
              hoveredRow === 2 ? 'paused' : ''
            }`}
            aria-label='DevOps and tooling'
            onMouseEnter={() => setHoveredRow(2)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            {[...devopsTech, ...devopsTech].map((tech, i) => (
              <button
                key={i}
                onClick={() =>
                  navigate(
                    getLocalizedPath(
                      `/search?q=${encodeURIComponent(tech.name)}`
                    )
                  )
                }
                className='tech-badge px-6 py-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg font-medium text-lg whitespace-nowrap motion-safe:hover:scale-110 motion-safe:transition-transform cursor-pointer'
                aria-label={`Search for ${tech.name}`}
              >
                {tech.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
