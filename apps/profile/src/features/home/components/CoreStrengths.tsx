import { type FC, useEffect } from 'react';
import { techStack } from '@nx-playground/tech-stack-data';

import './CoreStrengths.css';

export const CoreStrengths: FC = () => {
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
      className='min-h-screen flex flex-col justify-center overflow-hidden bg-white dark:bg-gray-900 py-16'
      role='region'
      aria-label='Tech Stack Showcase'
    >
      <div className='text-center mb-12'>
        <h2 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
          Tech Stack
        </h2>
        <p className='text-xl text-gray-600 dark:text-gray-400'>
          Technologies I use to build modern web applications
        </p>
      </div>

      {/* Row 1: Frontend - Widest (90vw) */}
      <div
        className='carousel-row mb-8'
        style={{ maxWidth: '90vw', margin: '0 auto' }}
      >
        <div
          className='carousel-track animate-scroll-left'
          aria-label='Frontend technologies'
        >
          {[...frontendTech, ...frontendTech].map((tech, i) => (
            <span
              key={i}
              className='tech-badge px-6 py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-medium text-lg whitespace-nowrap'
            >
              {tech.name}
            </span>
          ))}
        </div>
      </div>

      {/* Row 2: Backend - Medium (80vw) */}
      <div
        className='carousel-row mb-8'
        style={{ maxWidth: '80vw', margin: '0 auto' }}
      >
        <div
          className='carousel-track animate-scroll-right'
          aria-label='Backend technologies'
        >
          {[...backendTech, ...backendTech].map((tech, i) => (
            <span
              key={i}
              className='tech-badge px-6 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg font-medium text-lg whitespace-nowrap'
            >
              {tech.name}
            </span>
          ))}
        </div>
      </div>

      {/* Row 3: DevOps - Narrowest (70vw) */}
      <div
        className='carousel-row'
        style={{ maxWidth: '70vw', margin: '0 auto' }}
      >
        <div
          className='carousel-track animate-scroll-left'
          aria-label='DevOps and tooling'
        >
          {[...devopsTech, ...devopsTech].map((tech, i) => (
            <span
              key={i}
              className='tech-badge px-6 py-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg font-medium text-lg whitespace-nowrap'
            >
              {tech.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
