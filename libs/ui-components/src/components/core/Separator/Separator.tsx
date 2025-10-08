'use client';

import * as separatorPrimitive from '@radix-ui/react-separator';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { cn } from '../../../utils';

const Separator = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof separatorPrimitive.Root>
>(
  (
    { className, orientation = 'horizontal', decorative = true, ...props },
    ref
  ) => (
    <separatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = separatorPrimitive.Root.displayName;

export { Separator };
