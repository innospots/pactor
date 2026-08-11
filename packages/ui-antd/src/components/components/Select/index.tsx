import { Form as AntForm, Select as AntSelect } from 'antd';

import { useFormContext } from '../Form/context.js';
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
  /** 受控值（独立渲染时生效；Form 内由 Form.Item 托管） */
  value?: string | number | boolean;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  /** 选中变化事件，传出选中的 value */
  onChange?: (value: unknown) => void;
}

/**
 * Select 适配器（设计决策 D3）：与 Input 相同的 Form.Item 自动包装逻辑；
 * onChange 传出选中的 value（设计决策 D2）。
 */
export function Select({
  name,
  label,
  rules,
  options,
  value,
  placeholder,
  disabled,
  allowClear,
  onChange,
}: SelectProps) {
  const formContext = useFormContext();

  const select = (
    <AntSelect
      options={options}
      placeholder={placeholder}
      disabled={disabled}
      allowClear={allowClear}
      onChange={(next) => onChange?.(next)}
    />
  );

  if (formContext?.inForm && name) {
    return (
      <AntForm.Item name={name} label={label} rules={rules}>
        {select}
      </AntForm.Item>
    );
  }

  return (
    <AntSelect
      options={options}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      allowClear={allowClear}
      onChange={(next) => onChange?.(next)}
    />
  );
}
