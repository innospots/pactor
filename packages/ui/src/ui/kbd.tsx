import * as React from 'react';

import { cn } from '../lib/utils.js';

/** shadcn/ui Kbd（vendored 源码，纯样式组件，无原语依赖） */
function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        'pointer-events-none inline-flex h-(--pactor-kbd-size) w-fit min-w-(--pactor-kbd-size) items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-[length:var(--pactor-control-text-sm)] leading-4 font-medium text-muted-foreground select-none',
        className,
      )}
      {...props}
    />
  );
}

export { Kbd };
