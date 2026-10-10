import { X } from 'lucide-react';

import { cn } from '../lib/utils.js';

/**
 * 盒式表单控件统一的 hover 清除（clearable）约定：
 * 控件容器/触发器加 `CLEARABLE_GROUP`（group），`allowClear` 且有值且未禁用时——
 * - 无右侧图标的控件（Input / NumberInput）：× 以绝对定位浮在控件右缘，
 *   `hidden group-hover:inline-flex` 悬浮显示；
 * - 有右侧图标的控件（Select 下拉箭头 / DatePicker 日历 / TimePicker 时钟等）：
 *   原图标加 `CLEARABLE_ICON_HIDE`（group-hover:hidden），× 在原位置替换显示。
 * 清除按钮用 span role="button" 而非 button：触发器本身是 button，嵌套 button
 * 非法（与 SearchableSelect 既有实现一致）；onClick / onMouseDown 阻断冒泡与
 * 默认行为，避免触发弹层开合或焦点转移。
 */

/** 挂在控件容器 / 触发器上，启用 group-hover 作用域 */
export const CLEARABLE_GROUP = 'group';

/** 有值时原右侧图标在 hover 时隐藏（由 ClearHoverButton 替换） */
export const CLEARABLE_ICON_HIDE = 'group-hover:hidden';

export interface ClearHoverButtonProps {
  /** aria-label（缺省「清除」语义，调用方传 i18n 文案或既有测试标签） */
  label: string;
  onClear: () => void;
  /** 额外 class（如 Input 的绝对定位 right-2） */
  className?: string;
}

export function ClearHoverButton({ label, onClear, className }: ClearHoverButtonProps) {
  return (
    <span
      role="button"
      aria-label={label}
      className={cn(
        'hidden shrink-0 cursor-pointer items-center justify-center text-muted-foreground group-hover:inline-flex hover:text-foreground',
        className,
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClear();
      }}
      onMouseDown={(event) => {
        // 阻断 mousedown：Base UI Select / Popover 触发器在 press 阶段开合弹层
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <X className="size-4" />
    </span>
  );
}
