'use client';

import type { FC } from 'react';

import { IconButton } from '../../core/IconButton';

export interface LineContactButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  'aria-label'?: string;
}

export const LineContactButton: FC<LineContactButtonProps> = ({
  onClick,
  disabled = false,
  size = 'md',
  className = '',
  'aria-label': ariaLabel = 'LINE 聯絡',
  ...props
}) => {
  return (
    <IconButton
      variant='primary'
      size={size}
      disabled={disabled}
      onClick={onClick}
      className={`bg-[#00B900] hover:bg-[#009900] active:bg-[#008800] focus:outline-[#00B900] ${className}`}
      aria-label={ariaLabel}
      {...props}
    >
      <svg
        width='20'
        height='20'
        viewBox='0 0 24 24'
        fill='currentColor'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M12 0C5.373 0 0 4.925 0 11c0 4.514 2.805 8.535 7.12 10.164l-.776 2.877c-.133.49.322.896.79.682l3.454-1.938C11.221 22.866 11.599 23 12 23c6.627 0 12-4.925 12-11S18.627 0 12 0zm5.568 8.568c-.188 0-.377.063-.534.188l-3.787 2.838c-.377.283-.566.566-.566.943v1.697c0 .377.189.66.566.943l3.787 2.838c.157.125.346.188.534.188.188 0 .377-.063.534-.188l3.787-2.838c.377-.283.566-.566.566-.943v-1.697c0-.377-.189-.66-.566-.943l-3.787-2.838c-.157-.125-.346-.188-.534-.188z' />
      </svg>
    </IconButton>
  );
};
