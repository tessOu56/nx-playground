/**
 * Tag filter component
 */

import { Button } from '@nx-playground/ui-components';
import { type FC } from 'react';

import { useBlogTranslation } from '../hooks/useBlogsTranslation';

interface TagFilterProps {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export const TagFilter: FC<TagFilterProps> = ({
  tags,
  selectedTag,
  onSelectTag,
}) => {
  const { t } = useBlogTranslation();

  return (
    <div className='space-y-2'>
      <h3 className='text-sm font-medium text-foreground'>
        {String(t('filterByTag'))}
      </h3>
      <div className='flex flex-wrap gap-2'>
        <Button
          variant={selectedTag === null ? 'default' : 'outline'}
          size='sm'
          onClick={() => onSelectTag(null)}
        >
          {String(t('tags.all'))}
        </Button>
        {tags.map(tag => (
          <Button
            key={tag}
            variant={selectedTag === tag ? 'default' : 'outline'}
            size='sm'
            onClick={() => onSelectTag(tag)}
          >
            {tag}
          </Button>
        ))}
      </div>
    </div>
  );
};


