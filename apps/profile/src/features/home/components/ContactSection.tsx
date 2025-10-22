import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@nx-playground/ui-components';
import { type FC } from 'react';

import { homeConfig } from '../data/homeConfig';
import { useHomeTranslation } from '../hooks/useHomeTranslation';
import '../i18n';

export const ContactSection: FC = () => {
  const { t, i18n } = useHomeTranslation();
  const currentLang = i18n.language as 'zh-TW' | 'en';

  const hasContacts =
    homeConfig.contact.email ||
    homeConfig.contact.github ||
    homeConfig.contact.linkedin;

  if (!hasContacts) {
    return null;
  }

  return (
    <section id='contact' className='container mx-auto px-4 py-16 md:py-20 bg-muted/30'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold text-foreground mb-4'>
            {String(t('contact.title'))}
          </h2>
          <p className='text-lg text-muted-foreground'>
            {String(t('contact.subtitle'))}
          </p>
        </div>

        {/* Availability Badge */}
        <div className='flex justify-center mb-8'>
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full'>
            <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
            <span className='font-medium'>
              {homeConfig.availability[currentLang]}
            </span>
          </div>
        </div>

        {/* Contact Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Email Card */}
          {homeConfig.contact.email && (
            <Card className='hover:shadow-xl transition-shadow'>
              <CardHeader className='text-center'>
                <div className='w-16 h-16 mx-auto bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full flex items-center justify-center mb-4'>
                  <svg
                    className='w-8 h-8 text-blue-600 dark:text-blue-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                    />
                  </svg>
                </div>
                <CardTitle className='text-xl'>
                  {String(t('contact.email'))}
                </CardTitle>
                <CardDescription className='break-all'>
                  {homeConfig.contact.email}
                </CardDescription>
              </CardHeader>
              <CardContent className='text-center'>
                <a href={`mailto:${homeConfig.contact.email}`}>
                  <Button className='bg-blue-600 hover:bg-blue-700 transition-colors'>
                    {String(t('contact.sendEmail'))}
                    <svg
                      className='w-4 h-4 ml-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M14 5l7 7m0 0l-7 7m7-7H3'
                      />
                    </svg>
                  </Button>
                </a>
              </CardContent>
            </Card>
          )}

          {/* GitHub Card */}
          {homeConfig.contact.github && (
            <Card className='hover:shadow-xl transition-shadow'>
              <CardHeader className='text-center'>
                <div className='w-16 h-16 mx-auto bg-gradient-to-br from-gray-500/10 to-gray-700/10 rounded-full flex items-center justify-center mb-4'>
                  <svg
                    className='w-8 h-8 text-gray-700 dark:text-gray-300'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z' />
                  </svg>
                </div>
                <CardTitle className='text-xl'>
                  {String(t('contact.github'))}
                </CardTitle>
                <CardDescription>
                  {String(t('contact.githubProfile'))}
                </CardDescription>
              </CardHeader>
              <CardContent className='text-center'>
                <a
                  href={homeConfig.contact.github}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Button className='bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 transition-colors'>
                    {String(t('contact.viewGitHub'))}
                    <svg
                      className='w-4 h-4 ml-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                      />
                    </svg>
                  </Button>
                </a>
              </CardContent>
            </Card>
          )}

          {/* LinkedIn Card */}
          {homeConfig.contact.linkedin && (
            <Card className='hover:shadow-xl transition-shadow md:col-span-2'>
              <CardHeader className='text-center'>
                <div className='w-16 h-16 mx-auto bg-gradient-to-br from-blue-600/10 to-blue-800/10 rounded-full flex items-center justify-center mb-4'>
                  <svg
                    className='w-8 h-8 text-blue-700 dark:text-blue-500'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                  </svg>
                </div>
                <CardTitle className='text-xl'>
                  {String(t('contact.linkedin'))}
                </CardTitle>
                <CardDescription>
                  Connect with me on LinkedIn
                </CardDescription>
              </CardHeader>
              <CardContent className='text-center'>
                <a
                  href={homeConfig.contact.linkedin}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Button className='bg-blue-700 hover:bg-blue-800 transition-colors'>
                    {String(t('contact.viewLinkedIn'))}
                    <svg
                      className='w-4 h-4 ml-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                      />
                    </svg>
                  </Button>
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};
