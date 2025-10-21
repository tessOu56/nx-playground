import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@nx-playground/ui-components';
import { type FC } from 'react';

import { homeConfig } from '../data/homeConfig';
import { useHomeTranslation } from '../hooks/useHomeTranslation';

export const ContactSection: FC = () => {
  const { t } = useHomeTranslation();

  return (
    <section className='container mx-auto px-4 py-16 md:py-20'>
      <div className='max-w-2xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold text-foreground mb-4'>
            {String(t('contact.title'))}
          </h2>
        </div>

        {/* GitHub Card */}
        {homeConfig.contact.github && (
          <Card className='hover:shadow-xl transition-shadow'>
            <CardHeader className='text-center'>
              <div className='w-20 h-20 mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-4'>
                <svg
                  className='w-10 h-10 text-primary'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z' />
                </svg>
              </div>
              <CardTitle className='text-2xl'>{String(t('contact.github'))}</CardTitle>
              <CardDescription>{String(t('contact.githubProfile'))}</CardDescription>
            </CardHeader>
            <CardContent className='text-center'>
              <a
                href={homeConfig.contact.github}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Button className='bg-primary hover:bg-primary/90 transition-colors'>
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
      </div>
    </section>
  );
};
