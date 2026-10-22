import { useI18n } from '@pactor-app/runtime';
import { type VariantProps } from 'class-variance-authority';
import { ArrowUpRightIcon, ChevronDownIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '../lib/utils.js';
import { Button, buttonVariants } from './button.js';
import { ButtonGroup } from './button-group.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu.js';

export interface SplitButtonOption {
  /** 语义化值，选中后经 onSelect 抛出（href 项为跳转地址来源标识） */
  value: string;
  /** 选项文字（separator / section 项忽略） */
  label?: React.ReactNode;
  /** 可选图标节点 */
  icon?: React.ReactNode;
  /** 单项禁用 */
  disabled?: boolean;
  /** 分割线：渲染为菜单分隔符（无交互） */
  separator?: boolean;
  /** 分区标题：小字灰标题（如「Ask about this block」），无交互 */
  section?: React.ReactNode;
  /** 第二行小灰字（如「For LLMs and notes」），渲染在 label 下方 */
  description?: React.ReactNode;
  /** 跳转地址：有则点击经 window.open 打开（target 缺省 _blank），不触发 onSelect */
  href?: string;
  /** href 打开方式，缺省 _blank（新窗口） */
  target?: '_blank' | '_self';
  /** 新窗口外跳指示：项右端渲染 lucide ArrowUpRight 图标；
   *  缺省 href 且非 _self 时自动为 true，onSelect 内 window.open 的场景可显式声明 */
  external?: boolean;
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
  triggerLabel,
  type = 'button',
  ...props
}: SplitButtonProps) {
  const { t } = useI18n();
  const resolvedTriggerLabel = triggerLabel ?? t('pactor.splitButton.moreOptions');
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
              aria-label={resolvedTriggerLabel}
              className="px-2"
            >
              <ChevronDownIcon />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          {options.map((option) =>
            option.separator ? (
              <DropdownMenuSeparator key={option.value} />
            ) : option.section !== undefined ? (
              <div
                key={option.value}
                role="presentation"
                className="px-2 pt-1.5 pb-1 text-xs text-muted-foreground"
              >
                {option.section}
              </div>
            ) : (
              <DropdownMenuItem
                key={option.value}
                disabled={option.disabled}
                onClick={() => {
                  if (option.href !== undefined) {
                    window.open(
                      option.href,
                      option.target ?? '_blank',
                      'noopener,noreferrer',
                    );
                    return;
                  }
                  onSelect?.(option.value);
                }}
              >
                {option.icon}
                <span className="flex flex-col">
                  <span>{option.label}</span>
                  {option.description !== undefined ? (
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  ) : null}
                </span>
                {(option.external ?? (option.href !== undefined && option.target !== '_self')) ? (
                  <ArrowUpRightIcon className="ml-auto size-4 text-muted-foreground" />
                ) : null}
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}

export { SplitButton };
