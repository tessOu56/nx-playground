/**
 * Share buttons component
 */

import { Button } from '@nx-playground/ui-components';
import { type FC, useState } from 'react';

import { useBlogTranslation } from '../hooks/useBlogTranslation';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export const ShareButtons: FC<ShareButtonsProps> = ({ title, url }) => {
  const { t } = useBlogTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <div className='space-y-4'>
      <h3 className='text-sm font-medium text-foreground'>
        {t('share.title')}
      </h3>
      <div className='flex gap-2'>
        <Button variant='outline' size='sm' onClick={handleCopyLink}>
          {copied ? t('share.linkCopied') : t('share.copyLink')}
        </Button>
      </div>
    </div>
  );
};


