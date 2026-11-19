import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../lib/utils.js';
import { Button, buttonVariants } from './button.js';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip.js';

export interface IconButtonProps
  extends
    Omit<React.ComponentProps<'button'>, 'children' | 'aria-label'>,
    VariantProps<typeof buttonVariants> {
  /** 图标节点（lucide 图标），恒显 */
  icon: React.ReactNode;
  /** 无障碍名；icon-only 按钮没有可见文字，因此必填 */
  label: string;
  /** 可选 tooltip 文案，提供时悬浮/聚焦显示提示浮层 */
  tooltip?: string;
}

/**
 * IconButton 是 icon-only 按钮的类型安全入口：`label` 必填并直接成为
 * `aria-label`，从类型层面避免无名图标按钮。
 *
 * 与 ActionButton 的关系：ActionButton 保持原有 `label?` 签名，存量调用
 * 不需要迁移；新代码若只放图标，优先使用 IconButton。ActionButton 的
 * dev 告警会提示这一替代。
 */
function IconButton({
  className,
  variant,
  size,
  icon,
  label,
  tooltip,
  type = 'button',
  ...props
}: IconButtonProps) {
  const button = (
    <Button
      data-slot="icon-button"
      variant={variant}
      size={size ?? 'icon-sm'}
      type={type}
      className={cn(className)}
      {...props}
      aria-label={label}
    >
      {icon}
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

export { IconButton };
