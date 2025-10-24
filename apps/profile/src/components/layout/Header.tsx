import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useLocalizedNavigation } from '../../lib/i18n/useLocalizedNavigation';
import { siteConfig } from '../../lib/siteConfig';
import { useSearchStore } from '../../stores/searchStore';

import { useLayoutTranslation } from './hooks/useLayoutTranslation';
import { LanguageToggle } from './LanguageToggle';
import { MobileNavButton } from './MobileNavButton';
import { NavButton } from './NavButton';

// Header height constant - matches actual header height in CSS
const HEADER_HEIGHT = 50; // px

interface HeaderProps {
  scrollProgress: number;
}

export function Header({ scrollProgress }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { getLocalizedPath } = useLocalizedNavigation();
  const { t } = useLayoutTranslation();
  const [headerDark, setHeaderDark] = useState(false);

  // Use search store instead of local state
  const { hasSearchHistory } = useSearchStore();

  const isActive = (path: string) => {
    const pathWithoutLocale = location.pathname.replace(/^\/(zh-TW|en)/, '');

    if (path === '/') {
      return pathWithoutLocale === '' || pathWithoutLocale === '/';
    }
    return pathWithoutLocale.startsWith(path);
  };

  // Check if we're on home page
  const isHomePage = isActive('/');

  // Reset header to light mode when changing pages (except home page)
  useEffect(() => {
    if (!isHomePage) {
      setHeaderDark(false);
    }
  }, [location.pathname, isHomePage]);

  // Adaptive header theme using optimized intersection observer
  useEffect(() => {
    const darkSections = document.querySelectorAll('[data-header-dark="true"]');
    if (darkSections.length === 0) return;

    // Check initial state immediately - simplified logic
    const initialDark = Array.from(darkSections).some(section => {
      const rect = section.getBoundingClientRect();
      // Check if dark section overlaps header area (top 0 to HEADER_HEIGHT)
      return rect.top < HEADER_HEIGHT && rect.bottom > 0;
    });
    setHeaderDark(initialDark);

    // Create observer with header-area-only detection
    // Calculate viewport height minus header height for bottom margin
    const viewportHeight = window.innerHeight;
    const bottomMargin = -(viewportHeight - HEADER_HEIGHT);
    
    const observer = new IntersectionObserver(
      entries => {
        // Simple check: any dark section in header area?
        const hasAnyDarkInHeader = entries.some(entry => entry.isIntersecting);
        setHeaderDark(hasAnyDarkInHeader);
      },
      {
        root: null, // viewport
        // rootMargin: only observe top HEADER_HEIGHT px band
        // Bottom shrinks to create header-height observation band
        rootMargin: `0px 0px ${bottomMargin}px 0px`,
        threshold: 0, // Trigger as soon as any part enters
      }
    );

    darkSections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, [location.pathname]);

  return (
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
            <div className='hidden md:flex items-center'>
              <NavButton
                path='/'
                label={String(t('nav.home'))}
                isActive={isActive('/')}
                headerDark={headerDark}
                onClick={() => navigate(getLocalizedPath('/'))}
              />
              <NavButton
                path='/projects'
                label={String(t('nav.projects'))}
                isActive={isActive('/projects')}
                headerDark={headerDark}
                onClick={() => navigate(getLocalizedPath('/projects'))}
              />
              <NavButton
                path='/blogs'
                label={String(t('nav.blogs'))}
                isActive={isActive('/blogs')}
                headerDark={headerDark}
                onClick={() => navigate(getLocalizedPath('/blogs'))}
              />
              <NavButton
                path='/search'
                label='AI Search'
                isActive={isActive('/search')}
                headerDark={headerDark}
                onClick={() => navigate(getLocalizedPath('/search'))}
                icon={
                  <Sparkles
                    className={`w-4 h-4 ${
                      headerDark
                        ? 'text-purple-400'
                        : 'text-purple-600 dark:text-purple-400'
                    }`}
                  />
                }
                showLoading={hasSearchHistory}
              />
            </div>
          </div>

          {/* Right side controls */}
          <div className='flex items-center gap-3'>
            <LanguageToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className='md:hidden pb-4 flex gap-2'>
          <MobileNavButton
            path='/'
            label={String(t('nav.home'))}
            isActive={isActive('/')}
            headerDark={headerDark}
            onClick={() => navigate(getLocalizedPath('/'))}
          />
          <MobileNavButton
            path='/projects'
            label={String(t('nav.projects'))}
            isActive={isActive('/projects')}
            headerDark={headerDark}
            onClick={() => navigate(getLocalizedPath('/projects'))}
          />
          <MobileNavButton
            path='/blogs'
            label={String(t('nav.blogs'))}
            isActive={isActive('/blogs')}
            headerDark={headerDark}
            onClick={() => navigate(getLocalizedPath('/blogs'))}
          />
          <button
            onClick={() => navigate(getLocalizedPath('/search'))}
            className={`relative px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2 ${
              headerDark
                ? 'text-white hover:text-white/90 hover:bg-white/10'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
            } ${
              isActive('/search')
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : ''
            }`}
          >
            <Sparkles className='w-4 h-4 text-purple-600 dark:text-purple-400' />
            <span>AI</span>
            {hasSearchHistory && !isActive('/search') && (
              <span className='thinking-dots' />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
