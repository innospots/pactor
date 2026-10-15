import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../lib/utils.js';
import { Button, buttonVariants } from './button.js';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip.js';

export interface ActionButtonProps
  extends
    Omit<React.ComponentProps<'button'>, 'children'>,
    VariantProps<typeof buttonVariants> {
  /** 图标节点（lucide 图标），恒显 */
  icon: React.ReactNode;
  /** 可选文字；缺省时渲染 icon-only 方形按钮（size 缺省回退 icon-sm） */
  label?: React.ReactNode;
  /** 可选 tooltip 文案，提供时悬浮/聚焦显示提示浮层 */
  tooltip?: string;
}

/**
 * ActionButton 紧凑工具栏按钮：扩展按钮组件，交互设计参考 arc-library
 * （https://github.com/kuratlielia/arc-library），Tailwind 实现。
 * `buttonVariants` 薄封装：icon + 可选 label，默认 size="sm"（无 label 时
 * 回退 icon-sm 方形）；`tooltip` 提供时包裹现有 Tooltip。
 * icon-only 时须传 `aria-label`（缺失时 dev 告警，不抛错）。
 */
function ActionButton({
  className,
  variant,
  size,
  icon,
  label,
  tooltip,
  type = 'button',
  ...props
}: ActionButtonProps) {
  const resolvedSize = size ?? (label ? 'sm' : 'icon-sm');

  if (
    process.env.NODE_ENV !== 'production' &&
    !label &&
    !props['aria-label']
  ) {
    // eslint-disable-next-line no-console
    console.warn('[ActionButton] icon-only 用法须传 aria-label 以保证可访问性。');
  }

  const button = (
    <Button
      data-slot="action-button"
      variant={variant}
      size={resolvedSize}
      type={type}
      className={cn(className)}
      {...props}
    >
      {icon}
      {label ? <span>{label}</span> : null}
    </Button>
  );

  if (!tooltip) return button;

  return (
    <Tooltip>
      <TooltipTrigger render={button as React.ReactElement} />
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export { ActionButton };
