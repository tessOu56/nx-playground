'use client';

import type { FC } from 'react';

import { Button } from '../../core/Button';

export interface LineOfficialChannelButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
  'aria-label'?: string;
}

export const LineOfficialChannelButton: FC<LineOfficialChannelButtonProps> = ({
  onClick,
  disabled = false,
  size = 'md',
  className = '',
  children = '加入 LINE 官方頻道',
  'aria-label': ariaLabel = '加入 LINE 官方頻道',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <Button
      variant='primary'
      disabled={disabled}
      onClick={onClick}
      className={`bg-[#00B900] hover:bg-[#009900] active:bg-[#008800] focus:outline-[#00B900] text-white font-medium rounded-lg shadow-lg transition-colors ${sizeClasses[size]} ${className}`}
      aria-label={ariaLabel}
      {...props}
    >
      <span className='flex items-center gap-2'>
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='currentColor'
          xmlns='http://www.w3.org/2000/svg'
          className='flex-shrink-0'
        >
          <path d='M12 0C5.373 0 0 4.925 0 11c0 4.514 2.805 8.535 7.12 10.164l-.776 2.877c-.133.49.322.896.79.682l3.454-1.938C11.221 22.866 11.599 23 12 23c6.627 0 12-4.925 12-11S18.627 0 12 0zm5.568 8.568c-.188 0-.377.063-.534.188l-3.787 2.838c-.377.283-.566.566-.566.943v1.697c0 .377.189.66.566.943l3.787 2.838c.157.125.346.188.534.188.188 0 .377-.063.534-.188l3.787-2.838c.377-.283.566-.566.566-.943v-1.697c0-.377-.189-.66-.566-.943l-3.787-2.838c-.157-.125-.346-.188-.534-.188z' />
        </svg>
        {children}
      </span>
    </Button>
  );
};
