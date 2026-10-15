import * as React from 'react';

import { cn } from '../lib/utils.js';

export interface ExpandingButtonGroupOption {
  /** 语义化值，选中后经 onSelect 抛出 */
  value: string;
  /** 展开后显示的文字 */
  label: React.ReactNode;
  /** 恒显图标节点 */
  icon: React.ReactNode;
  /** 声明后点击进入原地确认态，再次点击才触发 onSelect */
  confirm?: boolean;
  /** 确认态显示的文字，缺省“确认” */
  confirmLabel?: React.ReactNode;
  /** 单项禁用 */
  disabled?: boolean;
}

export interface ExpandingButtonGroupProps {
  /** 选项列表 */
  options: ExpandingButtonGroupOption[];
  /** 选中回调（confirm 选项需二次点击），携带 option.value */
  onSelect?: (value: string) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: React.CSSProperties;
}

/**
 * ExpandingButtonGroup 展开式按钮组：扩展按钮组件，交互设计参考
 * arc-library（https://github.com/kuratlielia/arc-library），Tailwind 实现。
 * 紧凑图标按钮组：hover/聚焦的按钮经 grid-template-columns 0fr→1fr
 * 过渡原地展开 label，其余按钮保持图标态让位；声明 `confirm` 的选项
 * 首次点击进入原地确认态，再次点击才触发一次 onSelect（失焦/移出取消
 * 确认态）。按钮为原生 button，键盘可达。
 */
function ExpandingButtonGroup({
  options,
  onSelect,
  className,
  style,
}: ExpandingButtonGroupProps) {
  // 当前展开项：hover 或聚焦（focus-visible 样式由 CSS 负责，状态同等展开）
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [confirming, setConfirming] = React.useState<string | null>(null);

  const handleClick = (option: ExpandingButtonGroupOption) => {
    if (option.confirm) {
      if (confirming === option.value) {
        setConfirming(null);
        onSelect?.(option.value);
      } else {
        setConfirming(option.value);
      }
      return;
    }
    onSelect?.(option.value);
  };

  return (
    <div
      role="group"
      data-slot="expanding-button-group"
      className={cn('inline-flex w-fit items-center gap-1', className)}
      style={style}
    >
      {options.map((option) => {
        const isConfirming = confirming === option.value;
        const isExpanded = expanded === option.value || isConfirming;
        return (
          <button
            key={option.value}
            type="button"
            data-slot="expanding-button-group-item"
            data-value={option.value}
            data-expanded={isExpanded ? '' : undefined}
            data-confirming={isConfirming ? '' : undefined}
            disabled={option.disabled}
            className={cn(
              'inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2 text-sm font-medium whitespace-nowrap outline-none transition-colors duration-150 hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
              isConfirming && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            )}
            onMouseEnter={() => setExpanded(option.value)}
            onMouseLeave={() => {
              setExpanded(null);
              setConfirming((prev) =>
                prev === option.value ? null : prev,
              );
            }}
            onFocus={() => setExpanded(option.value)}
            onBlur={() => {
              setExpanded(null);
              setConfirming((prev) =>
                prev === option.value ? null : prev,
              );
            }}
            onClick={() => handleClick(option)}
          >
            {option.icon}
            <span
              className="grid transition-[grid-template-columns] duration-200 ease-out motion-reduce:transition-none"
              style={{ gridTemplateColumns: isExpanded ? '1fr' : '0fr' }}
            >
              <span className="overflow-hidden">
                {isConfirming ? (option.confirmLabel ?? '确认') : option.label}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export { ExpandingButtonGroup };
