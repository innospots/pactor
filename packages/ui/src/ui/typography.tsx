import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../lib/utils.js';

/**
 * shadcn 风格 Typography（vendored，cva 变体）：
 * 按 variant 渲染对应语义标签与排版样式。
 */
const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight text-balance',
      h2: 'scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      p: 'leading-7',
      blockquote: 'mt-6 border-l-2 border-border pl-6 italic',
      list: 'my-6 ml-6 list-disc [&>li]:mt-2',
      'inline-code':
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
      lead: 'text-xl text-muted-foreground',
      muted: 'text-sm text-muted-foreground',
      small: 'text-sm leading-none font-medium',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
});

type TypographyVariant = NonNullable<VariantProps<typeof typographyVariants>['variant']>;

const variantTagMap: Record<TypographyVariant, 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'blockquote' | 'ul' | 'code' | 'small'> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  p: 'p',
  blockquote: 'blockquote',
  list: 'ul',
  'inline-code': 'code',
  lead: 'p',
  muted: 'p',
  small: 'small',
};

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {}

function Typography({ className, variant = 'p', ...props }: TypographyProps) {
  const Tag = variantTagMap[variant ?? 'p'];
  return (
    <Tag
      data-slot="typography"
      data-variant={variant}
      className={cn(typographyVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Typography, typographyVariants };
