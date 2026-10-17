import type { CSSProperties } from 'react';

import { CopyButton as ShadcnCopyButton } from '../../../ui/copy-button.js';
import { buttonVariants } from '../../../ui/button.js';
import type { VariantProps } from 'class-variance-authority';

/** DSL 扩展按钮变体（与 buttonVariants 对齐） */
export type CopyButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>['variant']
>;

/** DSL 扩展按钮尺寸（与 buttonVariants 对齐） */
export type CopyButtonSize = NonNullable<
  VariantProps<typeof buttonVariants>['size']
>;

export interface CopyButtonProps {
  /** 待写入剪贴板的文本 */
  value: string;
  /** 初始态可选文字（图标恒显） */
  label?: string;
  /** copied 态可选文字，缺省沿用 label */
  copiedLabel?: string;
  /** copied 态自动还原延迟（ms），默认 1500 */
  resetDelay?: number;
  /** 变体，默认 outline */
  variant?: CopyButtonVariant;
  /** 尺寸，默认 sm */
  size?: CopyButtonSize;
  disabled?: boolean;
  /** 点击事件（Renderer 绑定 events.onClick） */
  onClick?: () => void;
  /** 写入成功回调，携带 value（Renderer 绑定 events.onCopy） */
  onCopy?: (value: string) => void;
  /** 剪贴板不可用 / 写入失败回调（Renderer 绑定 events.onError） */
  onError?: (error: unknown) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * CopyButton 适配器（扩展按钮族）：复制确认按钮。点击 → 剪贴板写入 →
 * copied 态（IconMorph copy→check + 可选 copiedLabel）→ resetDelay 后
 * 自动还原；失败触发 onError 且不进入 copied 态。状态机完全由 ui 层
 * 组件承载，适配器仅做 DSL 类型收窄与事件透传。
 */
export function CopyButton({
  value,
  label,
  copiedLabel,
  resetDelay,
  variant,
  size,
  disabled,
  onClick,
  onCopy,
  onError,
  className,
  style,
}: CopyButtonProps) {
  return (
    <ShadcnCopyButton
      value={value}
      label={label}
      copiedLabel={copiedLabel}
      resetDelay={resetDelay}
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={() => onClick?.()}
      onCopy={(copied) => onCopy?.(copied)}
      onError={(error) => onError?.(error)}
      className={className}
      style={style}
    />
  );
}
