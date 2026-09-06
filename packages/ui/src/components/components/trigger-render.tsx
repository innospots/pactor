import type { ReactElement } from 'react';

/**
 * 弹层触发元素接线（DropdownMenu/Popover/Dialog/AlertDialog/Tooltip/
 * HoverCard 共用）：DSL children 以 span 包装接入 Base UI Trigger
 * 的 `render`（DSL 适配器不透传未知 props，不能把子元素直接作为
 * render——触发器合并的 aria/ref/事件会被吞掉）；span 声明
 * data-slot 便于测试定位。
 */
export function triggerWrapper(slot: string): ReactElement {
  return <span data-slot={slot} />;
}
