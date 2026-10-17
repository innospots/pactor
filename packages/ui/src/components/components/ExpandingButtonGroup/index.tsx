import type { CSSProperties } from 'react';

import { ExpandingButtonGroup as ShadcnExpandingButtonGroup } from '../../../ui/expanding-button-group.js';
import { Icon } from '../Icon/index.js';

/** 展开式选项 */
export interface ExpandingButtonGroupOption {
  /** 语义化值，选中后经 onSelect 抛出 */
  value: string;
  /** 展开后显示的文字 */
  label: string;
  /** 恒显图标名（Icon 白名单） */
  icon: string;
  /** 声明后点击进入原地确认态，再次点击才触发 onSelect */
  confirm?: boolean;
  /** 确认态显示的文字，缺省「确认」 */
  confirmLabel?: string;
  /** 单项禁用 */
  disabled?: boolean;
}

export interface ExpandingButtonGroupProps {
  /** 选项列表 */
  options: ExpandingButtonGroupOption[];
  /** 选中回调（confirm 选项需二次点击），携带 option.value（Renderer 绑定 events.onSelect） */
  onSelect?: (value: string) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * ExpandingButtonGroup 适配器（扩展按钮族）：展开式按钮组。hover /
 * 聚焦的按钮原地展开 label（ui 层 grid-template-columns 过渡实现）；
 * options 的 icon 由 DSL 传 Icon 白名单名（string），渲染为真实图标
 * 节点；confirm 选项的二次确认状态机由 ui 层组件承载。
 */
export function ExpandingButtonGroup({
  options,
  onSelect,
  className,
  style,
}: ExpandingButtonGroupProps) {
  return (
    <ShadcnExpandingButtonGroup
      options={options.map((option) => ({
        value: option.value,
        label: option.label,
        icon: <Icon name={option.icon} size={16} />,
        confirm: option.confirm,
        confirmLabel: option.confirmLabel,
        disabled: option.disabled,
      }))}
      onSelect={(selected) => onSelect?.(selected)}
      className={className}
      style={style}
    />
  );
}
