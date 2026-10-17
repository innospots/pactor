import type { CSSProperties } from 'react';

import { FloatingButtonGroup as ShadcnFloatingButtonGroup } from '../../../ui/floating-button-group.js';
import { Icon } from '../Icon/index.js';

/** 托盘选项 */
export interface FloatingButtonGroupOption {
  /** 语义化值，点击后经 onSelect 抛出 */
  value: string;
  /** 可选文字 */
  label?: string;
  /** 可选图标名（Icon 白名单） */
  icon?: string;
  /** 单项禁用 */
  disabled?: boolean;
}

export interface FloatingButtonGroupProps {
  /** 选项列表 */
  options: FloatingButtonGroupOption[];
  /** 受控当前项：提供时共享高亮块恒定位于该项（可用状态表达式绑定） */
  value?: string;
  /** 点击选项回调，携带 option.value（Renderer 绑定 events.onSelect） */
  onSelect?: (value: string) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * FloatingButtonGroup 适配器（扩展按钮族）：托盘式按钮组。共享高亮块
 * 在 hover / focus-visible 的按钮间滑动（ui 层测量实现）；options 的
 * icon 由 DSL 传 Icon 白名单名（string），渲染为真实图标节点；
 * 受控 value 可绑定 DSL 状态表达式，高亮恒定位于选中项。
 */
export function FloatingButtonGroup({
  options,
  value,
  onSelect,
  className,
  style,
}: FloatingButtonGroupProps) {
  return (
    <ShadcnFloatingButtonGroup
      options={options.map((option) => ({
        value: option.value,
        label: option.label,
        icon:
          option.icon !== undefined ? (
            <Icon name={option.icon} size={16} />
          ) : undefined,
        disabled: option.disabled,
      }))}
      value={value}
      onSelect={(selected) => onSelect?.(selected)}
      className={className}
      style={style}
    />
  );
}
