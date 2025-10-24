import { techStack } from '@nx-playground/tech-stack-data';
import { type FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLocalizedNavigation } from '../../../lib/i18n/useLocalizedNavigation';
import { useHomeTranslation } from '../hooks/useHomeTranslation';
import '../i18n';
import './CoreStrengths.css';

export const CoreStrengths: FC = () => {
  const navigate = useNavigate();
  const { getLocalizedPath } = useLocalizedNavigation();
  const { t } = useHomeTranslation();
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 }); // Percentage

  // Track scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track mouse position for liquid flow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
      className='relative h-screen flex flex-col justify-center overflow-hidden'
      aria-label='Tech Stack Showcase'
      data-header-dark='true'
    >
      {/* Base dark gradient background */}
      <div
        className='absolute inset-0'
        style={{
          backgroundColor: '#1a1a2e',
          backgroundImage:
            'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        }}
      />

      {/* Flowing liquid orbs following mouse */}
      <div className='absolute inset-0 pointer-events-none' aria-hidden='true'>
        {/* Main liquid orb - follows mouse closely with purple glow */}
        <div
          className='absolute w-[600px] h-[600px] rounded-full blur-3xl transition-all duration-700 ease-out'
          style={{
            background:
              'radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 70%)',
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Secondary orb - inverse position with blue glow */}
        <div
          className='absolute w-[500px] h-[500px] rounded-full blur-3xl transition-all duration-1000 ease-out'
          style={{
            background:
              'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
            left: `${100 - mousePosition.x}%`,
            top: `${100 - mousePosition.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Tertiary orb - delayed center follow with cyan */}
        <div
          className='absolute w-[400px] h-[400px] rounded-full blur-3xl transition-all duration-1500 ease-out'
          style={{
            background:
              'radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%)',
            left: `${50 + (mousePosition.x - 50) * 0.5}%`,
            top: `${50 + (mousePosition.y - 50) * 0.5}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Ambient floating orbs with scroll animation */}
        <div
          className='absolute w-80 h-80 bg-pink-400/15 rounded-full blur-3xl transition-all duration-2000'
          style={{
            top: `${30 + Math.sin(scrollY * 0.01) * 15}%`,
            left: `${20 + Math.cos(scrollY * 0.01) * 15}%`,
            transform: `scale(${1 + Math.sin(scrollY * 0.005) * 0.3})`,
          }}
        />
        <div
          className='absolute w-72 h-72 bg-indigo-400/15 rounded-full blur-3xl transition-all duration-2000'
          style={{
            bottom: `${25 + Math.sin(scrollY * 0.008) * 15}%`,
            right: `${15 + Math.cos(scrollY * 0.008) * 15}%`,
            transform: `scale(${1 + Math.cos(scrollY * 0.006) * 0.3})`,
          }}
        />
      </div>

      {/* Content */}
      <div className='relative z-10 px-4'>
        <div className='text-center mb-12 sm:mb-16'>
          <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4'>
            {String(t('skills.title'))}
          </h2>
          <p className='text-base sm:text-lg md:text-xl text-gray-300 px-4'>
            {String(t('skills.subtitle'))}
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
                className='tech-badge px-4 sm:px-6 py-2 sm:py-3 bg-blue-500/20 backdrop-blur-sm text-blue-200 border border-blue-400/30 rounded-lg font-medium text-sm sm:text-base md:text-lg whitespace-nowrap motion-safe:hover:scale-110 motion-safe:hover:bg-blue-500/30 motion-safe:transition-all cursor-pointer'
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
                className='tech-badge px-4 sm:px-6 py-2 sm:py-3 bg-green-500/20 backdrop-blur-sm text-green-200 border border-green-400/30 rounded-lg font-medium text-sm sm:text-base md:text-lg whitespace-nowrap motion-safe:hover:scale-110 motion-safe:hover:bg-green-500/30 motion-safe:transition-all cursor-pointer'
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
                className='tech-badge px-4 sm:px-6 py-2 sm:py-3 bg-purple-500/20 backdrop-blur-sm text-purple-200 border border-purple-400/30 rounded-lg font-medium text-sm sm:text-base md:text-lg whitespace-nowrap motion-safe:hover:scale-110 motion-safe:hover:bg-purple-500/30 motion-safe:transition-all cursor-pointer'
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
