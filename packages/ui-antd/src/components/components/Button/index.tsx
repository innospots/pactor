import { Button as AntButton } from 'antd';
import type { ReactNode } from 'react';

/** DSL Button 变体（框架级协议，映射到 antd `type`） */
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
  /** true 时作为 Form 的提交按钮（htmlType=submit） */
  submit?: boolean;
  /** 点击事件（Renderer 绑定 events.onClick） */
  onClick?: () => void;
  children?: ReactNode;
}

/** Button 适配器（设计决策 D1/D2）：DSL props → antd Button */
export function Button({
  text,
  variant = 'default',
  danger,
  size,
  loading,
  disabled,
  submit,
  onClick,
  children,
}: ButtonProps) {
  return (
    <AntButton
      type={variant}
      danger={danger}
      size={size}
      loading={loading}
      disabled={disabled}
      htmlType={submit ? 'submit' : 'button'}
      onClick={() => onClick?.()}
    >
      {text ?? children}
    </AntButton>
  );
}
