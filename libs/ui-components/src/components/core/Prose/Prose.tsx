import { type HTMLAttributes } from 'react';

import { cn } from '../../../utils';

export function Prose({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('prose prose-gray max-w-none dark:prose-invert', className)}
      {...props}
    />
  );
}
