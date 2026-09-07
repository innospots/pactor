import type { ReactElement, ReactNode } from 'react';

import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../ui/tooltip.js';

/**
 * icon rail 提示（Sidebar 折叠态：Sidebar items 与 Menu 共用）：
 * 触发元素本身经 render 合并为 TooltipTrigger（aria/ref/事件不丢失），
 * 提示浮层显示在图标右侧；仅折叠态使用，展开态无原生 title 干扰。
 */
export function RailTooltip({
  label,
  children,
}: {
  label: string;
  children: ReactElement;
}): ReactNode {
  return (
    <ShadcnTooltip>
      <TooltipTrigger render={children} />
      <TooltipContent side="right" sideOffset={8}>
        {label}
      </TooltipContent>
    </ShadcnTooltip>
  );
}
