import type { CSSProperties } from 'react';

import { Toggle as ShadcnToggle, type toggleVariants } from '../../../ui/toggle.js';
import type { VariantProps } from 'class-variance-authority';

export interface ToggleProps {
  /** 按钮文本 */
  text?: string;
  /** 受控按下态 */
  pressed?: boolean;
  /** 样式变体 */
  variant?: VariantProps<typeof toggleVariants>['variant'];
  /** 尺寸 */
  size?: VariantProps<typeof toggleVariants>['size'];
  disabled?: boolean;
  /** 按下态变化事件，传出 boolean */
  onChange?: (pressed: boolean) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * Toggle 适配器（shadcn kit）：基于 vendored Toggle（Base UI）；
 * pressed 受控（未传时为非受控）；onChange 传出 boolean（DSL 语义值）。
 */
export function Toggle({
  text,
  pressed,
  variant,
  size,
  disabled,
  onChange,
  className,
  style,
}: ToggleProps) {
  return (
    <ShadcnToggle
      pressed={pressed}
      variant={variant}
      size={size}
      disabled={disabled}
      onPressedChange={(next) => onChange?.(next)}
      className={className}
      style={style}
    >
      {text}
    </ShadcnToggle>
  );
}
