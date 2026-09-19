import { ChevronsUpDownIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '../lib/utils.js';
import { Popover, PopoverContent, PopoverTrigger } from './popover.js';

/**
 * shadcn 风格 Combobox（vendored 组合原语）：
 * Popover（受控 open）+ 按钮触发器 + 浮层内容（宿主内置 Command 列表）。
 * 搜索过滤与选项渲染由组合方（DSL 适配层）经 Command 完成。
 */
function Combobox({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <Popover open={open} onOpenChange={(next) => onOpenChange?.(next)}>
      {children}
    </Popover>
  );
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<'button'>) {
  return (
    <PopoverTrigger
      data-slot="combobox-trigger"
      className={cn(
        'flex h-9 w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <span className="min-w-0 flex-1 truncate text-left">{children}</span>
      <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
    </PopoverTrigger>
  );
}

function ComboboxContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PopoverContent>) {
  return (
    <PopoverContent
      data-slot="combobox-content"
      // 弹层宽度跟随触发器（--anchor-width 需经 var() 引用；
      // 此前写成方括号形式 w-[--anchor-width]，缺少 var() 包裹，
      // 会编译为无效的 `width: --anchor-width`）
      className={cn('w-(--anchor-width) p-0', className)}
      {...props}
    >
      {children}
    </PopoverContent>
  );
}

export { Combobox, ComboboxContent, ComboboxTrigger };
