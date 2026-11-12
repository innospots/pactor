import * as React from 'react';

import { cn } from '../lib/utils.js';

/** shadcn/ui Card（vendored 源码） */

/** 圆角档位（静态映射：Tailwind 预编译扫描源码，动态拼接类名不进产物） */
export type CardRounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

const cardRoundedClasses: Record<CardRounded, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
};

function Card({
  className,
  rounded = 'lg',
  ...props
}: React.ComponentProps<'div'> & { rounded?: CardRounded }) {
  return (
    <div
      data-slot="card"
      className={cn(
        'flex flex-col gap-(--pactor-panel-padding) border border-border bg-card py-(--pactor-panel-padding) text-card-foreground shadow-(--card-shadow)',
        cardRoundedClasses[rounded],
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-(--pactor-panel-padding) has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-(--pactor-panel-padding)',
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        'text-[length:var(--pactor-control-text-md)] leading-5 text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-(--pactor-panel-padding)', className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'flex items-center px-(--pactor-panel-padding) [.border-t]:pt-(--pactor-panel-padding)',
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
