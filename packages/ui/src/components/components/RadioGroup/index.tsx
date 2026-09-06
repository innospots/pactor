import { useEffect, useId, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { RadioGroup as ShadcnRadioGroup, RadioGroupItem } from '../../../ui/radio-group.js';
import { useFormContext } from '../Form/context.js';
import { FieldShell } from '../Form/form-item.js';
import type { FieldRule } from '../Input/index.js';

/** RadioGroup 选项 */
export interface RadioGroupOption {
  label: string;
  value: string | number | boolean;
  /** 单个选项禁用 */
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 选项列表 */
  options?: RadioGroupOption[];
  /** 受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues） */
  value?: string | number | boolean;
  disabled?: boolean;
  /** 选中变化事件，传出选中项的 value */
  onChange?: (value: string | number | boolean) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器，独立渲染时为控件包裹） */
  className?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

/**
 * RadioGroup 适配器（shadcn kit）：基于 vendored RadioGroup（Base UI）；
 * Base UI RadioGroup 的 value 原生支持 string/number/boolean，
 * onChange 传出选中项原始 value。
 */
export function RadioGroup({
  name,
  label,
  rules,
  options = [],
  value,
  disabled,
  onChange,
  className,
  style,
}: RadioGroupProps) {
  const form = useFormContext();
  const controlId = useId();
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';

  useEffect(() => {
    if (inForm && form && name) {
      form.registerField(name, rules, value);
      return () => form.unregisterField(name);
    }
    return undefined;
  });

  const current = inForm && form && name ? form.values[name] : value;

  const handleChange = (next: RadioGroupOption['value']) => {
    if (inForm && form && name) {
      form.setValue(name, next);
    }
    onChange?.(next);
  };

  // 始终受控：未选中用 '' 占位（不命中任何选项），避免 Form 内初值 undefined
  // 导致的 uncontrolled → controlled 切换
  const groupValue = (current ?? '') as RadioGroupOption['value'];

  const group = (
    <ShadcnRadioGroup<RadioGroupOption['value']>
      value={groupValue}
      onValueChange={handleChange}
      disabled={disabled}
      name={inForm ? name : undefined}
      className={cn(!inForm && className)}
      style={inForm ? undefined : style}
    >
      {options.map((option, index) => {
        const optionId = `${controlId}-${index}`;
        return (
          <span key={String(option.value)} className="inline-flex items-center gap-2">
            <RadioGroupItem
              id={optionId}
              value={option.value}
              disabled={option.disabled}
            />
            <label htmlFor={optionId} className="text-sm leading-none font-medium">
              {option.label}
            </label>
          </span>
        );
      })}
    </ShadcnRadioGroup>
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
        {group}
      </FieldShell>
    );
  }

  return group;
}
