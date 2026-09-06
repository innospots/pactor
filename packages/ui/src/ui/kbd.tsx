import * as React from 'react';

import { cn } from '../lib/utils.js';

/** shadcn/ui Kbd（vendored 源码，纯样式组件，无原语依赖） */
function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        'pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-xs font-medium text-muted-foreground select-none',
        className,
      )}
      {...props}
    />
  );
}

export { Kbd };
