'use client';

import * as tooltipPrimitive from '@radix-ui/react-tooltip';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { cn } from '../../../utils';

const TooltipProvider = tooltipPrimitive.Provider;

const Tooltip = tooltipPrimitive.Root;

const TooltipTrigger = tooltipPrimitive.Trigger;

const TooltipContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof tooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <tooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md border border-border-primary bg-background-primary px-3 py-1.5 text-sm text-text-primary shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = tooltipPrimitive.Content.displayName;

const TooltipArrow = forwardRef<
  SVGSVGElement,
  ComponentPropsWithoutRef<typeof tooltipPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <tooltipPrimitive.Arrow
    ref={ref}
    className={cn('fill-background-primary', className)}
    {...props}
  />
));
TooltipArrow.displayName = tooltipPrimitive.Arrow.displayName;

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipProvider,
};
