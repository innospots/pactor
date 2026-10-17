import { useI18n } from '@pactor-app/runtime';
import { ChevronRight } from 'lucide-react';
import { useEffect, useId, useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Popover, PopoverContent, PopoverTrigger } from '../../../ui/popover.js';
import { CLEARABLE_GROUP, CLEARABLE_ICON_HIDE, ClearHoverButton } from '../../clearable.js';
import { CONTROL_SIZE_BOX, type ControlSize } from '../../control-size.js';
import { useFormContext } from '../Form/context.js';
import { FieldShell } from '../Form/form-item.js';
import type { FieldRule } from '../Input/index.js';

/** Cascader 选项节点（嵌套，含 children 的节点点开下一列，叶子完成选择） */
export interface CascaderOption {
  label: string;
  value: string | number;
  children?: CascaderOption[];
}

export interface CascaderProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 嵌套选项 */
  options?: CascaderOption[];
  /** 受控值（路径 value 数组）；Form 内作为字段初始值 */
  value?: Array<string | number>;
  placeholder?: string;
  disabled?: boolean;
  /** 控件尺寸（默认 middle，即现行 h-9 尺寸） */
  size?: ControlSize;
  /** hover 清除（缺省开启，传 false 关闭）：有值时悬停触发器，箭头图标替换为 ×，点击清空（传出 undefined） */
  allowClear?: boolean;
  /** 选中叶子事件，传出路径 value 数组；清除时传出 undefined */
  onChange?: (value: Array<string | number> | undefined) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器，独立渲染时为触发器） */
  className?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

type Path = Array<string | number>;

/** 按路径 value 数组取路径节点链（任一级未命中返回 undefined） */
function resolvePath(
  options: CascaderOption[],
  path: Path,
): CascaderOption[] | undefined {
  const nodes: CascaderOption[] = [];
  let level = options;
  for (const value of path) {
    const node = level.find((option) => option.value === value);
    if (!node) return undefined;
    nodes.push(node);
    level = node.children ?? [];
  }
  return nodes;
}

/**
 * Cascader 适配器（shadcn kit）：触发器 + 受控 Popover 多列逐级下钻
 * （点含 children 的节点开下一列，点叶子完成选择）；触发器文本用
 * ` / ` 连接路径 label。onChange 传出路径 value 数组（DSL 语义值）；
 * Form 内声明 `name` 自动成为表单项。
 */
export function Cascader({
  name,
  label,
  rules,
  options = [],
  value,
  placeholder,
  disabled,
  size = 'middle',
  allowClear,
  onChange,
  className,
  style,
}: CascaderProps) {
  const form = useFormContext();
  const { t } = useI18n();
  const controlId = useId();
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (inForm && form && name) {
      form.registerField(name, rules, value);
      return () => form.unregisterField(name);
    }
    return undefined;
  });

  // 独立渲染：内部选中态（外部 value 变化时同步镜像）
  const [innerValue, setInnerValue] = useState<Path | undefined>(value);
  useEffect(() => {
    if (!inForm) setInnerValue(value);
  }, [inForm, value]);

  const current = inForm && form && name ? form.values[name] : innerValue;
  const committedPath: Path = Array.isArray(current) ? (current as Path) : [];
  const committedNodes = resolvePath(options, committedPath);
  const displayText =
    committedNodes && committedNodes.length > 0
      ? committedNodes.map((node) => node.label).join(' / ')
      : '';
  // hover 清除：有值且未禁用时，悬停把触发器右侧箭头图标替换为 ×
  const showClear = allowClear !== false && disabled !== true && displayText !== '';
  const handleClear = () => {
    if (inForm && form && name) {
      form.setValue(name, undefined);
    } else {
      setInnerValue(undefined);
    }
    onChange?.(undefined);
  };

  // 弹层内下钻路径（打开时以已提交路径初始化）
  const [activePath, setActivePath] = useState<Path>([]);
  const openPanel = (next: boolean) => {
    if (next) setActivePath(committedPath);
    setOpen(next);
  };

  const commit = (next: Path) => {
    if (inForm && form && name) {
      form.setValue(name, next);
    } else {
      setInnerValue(next);
    }
    onChange?.(next);
  };

  const handlePick = (option: CascaderOption, depth: number) => {
    const nextPath = [...activePath.slice(0, depth), option.value];
    if ((option.children?.length ?? 0) > 0) {
      setActivePath(nextPath);
    } else {
      commit(nextPath);
      setOpen(false);
    }
  };

  // 列：第 0 列为根，其后每列为上一列选中节点的 children
  const columns: CascaderOption[][] = [options];
  const activeNodes = resolvePath(options, activePath) ?? [];
  for (const node of activeNodes) {
    if ((node.children?.length ?? 0) > 0) columns.push(node.children ?? []);
    else break;
  }

  const control = (
    <Popover open={open} onOpenChange={openPanel}>
      <PopoverTrigger
        id={controlId}
        type="button"
        disabled={disabled}
        data-slot="cascader-trigger"
        className={cn(
          'flex h-9 w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-md border border-input bg-(--input-background) px-3 py-1 text-sm text-(--input-foreground) shadow-xs transition-colors outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
          CONTROL_SIZE_BOX[size],
          CLEARABLE_GROUP,
          displayText === '' && 'text-muted-foreground',
          !inForm && className,
        )}
        style={inForm ? undefined : style}
      >
        <span className="min-w-0 flex-1 truncate text-left">
          {displayText === ''
            ? (placeholder ?? t('pactor.select.placeholder'))
            : displayText}
        </span>
        {showClear ? (
          <ClearHoverButton label={t('pactor.control.clear')} onClear={handleClear} />
        ) : null}
        <ChevronRight
          className={cn(
            'size-4 shrink-0 rotate-90 opacity-50',
            showClear && CLEARABLE_ICON_HIDE,
          )}
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-1">
        <div data-slot="cascader-panel" className="flex">
          {columns.map((column, depth) => (
            <div
              key={depth}
              data-slot="cascader-column"
              className="flex max-h-64 w-40 flex-col gap-0.5 overflow-y-auto border-r border-border p-1 last:border-r-0"
            >
              {column.map((option) => {
                const hasChildren = (option.children?.length ?? 0) > 0;
                const active = activePath[depth] === option.value;
                return (
                  <button
                    key={String(option.value)}
                    type="button"
                    className={cn(
                      'flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent',
                      active && 'bg-accent font-medium',
                    )}
                    onClick={() => handlePick(option, depth)}
                  >
                    <span className="min-w-0 flex-1 truncate">{option.label}</span>
                    {hasChildren ? (
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );

  if (inForm && form && name) {
    return (
      <FieldShell
        layout={form.layout}
        label={label}
        rules={rules}
        htmlFor={controlId}
        error={form.errors[name]}
        className={className}
        style={style}
      >
        {control}
      </FieldShell>
    );
  }

  return control;
}
