/**
 * Tag list component
 */

import { type FC } from 'react';

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
        <span
          key={tag}
          className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground transition-colors ${
            onTagClick ? 'cursor-pointer hover:bg-muted/80' : ''
          } ${compact ? 'px-2 py-0.5' : ''}`}
          onClick={onTagClick ? () => onTagClick(tag) : undefined}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};


