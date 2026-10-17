import * as React from 'react';

import { cn } from '../lib/utils.js';

/**
 * shadcn/ui InputGroup（vendored 源码封装，纯组合）：
 * 输入框与前后缀 addon（文本/按钮）组合为一体。InputGroupAddon 的
 * `align` 控制前后缀位置；内部 Input 去边框与焦点环。
 */
function InputGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        'group/input-group relative flex w-full items-center rounded-md border border-input bg-(--input-background) text-(--input-foreground) shadow-xs transition-colors outline-none focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 has-disabled:opacity-50',
        // 消化 DSL 子元素：Input 去边框/焦点环并伸展；Text 作前后缀；Button 贴边去圆角
        '[&_[data-slot=input]]:min-w-0 [&_[data-slot=input]]:flex-1 [&_[data-slot=input]]:border-0 [&_[data-slot=input]]:shadow-none [&_[data-slot=input]]:focus-visible:ring-0',
        '[&>[data-slot=text]]:shrink-0 [&>[data-slot=text]]:px-3 [&>[data-slot=text]]:text-sm [&>[data-slot=text]]:text-muted-foreground',
        '[&>[data-slot=button]]:shrink-0 [&>[data-slot=button]]:rounded-none [&>[data-slot=button]]:first:rounded-l-md [&>[data-slot=button]]:last:rounded-r-md',
        className,
      )}
      {...props}
    />
  );
}

function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}: React.ComponentProps<'div'> & {
  align?: 'inline-start' | 'inline-end';
}) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(
        'flex items-center gap-1 px-3 text-sm text-muted-foreground [&>svg]:size-4',
        align === 'inline-start' ? 'order-first pl-3' : 'order-last pr-3',
        className,
      )}
      {...props}
    />
  );
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<'input'>) {
  return (
    <input
      data-slot="input-group-input"
      className={cn(
        'h-9 min-w-0 flex-1 border-0 bg-transparent px-3 py-1 text-base shadow-none outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm',
        className,
      )}
      {...props}
    />
  );
}

export { InputGroup, InputGroupAddon, InputGroupInput };
