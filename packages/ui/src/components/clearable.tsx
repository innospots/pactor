import { X } from 'lucide-react';

import { cn } from '../lib/utils.js';

/**
 * 盒式表单控件统一的 hover 清除（clearable）约定：
 * 控件容器/触发器加 `CLEARABLE_GROUP`（group），`allowClear` 且有值且未禁用时——
 * - Input：× 以绝对定位浮在控件右缘悬浮显示；
 * - 有右侧图标的控件（Select 下拉箭头 / DatePicker 日历 / TimePicker 时钟等）：
 *   原图标加 `CLEARABLE_ICON_HIDE`（group-hover:hidden），× 在原位置替换显示。
 * - NumberInput：步进按钮列保持可见可用，× 浮在步进按钮左侧（右缘预留双倍
 *   内边距），点击清空不影响步进操作。
 *
 * × 的显隐不用 Tailwind 的 `hidden` + `group-hover:inline-flex` 组合，而用专用类
 * `pactor-clearable`（样式在 styles.css 手写）：消费方以命名 @layer 叠加多个
 * 预编译产物（pactor-ui / pactor-blocks）时，后加载层的基础 `.hidden` 会覆盖
 * 先加载层的状态变体，导致 × 恒不显示；专用类无跨层同名冲突。
 * 同理，`CLEARABLE_OVERLAY_HIDE`（visibility 隐藏、保留布局）供 × 以绝对定位
 * 覆盖原图标（图标自带 display 工具类如 flex 时，group-hover:hidden 同样会被
 * 后加载层的基础类击败；visibility 不与 display 冲突）。
 *
 * 清除按钮用 span role="button" 而非 button：触发器本身是 button，嵌套 button
 * 非法（与 SearchableSelect 既有实现一致）；onClick / onMouseDown 阻断冒泡与
 * 默认行为，避免触发弹层开合或焦点转移。
 */

/** 挂在控件容器 / 触发器上，启用 group-hover 作用域 */
export const CLEARABLE_GROUP = 'group';

/** 有值时原右侧图标在 hover 时隐藏（由 ClearHoverButton 替换；仅适用于无 display 工具类的图标） */
export const CLEARABLE_ICON_HIDE = 'group-hover:hidden';

/** 有值时原右侧图标在 hover 时以 visibility 隐藏（保留布局，供 × 绝对定位覆盖；
 *  用于自带 display 工具类的图标容器（NumberInput 步进按钮列已不再隐藏，
 *  此约定保留给未来有覆盖需求的自带 display 工具类图标容器） */
export const CLEARABLE_OVERLAY_HIDE = 'pactor-clearable-ghost';

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
        'pactor-clearable shrink-0 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground',
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
