import * as React from 'react';

import { cn } from '../lib/utils.js';

/**
 * shadcn/ui AspectRatio（vendored 源码，纯 CSS `aspect-ratio` 实现，
 * 无原语依赖；Base UI 无对应原语）。
 */
function AspectRatio({
  ratio = 1,
  className,
  style,
  ...props
}: React.ComponentProps<'div'> & { ratio?: number | string }) {
  return (
    <div
      data-slot="aspect-ratio"
      className={cn('w-full overflow-hidden', className)}
      style={{ aspectRatio: String(ratio), ...style }}
      {...props}
    />
  );
}

export { AspectRatio };
