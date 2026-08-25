import { Button, Card, CardContent } from '@nx-playground/ui-components';
import { ExternalLink } from 'lucide-react';

import { Text } from '../core';

export type PublishSuccess = {
  eventId: string;
  previewUrl: string;
  title: string;
};

interface Props {
  published: PublishSuccess;
  onDismiss: () => void;
}

export function PublishSuccessBanner({ published, onDismiss }: Props) {
  return (
    <div className='px-6 pt-4'>
      <Card className='border-green-200 bg-green-50'>
        <CardContent className='p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
          <div className='min-w-0'>
            <Text variant='content' className='font-semibold text-green-900'>
              已寫入 Nest
            </Text>
            <p className='text-sm text-green-800 mt-1 truncate'>
              {published.title || published.eventId}
            </p>
            <a
              href={published.previewUrl}
              target='_blank'
              rel='noreferrer'
              className='text-sm text-primary-700 underline break-all'
            >
              {published.previewUrl}
            </a>
          </div>
          <div className='flex flex-shrink-0 items-center gap-2'>
            <Button
              type='button'
              variant='primary'
              size='sm'
              className='flex items-center gap-1'
              onClick={() => {
                window.open(published.previewUrl, '_blank', 'noopener,noreferrer');
              }}
            >
              <ExternalLink className='w-4 h-4' />
              公開預覽
            </Button>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => {
                void navigator.clipboard.writeText(published.previewUrl);
              }}
            >
              複製連結
            </Button>
            <Button type='button' variant='ghost' size='sm' onClick={onDismiss}>
              關閉
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
