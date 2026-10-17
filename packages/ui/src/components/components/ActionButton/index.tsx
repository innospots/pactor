import type { CSSProperties } from 'react';

import { ActionButton as ShadcnActionButton } from '../../../ui/action-button.js';
import { buttonVariants } from '../../../ui/button.js';
import type { VariantProps } from 'class-variance-authority';
import { Icon } from '../Icon/index.js';

/** DSL 扩展按钮变体（与 buttonVariants 对齐） */
export type ActionButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>['variant']
>;

/** DSL 扩展按钮尺寸（与 buttonVariants 对齐） */
export type ActionButtonSize = NonNullable<
  VariantProps<typeof buttonVariants>['size']
>;

export interface ActionButtonProps {
  /** 图标名（Icon 白名单，kebab-case / PascalCase 均可），恒显 */
  icon?: string;
  /** 可选文字；缺省时渲染 icon-only 方形按钮 */
  label?: string;
  /** 可选提示文案，提供时包裹现有 Tooltip，悬浮 / 聚焦显示 */
  tooltip?: string;
  /** 无障碍名；缺省回退 tooltip / label（icon-only 至少其一） */
  ariaLabel?: string;
  /** 变体，与 buttonVariants 对齐，默认 default */
  variant?: ActionButtonVariant;
  /** 尺寸，缺省按内容回退（有 label 为 sm，否则 icon-sm） */
  size?: ActionButtonSize;
  disabled?: boolean;
  /** 点击事件（Renderer 绑定 events.onClick） */
  onClick?: () => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * ActionButton 适配器（扩展按钮族）：紧凑工具栏按钮，icon + 可选 label。
 * icon 由 DSL 传 Icon 白名单名（string），渲染为真实图标节点；aria-label
 * 缺省回退 tooltip / label，保证 icon-only 用法有可访问名称；tooltip 经
 * vendored Tooltip 包裹（根节点仍为按钮本体）。
 */
export function ActionButton({
  icon,
  label,
  tooltip,
  ariaLabel,
  variant,
  size,
  disabled,
  onClick,
  className,
  style,
}: ActionButtonProps) {
  return (
    <ShadcnActionButton
      icon={icon !== undefined ? <Icon name={icon} size={16} /> : undefined}
      label={label}
      tooltip={tooltip}
      aria-label={ariaLabel ?? tooltip ?? label}
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={() => onClick?.()}
      className={className}
      style={style}
    />
  );
}
