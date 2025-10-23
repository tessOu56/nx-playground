import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useLocalizedNavigation } from '../../lib/i18n/useLocalizedNavigation';
import { siteConfig } from '../../lib/siteConfig';

import { useLayoutTranslation } from './hooks/useLayoutTranslation';
import { LanguageToggle } from './LanguageToggle';
import { MobileNavButton } from './MobileNavButton';
import { NavButton } from './NavButton';

interface HeaderProps {
  scrollProgress: number;
}

export function Header({ scrollProgress }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { getLocalizedPath } = useLocalizedNavigation();
  const { t } = useLayoutTranslation();
  const [headerDark, setHeaderDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearchHistory, setHasSearchHistory] = useState(false);

  const isActive = (path: string) => {
    const pathWithoutLocale = location.pathname.replace(/^\/(zh-TW|en)/, '');

    if (path === '/') {
      return pathWithoutLocale === '' || pathWithoutLocale === '/';
    }
    return pathWithoutLocale.startsWith(path);
  };

  // Check if we're on home page or search page
  const isHomePage = isActive('/');
  const isSearchPage = isActive('/search');

  // Track search query from URL and save to localStorage
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') ?? '';
    setSearchQuery(query);

    // If on search page with a query, mark that we have search history
    if (isSearchPage && query) {
      localStorage.setItem('hasSearchHistory', 'true');
      setHasSearchHistory(true);
    }
  }, [location.search, isSearchPage]);

  // Check for search history on mount
  useEffect(() => {
    const history = localStorage.getItem('hasSearchHistory');
    setHasSearchHistory(history === 'true');
  }, []);

  // Reset header to light mode when changing pages (except home page)
  useEffect(() => {
    if (!isHomePage) {
      setHeaderDark(false);
    }
  }, [location.pathname, isHomePage]);

  // Adaptive header theme using sentinel pattern
  useEffect(() => {
    const darkSections = document.querySelectorAll('[data-header-dark="true"]');

    const observer = new IntersectionObserver(
      entries => {
        // Find the section with highest intersection ratio (most visible)
        let mostVisibleDarkSection = false;
        let maxRatio = 0;

        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisibleDarkSection = true;
          }
        });

        // Apply dark header if any dark section is visible (>20%)
        setHeaderDark(mostVisibleDarkSection && maxRatio > 0.2);
      },
      {
        rootMargin: '-50px 0px -50px 0px', // Less strict margins
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], // More granular thresholds
      }
    );

    darkSections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, [location.pathname, isHomePage]);

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
            </div>
          </div>

          {/* Search Input & Controls */}
          <div className='flex items-center gap-3'>
            {/* Search with Sparkles Icon */}
            <div className='hidden md:flex items-center gap-2'>
              {/* Sparkle Icon - always visible, clickable */}
              <button
                onClick={() => navigate(getLocalizedPath('/search'))}
                className='p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all animate-sparkle'
                aria-label='AI Search'
              >
                <Sparkles
                  className={`w-5 h-5 ${
                    headerDark
                      ? 'text-purple-400'
                      : 'text-purple-600 dark:text-purple-400'
                  }`}
                />
              </button>

              {/* Input / Text / Hidden - conditional display */}
              {!isSearchPage && !hasSearchHistory && (
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
              )}
              {!isSearchPage && hasSearchHistory && (
                <div
                  className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border backdrop-blur-sm cursor-pointer ${
                    headerDark
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white'
                  }`}
                  onClick={() => navigate(getLocalizedPath('/search'))}
                >
                  <span>AI is thinking</span>
                  <span className='thinking-dots' />
                </div>
              )}
              {isSearchPage && searchQuery && (
                <span
                  className={`text-sm px-3 py-1.5 ${
                    headerDark ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  "{searchQuery}"
                </span>
              )}
            </div>

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
        </div>
      </div>
    </nav>
  );
}
