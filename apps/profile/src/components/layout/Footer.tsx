import { Github, Linkedin, Mail } from 'lucide-react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { siteConfig } from '../../lib/siteConfig';
import { useLocalizedNavigation } from '../../lib/i18n/useLocalizedNavigation';

import { useLayoutTranslation } from './hooks/useLayoutTranslation';

export const Footer: FC = () => {
  const { t } = useLayoutTranslation();
  const { getLocalizedPath } = useLocalizedNavigation();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: String(t('nav.home')), path: '/' },
    { label: String(t('nav.projects')), path: '/projects' },
    { label: String(t('nav.blogs')), path: '/blogs' },
    { label: 'AI Search', path: '/search' },
  ];

  return (
    <footer className='backdrop-blur-sm opacity-80 hover:opacity-100 transition-opacity duration-300 border-t border-gray-200 dark:border-gray-700'>
      <div className='container mx-auto px-4 py-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
          {/* About */}
          <div>
            <h3 className='text-sm font-semibold text-gray-900 dark:text-white mb-3'>
              {siteConfig.siteName}
            </h3>
            <p className='text-xs text-gray-600 dark:text-gray-400'>
              Full-Stack Developer specializing in modern web technologies and monorepo architecture.
            </p>
          </div>

          {/* Site Map */}
          <div>
            <h3 className='text-sm font-semibold text-gray-900 dark:text-white mb-3'>
              Site Map
            </h3>
            <ul className='space-y-2'>
              {footerLinks.map(link => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(getLocalizedPath(link.path))}
                    className='text-xs text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors'
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className='text-sm font-semibold text-gray-900 dark:text-white mb-3'>
              Connect
            </h3>
            <div className='flex gap-3'>
              <a
                href={siteConfig.social.github}
                target='_blank'
                rel='noopener noreferrer'
                className='p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-all'
                aria-label='GitHub'
              >
                <Github className='w-4 h-4' />
              </a>
              {siteConfig.social.linkedin && (
                <a
                  href={siteConfig.social.linkedin}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-all'
                  aria-label='LinkedIn'
                >
                  <Linkedin className='w-4 h-4' />
                </a>
              )}
              {siteConfig.social.email && (
                <a
                  href={`mailto:${siteConfig.social.email}`}
                  className='p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-all'
                  aria-label='Email'
                >
                  <Mail className='w-4 h-4' />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gray-200 dark:border-gray-700 pt-4 text-center'>
          <p className='text-xs text-gray-600 dark:text-gray-400'>
            © {currentYear} {siteConfig.siteName}. {String(t('footer.allRightsReserved'))}.
          </p>
          <p className='text-xs text-gray-500 dark:text-gray-500 mt-1'>
            {String(t('footer.builtWith'))} React + Vite + Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};
