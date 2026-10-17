import type { CSSProperties } from 'react';

import { SplitButton as ShadcnSplitButton } from '../../../ui/split-button.js';
import { buttonVariants } from '../../../ui/button.js';
import type { VariantProps } from 'class-variance-authority';
import { Icon } from '../Icon/index.js';

/** DSL 扩展按钮变体（与 buttonVariants 对齐） */
export type SplitButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>['variant']
>;

/** DSL 扩展按钮尺寸（与 buttonVariants 对齐） */
export type SplitButtonSize = NonNullable<
  VariantProps<typeof buttonVariants>['size']
>;

/** 备选操作选项 */
export interface SplitButtonOption {
  /** 语义化值，选中后经 onSelect 抛出 */
  value: string;
  /** 选项文字 */
  label: string;
  /** 可选图标名（Icon 白名单） */
  icon?: string;
  /** 单项禁用 */
  disabled?: boolean;
}

export interface SplitButtonProps {
  /** 主操作按钮文字 */
  text?: string;
  /** 备选操作列表 */
  options: SplitButtonOption[];
  /** 下拉触发按钮的无障碍名，缺省「更多选项」 */
  triggerLabel?: string;
  /** 变体，同时作用于主按钮与下拉触发段 */
  variant?: SplitButtonVariant;
  /** 尺寸，同时作用于主按钮与下拉触发段 */
  size?: SplitButtonSize;
  /** 禁用：主按钮与下拉触发段均不可交互 */
  disabled?: boolean;
  /** 主按钮点击事件（Renderer 绑定 events.onClick） */
  onClick?: () => void;
  /** 备选操作选中事件，携带 option.value（Renderer 绑定 events.onSelect） */
  onSelect?: (value: string) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * SplitButton 适配器（扩展按钮族）：分体式按钮——ButtonGroup 相连表面
 * = 主操作按钮 + DropdownMenu chevron 触发。options 的 icon 由 DSL 传
 * Icon 白名单名（string），渲染为真实图标节点；onSelect(value) 语义化
 * 抛出备选操作值（事件参数经 Renderer 放入 event 局部作用域）。
 */
export function SplitButton({
  text,
  options,
  triggerLabel,
  variant,
  size,
  disabled,
  onClick,
  onSelect,
  className,
  style,
}: SplitButtonProps) {
  return (
    <ShadcnSplitButton
      options={options.map((option) => ({
        value: option.value,
        label: option.label,
        icon:
          option.icon !== undefined ? (
            <Icon name={option.icon} size={16} />
          ) : undefined,
        disabled: option.disabled,
      }))}
      triggerLabel={triggerLabel}
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={() => onClick?.()}
      onSelect={(value) => onSelect?.(value)}
      className={className}
      style={style}
    >
      {text}
    </ShadcnSplitButton>
  );
}
