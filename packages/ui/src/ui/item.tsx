import * as React from 'react';

import { cn } from '../lib/utils.js';

/**
 * shadcn/ui Item（vendored 源码，纯组合）：
 * 列表项——media / title+description / actions 三段式排布。
 */
function Item({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item"
      className={cn(
        'group/item flex items-center gap-3 rounded-lg border border-border p-3 text-sm',
        className,
      )}
      {...props}
    />
  );
}

function ItemMedia({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-media"
      className={cn(
        "flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5",
        className,
      )}
      {...props}
    />
  );
}

function ItemContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-content"
      className={cn('flex min-w-0 flex-1 flex-col gap-0.5', className)}
      {...props}
    />
  );
}

function ItemTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-title"
      className={cn('line-clamp-1 font-medium', className)}
      {...props}
    />
  );
}

function ItemDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="item-description"
      className={cn('line-clamp-2 text-xs text-muted-foreground', className)}
      {...props}
    />
  );
}

function ItemActions({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-actions"
      className={cn('flex shrink-0 items-center gap-2', className)}
      {...props}
    />
  );
}

export { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle };
