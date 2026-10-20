'use client';

import type { HTMLAttributes } from 'react';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@is_tess/components/core';

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props} />;
}
