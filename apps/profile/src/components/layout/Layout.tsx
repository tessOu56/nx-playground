import { type ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

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
  const [headerDark, setHeaderDark] = useState(true); // Default to dark for home page hero
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
    const query = params.get('q') || '';
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

  // Reset header state when path changes (except on initial home page load)
  useEffect(() => {
    if (!isHomePage) {
      setHeaderDark(false);
    }
  }, [location.pathname, isHomePage]);

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
        // Find the section with highest intersection ratio (most visible)
        let mostVisibleDarkSection = false;
        let maxRatio = 0;

        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisibleDarkSection = true;
          }
        });

        // Apply dark header if any dark section is significantly visible (>30%)
        setHeaderDark(mostVisibleDarkSection && maxRatio > 0.3);
      },
      {
        rootMargin: '-80px 0px -80px 0px', // Account for fixed header height
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], // More granular thresholds
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
              <div className='hidden md:flex items-center'>
                <button
                  onClick={() => navigate(getLocalizedPath('/'))}
                  className={`group relative px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    headerDark
                      ? 'text-white hover:text-white/90'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  } ${isActive('/') ? 'text-blue-600 dark:text-blue-400' : ''}`}
                >
                  {String(t('nav.home'))}
                  {/* Active underline */}
                  {isActive('/') && (
                    <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400' />
                  )}
                  {/* Hover underline */}
                  <div className='absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 w-0 transition-all duration-300 group-hover:w-full' />
                </button>

                <button
                  onClick={() => navigate(getLocalizedPath('/projects'))}
                  className={`group relative px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    headerDark
                      ? 'text-white hover:text-white/90'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  } ${
                    isActive('/projects')
                      ? 'text-blue-600 dark:text-blue-400'
                      : ''
                  }`}
                >
                  {String(t('nav.projects'))}
                  {/* Active underline */}
                  {isActive('/projects') && (
                    <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400' />
                  )}
                  {/* Hover underline */}
                  <div className='absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 w-0 transition-all duration-300 group-hover:w-full' />
                </button>

                <button
                  onClick={() => navigate(getLocalizedPath('/blogs'))}
                  className={`group relative px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    headerDark
                      ? 'text-white hover:text-white/90'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  } ${
                    isActive('/blogs') ? 'text-blue-600 dark:text-blue-400' : ''
                  }`}
                >
                  {String(t('nav.blogs'))}
                  {/* Active underline */}
                  {isActive('/blogs') && (
                    <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400' />
                  )}
                  {/* Hover underline */}
                  <div className='absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 w-0 transition-all duration-300 group-hover:w-full' />
                </button>
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
                    <span className='thinking-dots'></span>
                  </div>
                )}
                {isSearchPage && searchQuery && (
                  <span
                    className={`text-sm px-3 py-1.5 ${
                      headerDark
                        ? 'text-white'
                        : 'text-gray-900 dark:text-white'
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
            <button
              onClick={() => navigate(getLocalizedPath('/'))}
              className={`relative px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                headerDark
                  ? 'text-white hover:text-white/90 hover:bg-white/10'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              } ${
                isActive('/')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : ''
              }`}
            >
              {String(t('nav.home'))}
            </button>
            <button
              onClick={() => navigate(getLocalizedPath('/projects'))}
              className={`relative px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                headerDark
                  ? 'text-white hover:text-white/90 hover:bg-white/10'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              } ${
                isActive('/projects')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : ''
              }`}
            >
              {String(t('nav.projects'))}
            </button>
            <button
              onClick={() => navigate(getLocalizedPath('/blogs'))}
              className={`relative px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                headerDark
                  ? 'text-white hover:text-white/90 hover:bg-white/10'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              } ${
                isActive('/blogs')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : ''
              }`}
            >
              {String(t('nav.blogs'))}
            </button>
          </div>
        </div>
      </nav>

      <main className='flex-1'>{children}</main>

      {/* Footer should be at the end of scroll, not sticky */}
      {!isHomePage && <Footer />}
    </div>
  );
}
