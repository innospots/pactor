import { Field, Label } from '@radix-ui/react-form';
import { useI18n } from 'pactor-runtime';
import { useEffect } from 'react';

import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select.js';
import { formItemClass, useFormContext } from '../Form/context.js';
import type { FieldRule } from '../Input/index.js';

/** Select 选项（支持表达式解析后的数组） */
export interface SelectOption {
  label: string;
  value: string | number | boolean;
}

export interface SelectProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 选项列表 */
  options?: SelectOption[];
  /** 受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues） */
  value?: string | number | boolean;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  /** 选中变化事件，传出选中的 value */
  onChange?: (value: unknown) => void;
}

/** Radix Select 的 item value 仅支持 string：JSON 编码保留原始值类型（string/number/boolean） */
function encodeValue(value: SelectOption['value']): string {
  return JSON.stringify(value);
}

/**
 * Select 适配器（shadcn kit，语义对齐 antd 版）：
 * 基于 vendored shadcn Select（@radix-ui/react-select）；Form 内声明 `name`
 * 自动成为表单项；onChange 传出选中的原始 value（经 JSON 编码还原，
 * 保留 number/boolean 类型）。
 */
export function Select({
  name,
  label,
  rules,
  options = [],
  value,
  placeholder,
  disabled,
  allowClear,
  onChange,
}: SelectProps) {
  const form = useFormContext();
  const { t } = useI18n();
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';

  // 注册字段校验规则，同时把 value prop 作为字段级初始值交给 Form 上下文合并
  useEffect(() => {
    if (inForm && form && name) {
      form.registerField(name, rules, value);
      return () => form.unregisterField(name);
    }
    return undefined;
  });

  const current = inForm && form && name ? form.values[name] : value;
  const currentKey =
    current === undefined || current === null || current === ''
      ? undefined
      : encodeValue(current as SelectOption['value']);

  const handleChange = (key: string) => {
    // Radix Select 在值从 uncontrolled 切换为 controlled 等场景会
    // 以空串回调"纠正"值——忽略空 key，防止清空已有值（如初始值回填）
    if (key === '') {
      return;
    }
    const next = options.find((option) => encodeValue(option.value) === key);
    const nextValue = next?.value;
    if (inForm && form && name) {
      form.setValue(name, nextValue);
    }
    onChange?.(nextValue);
  };

  // Radix Select 的 Select.Value 仅在 item 渲染过时才能解析出选中项文本；
  // 未打开过下拉时（如表单初始值回填）会显示占位符。
  // 因此显式计算选中项 label 作为 Value 的 children。
  const selectedOption =
    currentKey === undefined
      ? undefined
      : options.find((option) => encodeValue(option.value) === currentKey);

  const select = (
    <span className="inline-flex items-center gap-1">
      <ShadcnSelect
        value={currentKey ?? ''}
        onValueChange={handleChange}
        disabled={disabled}
        name={inForm ? name : undefined}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder}>
            {selectedOption?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={encodeValue(option.value)}
              value={encodeValue(option.value)}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </ShadcnSelect>
      {allowClear && currentKey !== undefined && !disabled ? (
        <button
          type="button"
          aria-label={t('pactor.select.clear')}
          className="cursor-pointer text-muted-foreground hover:text-foreground"
          onClick={() => {
            if (inForm && form && name) {
              form.setValue(name, undefined);
            }
            onChange?.(undefined);
          }}
        >
          ×
        </button>
      ) : null}
    </span>
  );

  if (inForm && form && name) {
    const error = form.errors[name];
    return (
      <Field name={name} data-slot="form-item" className={formItemClass(form.layout)}>
        {label ? (
          <Label className="text-sm leading-none font-medium">{label}</Label>
        ) : null}
        {select}
        {error ? (
          <div data-slot="form-error" className="text-sm text-destructive">
            {error}
          </div>
        ) : null}
      </Field>
    );
  }

  return select;
}
