import { useI18n } from '@pactor-app/runtime';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { useFormContext } from '../Form/context.js';
import { FieldShell } from '../Form/form-item.js';
import type { FieldRule } from '../Input/index.js';

/** Transfer 选项 */
export interface TransferOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface TransferProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 全部选项（左列 = 未进目标侧的项，右列 = 目标侧的项） */
  options?: TransferOption[];
  /** 受控值（目标侧 value 数组）；Form 内作为字段初始值 */
  value?: Array<string | number>;
  /** 左右两列标题，缺省 ['列表 1', '列表 2'] */
  titles?: [string, string];
  disabled?: boolean;
  /** 移动变化事件，传出目标侧 value 数组 */
  onChange?: (value: Array<string | number>) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器，独立渲染时为控件根节点） */
  className?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

type Key = string | number;

/**
 * Transfer 适配器（shadcn kit）：左右两列 checkbox 列表 + 中间左右
 * 移动按钮；列头 checkbox 全选该列可用项。字段值与 onChange 均为
 * 目标侧 value 数组（DSL 语义值）；Form 内声明 `name` 自动成为表单项。
 */
export function Transfer({
  name,
  label,
  rules,
  options = [],
  value,
  titles,
  disabled,
  onChange,
  className,
  style,
}: TransferProps) {
  const form = useFormContext();
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';

  useEffect(() => {
    if (inForm && form && name) {
      form.registerField(name, rules, value);
      return () => form.unregisterField(name);
    }
    return undefined;
  });

  // 独立渲染：内部选中态（外部 value 变化时同步镜像）
  const [innerValue, setInnerValue] = useState<Key[]>(value ?? []);
  useEffect(() => {
    if (!inForm) setInnerValue(value ?? []);
  }, [inForm, value]);

  const current = inForm && form && name ? form.values[name] : innerValue;
  const targetKeys: Key[] = Array.isArray(current) ? (current as Key[]) : [];

  const leftOptions = options.filter((option) => !targetKeys.includes(option.value));
  const rightOptions = options.filter((option) => targetKeys.includes(option.value));

  const [leftChecked, setLeftChecked] = useState<Set<Key>>(new Set());
  const [rightChecked, setRightChecked] = useState<Set<Key>>(new Set());
  const { t } = useI18n();
  const resolvedTitles =
    titles ?? [t('pactor.transfer.listOne'), t('pactor.transfer.listTwo')];

  const commit = (next: Key[]) => {
    if (inForm && form && name) {
      form.setValue(name, next);
    } else {
      setInnerValue(next);
    }
    onChange?.(next);
  };

  const moveRight = () => {
    const moved = leftOptions
      .filter((option) => leftChecked.has(option.value) && !option.disabled)
      .map((option) => option.value);
    if (moved.length === 0) return;
    commit([...targetKeys, ...moved]);
    setLeftChecked(new Set());
  };

  const moveLeft = () => {
    const moved = new Set(
      rightOptions
        .filter((option) => rightChecked.has(option.value) && !option.disabled)
        .map((option) => option.value),
    );
    if (moved.size === 0) return;
    commit(targetKeys.filter((key) => !moved.has(key)));
    setRightChecked(new Set());
  };

  const toggleChecked = (
    side: 'left' | 'right',
    key: Key,
    checked: boolean,
  ) => {
    const setter = side === 'left' ? setLeftChecked : setRightChecked;
    setter((prev) => {
      const next = new Set(prev);
      if (checked) next.add(key);
      else next.delete(key);
      return next;
    });
  };

  const renderPanel = (
    side: 'left' | 'right',
    title: string,
    items: TransferOption[],
    checked: Set<Key>,
  ) => {
    const enabledItems = items.filter((option) => !option.disabled);
    const allChecked =
      enabledItems.length > 0 &&
      enabledItems.every((option) => checked.has(option.value));
    return (
      <div
        data-slot={`transfer-${side}-panel`}
        className="flex w-48 flex-col rounded-md border border-border"
      >
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <input
            type="checkbox"
            aria-label={t('pactor.transfer.selectAll', { title })}
            disabled={disabled || enabledItems.length === 0}
            checked={allChecked}
            onChange={(event) => {
              if (event.target.checked) {
                (side === 'left' ? setLeftChecked : setRightChecked)(
                  new Set(enabledItems.map((option) => option.value)),
                );
              } else {
                (side === 'left' ? setLeftChecked : setRightChecked)(new Set());
              }
            }}
          />
          <span className="text-sm font-medium">{title}</span>
          <span className="ml-auto text-xs text-muted-foreground">
            {t('pactor.transfer.itemCount', { count: items.length })}
          </span>
        </div>
        <div className="flex max-h-48 flex-col overflow-y-auto p-1">
          {items.map((option) => (
            <label
              key={String(option.value)}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent',
                (disabled || option.disabled) && 'cursor-not-allowed opacity-50',
              )}
            >
              <input
                type="checkbox"
                disabled={disabled || option.disabled}
                checked={checked.has(option.value)}
                onChange={(event) =>
                  toggleChecked(side, option.value, event.target.checked)
                }
              />
              <span className="min-w-0 flex-1 truncate">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const control = (
    <div
      data-slot="transfer"
      className={cn('flex items-center gap-2', !inForm && className)}
      style={inForm ? undefined : style}
    >
      {renderPanel('left', resolvedTitles[0], leftOptions, leftChecked)}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          aria-label={t('pactor.transfer.moveRight')}
          disabled={disabled || leftChecked.size === 0}
          className="flex size-8 cursor-pointer items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={moveRight}
        >
          <ChevronRight className="size-4" />
        </button>
        <button
          type="button"
          aria-label={t('pactor.transfer.moveLeft')}
          disabled={disabled || rightChecked.size === 0}
          className="flex size-8 cursor-pointer items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={moveLeft}
        >
          <ChevronLeft className="size-4" />
        </button>
      </div>
      {renderPanel('right', resolvedTitles[1], rightOptions, rightChecked)}
    </div>
  );

  if (inForm && form && name) {
    return (
      <FieldShell
        layout={form.layout}
        label={label}
        rules={rules}
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
