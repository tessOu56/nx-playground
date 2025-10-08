'use client';

import * as selectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { cn } from '../../../utils';

const Select = selectPrimitive.Root;

const SelectGroup = selectPrimitive.Group;

const SelectValue = selectPrimitive.Value;

const SelectTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof selectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <selectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-gray-600 ring-offset-background placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      className
    )}
    {...props}
  >
    {children}
    <selectPrimitive.Icon asChild>
      <ChevronDown className='h-4 w-4 opacity-50' />
    </selectPrimitive.Icon>
  </selectPrimitive.Trigger>
));
SelectTrigger.displayName = selectPrimitive.Trigger.displayName;

const SelectScrollUpButton = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof selectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <selectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className
    )}
    {...props}
  >
    <ChevronUp className='h-4 w-4' />
  </selectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = selectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof selectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <selectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className
    )}
    {...props}
  >
    <ChevronDown className='h-4 w-4' />
  </selectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  selectPrimitive.ScrollDownButton.displayName;

const SelectContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof selectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <selectPrimitive.Portal>
    <selectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <selectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </selectPrimitive.Viewport>
      <SelectScrollDownButton />
    </selectPrimitive.Content>
  </selectPrimitive.Portal>
));
SelectContent.displayName = selectPrimitive.Content.displayName;

const SelectLabel = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof selectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <selectPrimitive.Label
    ref={ref}
    className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
    {...props}
  />
));
SelectLabel.displayName = selectPrimitive.Label.displayName;

const SelectItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof selectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <selectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm text-gray-600 outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
      <selectPrimitive.ItemIndicator>
        <Check className='h-4 w-4' />
      </selectPrimitive.ItemIndicator>
    </span>

    <selectPrimitive.ItemText>{children}</selectPrimitive.ItemText>
  </selectPrimitive.Item>
));
SelectItem.displayName = selectPrimitive.Item.displayName;

const SelectSeparator = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof selectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <selectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
));
SelectSeparator.displayName = selectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
