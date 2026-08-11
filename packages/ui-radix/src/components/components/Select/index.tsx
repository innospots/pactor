import { Field, Label } from '@radix-ui/react-form';
import * as RadixSelect from '@radix-ui/react-select';
import type { SelectOption, SelectProps } from 'pactor-ui-antd/components';
import { useEffect } from 'react';

import { useFormContext } from '../Form/context.js';

/** Radix Select 的 item value 仅支持 string：JSON 编码保留原始值类型（string/number/boolean） */
function encodeValue(value: SelectOption['value']): string {
  return JSON.stringify(value);
}

/**
 * Select 适配器（Radix kit，语义对齐 antd 版）：
 * 基于 @radix-ui/react-select；Form 内声明 `name` 自动成为表单项；
 * onChange 传出选中的原始 value（经 JSON 编码还原，保留 number/boolean 类型）。
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
    <span className="pcr-select">
      <RadixSelect.Root
        value={currentKey ?? ''}
        onValueChange={handleChange}
        disabled={disabled}
        name={inForm ? name : undefined}
      >
        <RadixSelect.Trigger className="pcr-select-trigger">
          <RadixSelect.Value placeholder={placeholder}>
            {selectedOption?.label}
          </RadixSelect.Value>
          <RadixSelect.Icon className="pcr-select-icon" aria-hidden>
            ▾
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content className="pcr-select-content" position="popper">
            <RadixSelect.Viewport className="pcr-select-viewport">
              {options.map((option) => (
                <RadixSelect.Item
                  key={encodeValue(option.value)}
                  value={encodeValue(option.value)}
                  className="pcr-select-item"
                >
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {allowClear && currentKey !== undefined && !disabled ? (
        <button
          type="button"
          className="pcr-select-clear"
          aria-label="清除"
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
      <Field name={name} className="pcr-form-item">
        {label ? <Label className="pcr-form-label">{label}</Label> : null}
        {select}
        {error ? <div className="pcr-form-error">{error}</div> : null}
      </Field>
    );
  }

  return select;
}
