/**
 * Tag list component
 * Uses unified TechTag component for consistent styling and behavior
 */

import { type FC } from 'react';

import { TechTag } from '../../../components/TechTag';

interface TagListProps {
  tags: string[];
  compact?: boolean;
  onTagClick?: (tag: string) => void;
}

export const TagList: FC<TagListProps> = ({
  tags,
  compact = false,
  onTagClick,
}) => {
  if (tags.length === 0) return null;

  return (
    <div className='flex flex-wrap gap-2'>
      {tags.map(tag => (
        <TechTag key={tag} name={tag} compact={compact} />
      ))}
    </div>
  );
};


