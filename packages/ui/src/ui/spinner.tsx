import { Loader2Icon } from 'lucide-react';
import * as React from 'react';

import { cn } from '../lib/utils.js';

/** shadcn/ui Spinner（vendored 源码，纯 CSS 旋转，无原语依赖） */
function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      data-slot="spinner"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  );
}

export { Spinner };
