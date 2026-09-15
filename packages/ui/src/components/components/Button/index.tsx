import { Loader2 } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';
import {
  Button as ShadcnButton,
  type buttonVariants,
} from '../../../ui/button.js';
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../ui/tooltip.js';
import { Icon } from '../Icon/index.js';
import type { VariantProps } from 'class-variance-authority';

/** DSL Button 变体（框架级协议） */
export type ButtonVariant = 'default' | 'primary' | 'dashed' | 'link' | 'text';

/** DSL Button 尺寸 */
export type ButtonSize = 'small' | 'middle' | 'large';

export interface ButtonProps {
  /** 按钮文本；也可用 children 渲染内容 */
  text?: string;
  /** 图标名（Icon 白名单，kebab-case / PascalCase 均可），渲染在文本前 */
  icon?: string;
  /** 提示文案：hover / focus 按钮时展示 Tooltip */
  tooltip?: string;
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
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
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
 * 变体保持原样、文字标红）；loading 显示旋转图标并禁用（优先于 icon）；
 * `icon` 渲染文本前图标（对齐 Alert 的 icon 通道）；`tooltip` 经 vendored
 * Tooltip 包装（Trigger render 合并到按钮本体）。
 */
export function Button({
  text,
  icon,
  tooltip,
  variant = 'default',
  danger,
  size = 'middle',
  loading,
  disabled,
  submit,
  onClick,
  className,
  style,
  children,
}: ButtonProps) {
  const textual = variant === 'link' || variant === 'text';
  const button = (
    <ShadcnButton
      type={submit ? 'submit' : 'button'}
      variant={danger && !textual ? 'destructive' : variantMap[variant]}
      size={sizeMap[size]}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      onClick={() => onClick?.()}
      style={style}
      className={cn(
        variant === 'dashed' && 'border-dashed',
        danger && textual && 'text-destructive hover:text-destructive',
        className,
      )}
    >
      {loading ? (
        <Loader2 aria-hidden className="animate-spin" />
      ) : icon ? (
        <Icon name={icon} size="sm" />
      ) : null}
      {text ?? children}
    </ShadcnButton>
  );

  if (tooltip) {
    // Trigger 以 render 合并到按钮本体（不引入额外包裹节点，根节点仍为按钮；
    // 禁用时 disabled:pointer-events-none 致 hover 不触发，focus 仍可达）
    return (
      <ShadcnTooltip>
        <TooltipTrigger render={button} />
        <TooltipContent>{tooltip}</TooltipContent>
      </ShadcnTooltip>
    );
  }

  return button;
}
