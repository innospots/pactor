import { type VariantProps } from 'class-variance-authority';
import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '../lib/utils.js';
import { Button, buttonVariants } from './button.js';
import { ButtonGroup } from './button-group.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu.js';

export interface SplitButtonOption {
  /** 语义化值，选中后经 onSelect 抛出 */
  value: string;
  /** 选项文字 */
  label: React.ReactNode;
  /** 可选图标节点 */
  icon?: React.ReactNode;
  /** 单项禁用 */
  disabled?: boolean;
}

export interface SplitButtonProps
  extends
    Omit<React.ComponentProps<'button'>, 'children' | 'onSelect'>,
    VariantProps<typeof buttonVariants> {
  /** 主操作按钮文字 */
  children?: React.ReactNode;
  /** 备选操作列表 */
  options: SplitButtonOption[];
  /** 选中备选操作回调，携带 option.value */
  onSelect?: (value: string) => void;
  /** 下拉触发按钮的无障碍名 */
  triggerLabel?: string;
}

/**
 * SplitButton 分体式按钮：扩展按钮组件，交互设计参考 arc-library
 * （https://github.com/kuratlielia/arc-library），Tailwind 实现。
 * ButtonGroup 相连表面 = 主操作 Button（原生 onClick）+ DropdownMenu
 * （chevron 触发，备选操作经 options 声明、onSelect(value) 语义化抛出）；
 * variant/size/disabled 同时作用于两段。
 */
function SplitButton({
  className,
  style,
  variant,
  size,
  disabled,
  children,
  options,
  onSelect,
  triggerLabel = '更多选项',
  type = 'button',
  ...props
}: SplitButtonProps) {
  return (
    <ButtonGroup data-slot="split-button" className={cn(className)} style={style}>
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        type={type}
        {...props}
      >
        {children}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant={variant}
              size={size}
              disabled={disabled}
              aria-label={triggerLabel}
              className="px-2"
            >
              <ChevronDownIcon />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              disabled={option.disabled}
              onClick={() => onSelect?.(option.value)}
            >
              {option.icon}
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}

export { SplitButton };
