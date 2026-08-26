import * as React from 'react';

import { cn } from '../lib/utils.js';

/**
 * shadcn/ui Label（vendored 源码）。
 * Base UI 无独立 Label 原语（官方 base 版直接渲染原生 `<label>`），
 * 保持同导出与 data-slot。
 */
function Label({
  className,
  ...props
}: React.ComponentProps<'label'>) {
  return (
    <label
      data-slot="label"
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { Label };
