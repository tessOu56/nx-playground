import { Button } from '@nx-playground/ui-components';
import { type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useLocalizedNavigation } from '../../lib/i18n/useLocalizedNavigation';
import { siteConfig } from '../../lib/siteConfig';

import { useLayoutTranslation } from './hooks/useLayoutTranslation';
import './i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { getLocalizedPath } = useLocalizedNavigation();
  const { t } = useLayoutTranslation();

  const isActive = (path: string) => {
    const pathWithoutLocale = location.pathname.replace(/^\/(zh-TW|en)/, '');

    if (path === '/') {
      return pathWithoutLocale === '' || pathWithoutLocale === '/';
    }
    return pathWithoutLocale.startsWith(path);
  };

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      {/* Navigation with backdrop blur */}
      <nav className='sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            {/* Logo and Navigation */}
            <div className='flex items-center gap-8'>
              <Link to={getLocalizedPath('/')} className='flex-shrink-0'>
                <h1 className='text-2xl font-bold'>
                  <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent'>
                    {siteConfig.siteName}
                  </span>
                </h1>
              </Link>
              <div className='hidden md:flex items-center gap-2'>
                <Button
                  variant={isActive('/') ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => navigate(getLocalizedPath('/'))}
                >
                  {String(t('nav.home'))}
                </Button>
                <Button
                  variant={isActive('/apps') ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => navigate(getLocalizedPath('/apps'))}
                >
                  {String(t('nav.apps'))}
                </Button>
                <Button
                  variant={isActive('/libs') ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => navigate(getLocalizedPath('/libs'))}
                >
                  {String(t('nav.libs'))}
                </Button>
                <Button
                  variant={isActive('/blogs') ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => navigate(getLocalizedPath('/blogs'))}
                >
                  {String(t('nav.search'))}
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
                  className='w-64 px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const query = e.currentTarget.value;
                      if (query.trim()) {
                        navigate(getLocalizedPath(`/search?q=${encodeURIComponent(query)}`));
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                  aria-label='AI search'
                />
              </div>
              
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className='md:hidden pb-4 flex gap-2'>
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              size='sm'
              onClick={() => navigate(getLocalizedPath('/'))}
            >
              {String(t('nav.home'))}
            </Button>
            <Button
              variant={isActive('/apps') ? 'default' : 'ghost'}
              size='sm'
              onClick={() => navigate(getLocalizedPath('/apps'))}
            >
              {String(t('nav.apps'))}
            </Button>
            <Button
              variant={isActive('/libs') ? 'default' : 'ghost'}
              size='sm'
              onClick={() => navigate(getLocalizedPath('/libs'))}
            >
              {String(t('nav.libs'))}
            </Button>
            <Button
              variant={isActive('/blogs') ? 'default' : 'ghost'}
              size='sm'
              onClick={() => navigate(getLocalizedPath('/blogs'))}
            >
              {String(t('nav.search'))}
            </Button>
          </div>
        </div>
      </nav>

      <main className='flex-1'>{children}</main>

      <footer className='border-t bg-background'>
        <div className='container mx-auto py-12 px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* About */}
            <div>
              <h3 className='text-lg font-semibold text-foreground mb-3'>
                {siteConfig.siteName}
              </h3>
              <p className='text-sm text-muted-foreground'>
                Full-Stack Developer specializing in modern web technologies and
                monorepo architecture.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className='text-lg font-semibold text-foreground mb-3'>
                Quick Links
              </h3>
              <ul className='space-y-2'>
                <li>
                  <Link
                    to={getLocalizedPath('/')}
                    className='text-sm text-muted-foreground hover:text-foreground transition-colors'
                  >
                    {String(t('nav.home'))}
                  </Link>
                </li>
                <li>
                  <Link
                    to={getLocalizedPath('/apps')}
                    className='text-sm text-muted-foreground hover:text-foreground transition-colors'
                  >
                    {String(t('nav.apps'))}
                  </Link>
                </li>
                <li>
                  <Link
                    to={getLocalizedPath('/libs')}
                    className='text-sm text-muted-foreground hover:text-foreground transition-colors'
                  >
                    {String(t('nav.libs'))}
                  </Link>
                </li>
                <li>
                  <Link
                    to={getLocalizedPath('/blogs')}
                    className='text-sm text-muted-foreground hover:text-foreground transition-colors'
                  >
                    {String(t('nav.search'))}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 className='text-lg font-semibold text-foreground mb-3'>
                Tech Stack
              </h3>
              <div className='flex flex-wrap gap-2'>
                <span className='px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md hover:bg-secondary/80 transition-colors'>
                  React 19
                </span>
                <span className='px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md hover:bg-secondary/80 transition-colors'>
                  TypeScript
                </span>
                <span className='px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md hover:bg-secondary/80 transition-colors'>
                  Nx Monorepo
                </span>
                <span className='px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md hover:bg-secondary/80 transition-colors'>
                  Tailwind CSS
                </span>
              </div>
            </div>
          </div>

          <div className='mt-8 pt-8 border-t'>
            <p className='text-center text-sm text-muted-foreground'>
              © {new Date().getFullYear()} {siteConfig.siteName}. Built with Nx,
              React, and modern web technologies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
