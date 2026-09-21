import { useEffect, useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { useFormContext } from '../Form/context.js';
import { FieldShell } from '../Form/form-item.js';
import { Icon } from '../Icon/index.js';
import type { FieldRule } from '../Input/index.js';

/** 分段选项；`icon` 为 Icon 白名单图标名（kebab-case 或 PascalCase） */
export interface SegmentedOption {
  label: string;
  value: string | number;
  icon?: string;
  disabled?: boolean;
}

export interface SegmentedProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 选项列表（可含表达式解析后的数组） */
  options?: SegmentedOption[];
  /** 受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues） */
  value?: string | number;
  /** 整体禁用 */
  disabled?: boolean;
  /** 选中变化事件，传出选中项的 value */
  onChange?: (value: string | number) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器，独立渲染时为控件本身） */
  className?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

/**
 * Segmented 适配器（shadcn kit）：药丸式分段选择器（选中项高亮）；
 * onChange 传出选中项 value（DSL 语义值）；Form 集成同 Slider 模式。
 */
export function Segmented({
  name,
  label,
  rules,
  options = [],
  value,
  disabled,
  onChange,
  className,
  style,
}: SegmentedProps) {
  const form = useFormContext();
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';
  const [innerValue, setInnerValue] = useState<string | number | undefined>(value);

  useEffect(() => {
    if (inForm && form && name) {
      form.registerField(name, rules, value);
      return () => form.unregisterField(name);
    }
    return undefined;
  });

  const current = inForm && form && name ? form.values[name] : (value ?? innerValue);

  const handleChange = (option: SegmentedOption) => {
    if (disabled || option.disabled) return;
    if (inForm && form && name) {
      form.setValue(name, option.value);
    } else if (value === undefined) {
      setInnerValue(option.value);
    }
    onChange?.(option.value);
  };

  const control = (
    <div
      data-slot="segmented"
      role="radiogroup"
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-muted p-1',
        disabled && 'cursor-not-allowed opacity-50',
        inForm ? undefined : className,
      )}
      style={inForm ? undefined : style}
    >
      {options.map((option) => {
        const active = current === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            data-slot="segmented-item"
            data-value={option.value}
            disabled={disabled === true || option.disabled === true}
            onClick={() => handleChange(option)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm whitespace-nowrap transition-colors',
              active
                ? 'bg-background font-medium text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            {option.icon ? <Icon name={option.icon} size="sm" /> : null}
            {option.label}
          </button>
        );
      })}
    </div>
  );

  if (inForm && form && name) {
    return (
      <FieldShell
        layout={form.layout}
        label={label}
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
