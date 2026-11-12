import * as React from 'react';
import { SearchIcon } from 'lucide-react';

import { cn } from '../lib/utils.js';

/** shadcn/ui Input（vendored 源码，Tailwind v4 版）。
 *  search：搜索框形态（输入框左端前置搜索图标），回车触发 onSearch(value)。 */
function Input({
  className,
  type,
  search = false,
  onSearch,
  onKeyDown,
  ...props
}: React.ComponentProps<'input'> & {
  /** 搜索框形态：输入框内左端显示搜索图标，文本左留图标位内边距 */
  search?: boolean;
  /** 搜索提交：输入框聚焦时按回车触发，传出当前输入值（IME 组字回车不触发） */
  onSearch?: (value: string) => void;
}) {
  const input = (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-(--pactor-control-height-md) w-full min-w-0 rounded-md border border-input bg-(--input-background) px-3 py-1 text-[length:var(--pactor-control-text-md)] text-(--input-foreground) transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
        // 加 !important：聚合样式（pactor-app/styles.css）多段拼接，后段重复的
        // px-3（padding-inline）会盖掉本段的 pl-9，图标位被文本侵占
        search && 'pl-9!',
        className,
      )}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;
        onSearch?.(event.currentTarget.value);
      }}
      {...props}
    />
  );

  if (!search) return input;

  return (
    <span data-slot="input-search" className="relative flex w-full items-center">
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      {input}
    </span>
  );
}

export { Input };
