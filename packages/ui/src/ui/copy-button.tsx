import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../lib/utils.js';
import { Button, buttonVariants } from './button.js';
import { IconMorph } from './icon-morph.js';

export interface CopyButtonProps
  extends
    Omit<React.ComponentProps<'button'>, 'children' | 'value' | 'onCopy'>,
    VariantProps<typeof buttonVariants> {
  /** 待写入剪贴板的文本 */
  value: string;
  /** 初始态可选文字（图标恒显） */
  label?: React.ReactNode;
  /** copied 态可选文字，缺省沿用 label */
  copiedLabel?: React.ReactNode;
  /** copied 态自动还原延迟（ms），默认 1500 */
  resetDelay?: number;
  /** 写入成功回调，携带 value */
  onCopy?: (value: string) => void;
  /** 剪贴板不可用 / 写入失败回调（不进入 copied 态） */
  onError?: (error: unknown) => void;
}

/**
 * CopyButton 复制确认按钮：扩展按钮组件，交互设计参考 arc-library
 * （https://github.com/kuratlielia/arc-library），Tailwind 实现。
 * 点击 → `navigator.clipboard.writeText(value)` → copied 态（IconMorph
 * copy→check + 可选 copiedLabel）→ `resetDelay`（默认 1500ms）后自动还原；
 * 剪贴板不可用或写入失败时触发 `onError`，不进入 copied 态。
 */
function CopyButton({
  className,
  variant = 'outline',
  size = 'sm',
  value,
  label,
  copiedLabel,
  resetDelay = 1500,
  onCopy,
  onError,
  onClick,
  disabled,
  type = 'button',
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled) return;
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('navigator.clipboard 不可用（非安全上下文）');
      }
      await navigator.clipboard.writeText(value);
      if (timerRef.current) clearTimeout(timerRef.current);
      setCopied(true);
      onCopy?.(value);
      timerRef.current = setTimeout(() => setCopied(false), resetDelay);
    } catch (error) {
      onError?.(error);
    }
  };

  return (
    <Button
      data-slot="copy-button"
      data-state={copied ? 'copied' : 'idle'}
      variant={variant}
      size={size}
      type={type}
      disabled={disabled}
      className={cn(className)}
      onClick={handleClick}
      {...props}
    >
      <IconMorph morph="copy-check" state={copied ? 'b' : 'a'} />
      {copied && copiedLabel ? (
        <span>{copiedLabel}</span>
      ) : label ? (
        <span>{label}</span>
      ) : null}
    </Button>
  );
}

export { CopyButton };
