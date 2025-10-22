import { Button } from '@nx-playground/ui-components';
import { type ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useLocalizedNavigation } from '../../lib/i18n/useLocalizedNavigation';
import { siteConfig } from '../../lib/siteConfig';

import { useLayoutTranslation } from './hooks/useLayoutTranslation';
import './i18n';
import { LanguageToggle } from './LanguageToggle';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { getLocalizedPath } = useLocalizedNavigation();
  const { t } = useLayoutTranslation();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headerDark, setHeaderDark] = useState(false);

  const isActive = (path: string) => {
    const pathWithoutLocale = location.pathname.replace(/^\/(zh-TW|en)/, '');

    if (path === '/') {
      return pathWithoutLocale === '' || pathWithoutLocale === '/';
    }
    return pathWithoutLocale.startsWith(path);
  };

  // Check if we're on home page
  const isHomePage = isActive('/');

  // Scroll progress indicator with RAF throttling
  useEffect(() => {
    let rafId = 0;

    const handleScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const windowHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrolled =
          windowHeight > 0 ? (window.scrollY / windowHeight) * 100 : 0;
        setScrollProgress(scrolled);
        rafId = 0;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Adaptive header theme using sentinel pattern
  useEffect(() => {
    const darkSections = document.querySelectorAll('[data-header-dark="true"]');

    const observer = new IntersectionObserver(
      entries => {
        let anyDarkVisible = false;
        entries.forEach(entry => {
          // Only trigger if the section is significantly visible (not just touching the edge)
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            anyDarkVisible = true;
          }
        });
        // Apply dark header when dark sections are visible
        setHeaderDark(anyDarkVisible);
      },
      {
        rootMargin: '-100px 0px -100px 0px', // More conservative margins
        threshold: [0, 0.3, 0.5, 0.7, 1.0], // Multiple thresholds for better detection
      }
    );

    darkSections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, [location.pathname, isHomePage]);

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      {/* Navigation with backdrop blur - adaptive theme */}
      <nav
        className={`sticky top-0 z-50 w-full border-b backdrop-blur-sm transition-colors duration-300 ${
          headerDark
            ? 'bg-gray-900/80 border-gray-700 text-white'
            : 'bg-background/80 border-border'
        }`}
      >
        {/* Progress Indicator */}
        <div
          className='absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ease-out'
          style={{ width: `${scrollProgress}%` }}
          role='progressbar'
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label='Page scroll progress'
        />
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div
            className='flex items-center justify-between'
            style={{ height: '50px' }}
          >
            {/* Logo and Navigation */}
            <div className='flex items-center gap-8'>
              <Link to={getLocalizedPath('/')} className='flex-shrink-0'>
                <h1 className='text-xl font-bold'>
                  <span
                    className={
                      headerDark
                        ? 'text-white'
                        : 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent'
                    }
                  >
                    {siteConfig.siteName}
                  </span>
                </h1>
              </Link>
              <div className='hidden md:flex items-center gap-2'>
                <Button
                  variant={isActive('/') ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => navigate(getLocalizedPath('/'))}
                  style={
                    headerDark
                      ? { color: 'white', background: 'rgba(255,255,255,0.1)' }
                      : undefined
                  }
                >
                  {String(t('nav.home'))}
                </Button>
                <Button
                  variant={isActive('/projects') ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => navigate(getLocalizedPath('/projects'))}
                  style={
                    headerDark
                      ? { color: 'white', background: 'rgba(255,255,255,0.1)' }
                      : undefined
                  }
                >
                  {String(t('nav.projects'))}
                </Button>
                <Button
                  variant={isActive('/blogs') ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => navigate(getLocalizedPath('/blogs'))}
                  style={
                    headerDark
                      ? { color: 'white', background: 'rgba(255,255,255,0.1)' }
                      : undefined
                  }
                >
                  {String(t('nav.blogs'))}
                </Button>
              </div>
            </div>

            {/* Search Input & Controls */}
            <div className='flex items-center gap-3'>
              {/* Search Input */}
              <div className='hidden md:block'>
                <input
                  type='search'
                  placeholder='Ask AI about...'
                  className={`w-64 px-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 backdrop-blur-sm ${
                    headerDark
                      ? 'bg-white/10 border-white/20 text-white placeholder-white/60'
                      : 'border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
                  }`}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const query = e.currentTarget.value;
                      if (query.trim()) {
                        navigate(
                          getLocalizedPath(
                            `/search?q=${encodeURIComponent(query)}`
                          )
                        );
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                  aria-label='AI search'
                />
              </div>

              <LanguageToggle />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className='md:hidden pb-4 flex gap-2'>
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              size='sm'
              onClick={() => navigate(getLocalizedPath('/'))}
              style={
                headerDark
                  ? { color: 'white', background: 'rgba(255,255,255,0.1)' }
                  : undefined
              }
            >
              {String(t('nav.home'))}
            </Button>
            <Button
              variant={isActive('/projects') ? 'default' : 'ghost'}
              size='sm'
              onClick={() => navigate(getLocalizedPath('/projects'))}
              style={
                headerDark
                  ? { color: 'white', background: 'rgba(255,255,255,0.1)' }
                  : undefined
              }
            >
              {String(t('nav.projects'))}
            </Button>
            <Button
              variant={isActive('/blogs') ? 'default' : 'ghost'}
              size='sm'
              onClick={() => navigate(getLocalizedPath('/blogs'))}
              style={
                headerDark
                  ? { color: 'white', background: 'rgba(255,255,255,0.1)' }
                  : undefined
              }
            >
              {String(t('nav.blogs'))}
            </Button>
          </div>
        </div>
      </nav>

      <main className='flex-1'>{children}</main>

      <Footer />
    </div>
  );
}
