import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';
import {
  Button as ShadcnButton,
  type buttonVariants,
} from '../../../ui/button.js';
import type { VariantProps } from 'class-variance-authority';

/** DSL Button 变体（框架级协议） */
export type ButtonVariant = 'default' | 'primary' | 'dashed' | 'link' | 'text';

/** DSL Button 尺寸 */
export type ButtonSize = 'small' | 'middle' | 'large';

export interface ButtonProps {
  /** 按钮文本；也可用 children 渲染内容 */
  text?: string;
  /** 变体，默认 default */
  variant?: ButtonVariant;
  /** 危险态 */
  danger?: boolean;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  /** true 时作为 Form 的提交按钮（type=submit） */
  submit?: boolean;
  /** 点击事件（Renderer 绑定 events.onClick） */
  onClick?: () => void;
  children?: ReactNode;
}

/** DSL variant → shadcn variant（antd default 边框按钮 ≈ shadcn outline） */
const variantMap: Record<
  ButtonVariant,
  VariantProps<typeof buttonVariants>['variant']
> = {
  default: 'outline',
  primary: 'default',
  dashed: 'outline',
  link: 'link',
  text: 'ghost',
};

const sizeMap: Record<
  ButtonSize,
  VariantProps<typeof buttonVariants>['size']
> = {
  small: 'sm',
  middle: 'default',
  large: 'lg',
};

/**
 * Button 适配器（shadcn kit）：vendored shadcn Button（cva 变体）。
 * props 契约与 pactor-components（antd 版）一致；`submit: true` 时作为
 * Form 的提交按钮（type=submit）；danger 映射 destructive（link/text
 * 变体保持原样、文字标红）；loading 显示旋转图标并禁用。
 */
export function Button({
  text,
  variant = 'default',
  danger,
  size = 'middle',
  loading,
  disabled,
  submit,
  onClick,
  children,
}: ButtonProps) {
  const textual = variant === 'link' || variant === 'text';
  return (
    <ShadcnButton
      type={submit ? 'submit' : 'button'}
      variant={danger && !textual ? 'destructive' : variantMap[variant]}
      size={sizeMap[size]}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      onClick={() => onClick?.()}
      className={cn(
        variant === 'dashed' && 'border-dashed',
        danger && textual && 'text-destructive hover:text-destructive',
      )}
    >
      {loading ? <Loader2 aria-hidden className="animate-spin" /> : null}
      {text ?? children}
    </ShadcnButton>
  );
}
