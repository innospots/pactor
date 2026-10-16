import * as React from 'react';

import { cn } from '../lib/utils.js';

/**
 * shadcn/ui ButtonGroup（vendored 源码，纯样式组合）：
 * 相连按钮组——内部按钮去圆角，首尾保留外侧圆角，相邻边框重叠。
 * 下拉触发钮（data-slot=dropdown-menu-trigger，如 SplitButton 的 chevron
 * 触发）同为直接子元素，按相同规则并入相连表面。
 * 首尾判定用 :first-of-type / :last-of-type（非 :first-child / :last-child）：
 * 下拉展开时 Base UI 会在组内注入 position:fixed 的 focus-guard span，
 * 若按 child 序判定，触发钮失去「末位」状态，右端圆角会被误清为直角。
 */
function ButtonGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      className={cn(
        'flex w-fit items-stretch [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 [&>[data-slot=button]]:rounded-none [&>[data-slot=button]]:first-of-type:rounded-l-md [&>[data-slot=button]]:last-of-type:rounded-r-md [&>[data-slot=button]:not(:first-child)]:-ml-px [&>[data-slot=dropdown-menu-trigger]]:rounded-none [&>[data-slot=dropdown-menu-trigger]:not(:first-child)]:-ml-px [&>[data-slot=dropdown-menu-trigger]]:last-of-type:rounded-r-md',
        className,
      )}
      {...props}
    />
  );
}

export { ButtonGroup };
