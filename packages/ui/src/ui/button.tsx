import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../lib/utils.js';

/**
 * shadcn/ui Button（vendored 源码，Tailwind v4 版，Base UI 原语）。
 * 官方源码：https://ui.shadcn.com/r/styles/base-nova/button.json
 * `asChild` 语义经 Base UI 的 `render` 模式消化（合并 props 到唯一子元素）。
 */
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-[length:var(--pactor-control-text-md)] leading-5 font-medium outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20',
        outline:
          'border border-border bg-card hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline underline-offset-4',
      },
      size: {
        default: 'h-(--pactor-control-height-md) px-4 py-2',
        xs: "h-(--pactor-control-height-xs) gap-1 rounded-md px-2 text-[length:var(--pactor-control-text-sm)] leading-4 has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-(--pactor-control-height-sm) gap-1.5 rounded-md px-3 text-[length:var(--pactor-control-text-sm)] leading-4',
        lg: 'h-(--pactor-control-height-lg) rounded-md px-6',
        icon: 'size-(--pactor-control-height-md)',
        'icon-xs': "size-(--pactor-control-height-xs) rounded-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-(--pactor-control-height-sm)',
        'icon-lg': 'size-(--pactor-control-height-lg)',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  if (asChild && React.isValidElement(children)) {
    // asChild（原 Radix Slot）→ Base UI render：行为/props 合并到子元素
    return (
      <ButtonPrimitive
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        render={children}
        {...props}
      />
    );
  }

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
