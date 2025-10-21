/**
 * Prominent search bar component for documentation search
 */

import { Input } from '@nx-playground/ui-components';
import { type FC } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className='relative'>
      <svg
        className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
        />
      </svg>
      <Input
        type='text'
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className='pl-12 h-12 text-base shadow-sm focus:shadow-md transition-shadow'
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className='absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors'
          aria-label='清除搜尋'
        >
          <svg
            className='h-4 w-4 text-muted-foreground'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
      )}
    </div>
  );
};
