import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../lib/utils.js';

/**
 * shadcn/ui Alert（vendored 源码，按 DSL 契约扩展 success/warning/info 变体；
 * 文字色读 --alert-*-fg 令牌（亮色主题下为语义色压暗值，满足白底 AA；
 * 暗色主题重绑为语义色原值），见 src/styles.css）
 */
const alertVariants = cva(
  'relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border border-border px-(--pactor-card-padding) py-(--pactor-alert-padding-y) text-[length:var(--pactor-control-text-md)] leading-5 has-[>svg]:grid-cols-[var(--pactor-control-box)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-(--pactor-control-box) [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        destructive:
          'border-destructive/50 text-(--alert-destructive-fg) bg-card [&>svg]:text-current',
        success: 'border-success/50 text-(--alert-success-fg) bg-card [&>svg]:text-current',
        warning: 'border-warning/50 text-(--alert-warning-fg) bg-card [&>svg]:text-current',
        info: 'border-info/50 text-(--alert-info-fg) bg-card [&>svg]:text-current',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight',
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'col-start-2 grid justify-items-start gap-1 text-[length:var(--pactor-control-text-md)] leading-5 text-muted-foreground [&_p]:leading-relaxed',
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle };
