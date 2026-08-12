import { Form as AntForm, Input as AntInput } from 'antd';

import { useFormContext, useFieldInitialValue } from '../Form/context.js';

/** DSL 校验规则（框架级协议，当前支持 required + message） */
export interface FieldRule {
  required?: boolean;
  message?: string;
}

export interface InputProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues） */
  value?: string;
  /** 输入类型：password 时掩码输入（缺省 text） */
  type?: 'text' | 'password';
  placeholder?: string;
  disabled?: boolean;
  /** 输入事件，传出 string 值（非原生 event，设计决策 D2） */
  onChange?: (value: string) => void;
}

/**
 * Input 适配器（设计决策 D3）：
 * 在 Form 内且声明 `name` 时自动包装 Form.Item（label / rules 生效）；
 * 否则渲染独立受控控件，onChange 仅触发事件。
 */
export function Input({
  name,
  label,
  rules,
  value,
  type = 'text',
  placeholder,
  disabled,
  onChange,
}: InputProps) {
  const formContext = useFormContext();
  useFieldInitialValue(formContext, name, value);

  const InputComponent = type === 'password' ? AntInput.Password : AntInput;

  const input = (
    <InputComponent
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );

  if (formContext?.inForm && name) {
    return (
      <AntForm.Item name={name} label={label} rules={rules} initialValue={value}>
        {input}
      </AntForm.Item>
    );
  }

  return (
    <InputComponent
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}
