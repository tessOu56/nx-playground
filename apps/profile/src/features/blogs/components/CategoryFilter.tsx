/**
 * Category filter component for documentation
 */

import { Button } from '@nx-playground/ui-components';
import { type FC } from 'react';

import { useBlogTranslation } from '../hooks/useBlogsTranslation';
import type { BlogCategory } from '../types';

interface CategoryFilterProps {
  selectedCategory: BlogCategory | 'all';
  onSelectCategory: (category: BlogCategory | 'all') => void;
}

export const CategoryFilter: FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { t } = useBlogTranslation();

  const categories: Array<BlogCategory | 'all'> = ['all', 'apps', 'libs'];

  return (
    <div className='flex items-center gap-2'>
      <span className='text-sm font-medium text-muted-foreground'>
        {t('filterByCategory')}:
      </span>
      <div className='flex gap-2'>
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size='sm'
            onClick={() => onSelectCategory(category)}
          >
            {t(`categories.${category}`)}
          </Button>
        ))}
      </div>
    </div>
  );
};


