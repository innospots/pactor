import * as React from 'react';

import { cn } from '../lib/utils.js';

/** shadcn/ui Skeleton（vendored 源码） */
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

export { Skeleton };
