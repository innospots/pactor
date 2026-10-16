import * as React from 'react';

import { cn } from '../lib/utils.js';

/**
 * shadcn/ui ButtonGroup（vendored 源码，纯样式组合）：
 * 相连按钮组——内部按钮去圆角，首尾保留外侧圆角，相邻边框重叠。
 * 下拉触发钮（data-slot=dropdown-menu-trigger，如 SplitButton 的 chevron
 * 触发）同为直接子元素，按相同规则并入相连表面。
 */
function ButtonGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      className={cn(
        'flex w-fit items-stretch [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 [&>[data-slot=button]]:rounded-none [&>[data-slot=button]]:first:rounded-l-md [&>[data-slot=button]]:last:rounded-r-md [&>[data-slot=button]:not(:first-child)]:-ml-px [&>[data-slot=dropdown-menu-trigger]]:rounded-none [&>[data-slot=dropdown-menu-trigger]:not(:first-child)]:-ml-px [&>[data-slot=dropdown-menu-trigger]]:last:rounded-r-md',
        className,
      )}
      {...props}
    />
  );
}

export { ButtonGroup };
