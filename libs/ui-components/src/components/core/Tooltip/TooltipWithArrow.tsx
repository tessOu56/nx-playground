'use client';

import { type FC, type ReactNode } from 'react';

import { cn } from '../../../utils';

import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './Tooltip';

interface TooltipWithArrowProps {
  children: ReactNode;
  content: string | ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  className?: string;
  contentClassName?: string;
  showArrow?: boolean;
}

export const TooltipWithArrow: FC<TooltipWithArrowProps> = ({
  children,
  content,
  side = 'top',
  align = 'center',
  sideOffset = 4,
  className = '',
  contentClassName = '',
  showArrow = true,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className={className}>
          {children}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={cn(contentClassName)}
        >
          {typeof content === 'string' ? (
            <p className='text-sm'>{content}</p>
          ) : (
            content
          )}
          {showArrow && (
            <TooltipArrow
              className='stroke-border-primary stroke-1'
              width={12}
              height={6}
            />
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
