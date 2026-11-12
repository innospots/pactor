import * as React from 'react';

import { cn } from '../lib/utils.js';

/** shadcn/ui Empty（vendored 源码，纯组合组件，无原语依赖） */
function Empty({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty"
      className={cn(
        'flex min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-lg border-dashed p-(--pactor-panel-padding) text-center text-balance',
        className,
      )}
      {...props}
    />
  );
}

function EmptyHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-header"
      className={cn('flex max-w-sm flex-col items-center gap-2', className)}
      {...props}
    />
  );
}

function EmptyTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-title"
      className={cn(
        'text-[length:var(--pactor-control-text-lg)] leading-7 font-medium tracking-tight',
        className,
      )}
      {...props}
    />
  );
}

function EmptyDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="empty-description"
      className={cn(
        'text-[length:var(--pactor-control-text-md)] leading-5 text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

function EmptyContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        'flex w-full max-w-sm min-w-0 flex-col items-center gap-2 text-[length:var(--pactor-control-text-md)] leading-5 text-balance',
        className,
      )}
      {...props}
    />
  );
}

export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle };
