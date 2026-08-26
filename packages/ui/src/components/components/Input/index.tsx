import { Control, Field, Label } from '@radix-ui/react-form';
import { useEffect } from 'react';

import { Input as ShadcnInput } from '../../../ui/input.js';
import { formItemClass, useFormContext } from '../Form/context.js';

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
 * Input 适配器（shadcn kit，语义对齐 antd 版）：
 * 在 Form 内且声明 `name` 时自动成为表单项（label / rules 生效，
 * 值由 Form 上下文托管）；否则渲染独立受控控件，onChange 传出 string。
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
  const form = useFormContext();
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';

  // 注册/注销字段校验规则（rules 每次渲染刷新，卸载时注销）；
  // 同时把 value prop 作为字段级初始值交给 Form 上下文合并（仅首次注册生效）
  useEffect(() => {
    if (inForm && form && name) {
      form.registerField(name, rules, value);
      return () => form.unregisterField(name);
    }
    return undefined;
  });

  if (inForm && form && name) {
    const fieldValue = form.values[name];
    const error = form.errors[name];
    return (
      <Field name={name} data-slot="form-item" className={formItemClass(form.layout)}>
        {label ? (
          <Label className="text-sm leading-none font-medium">{label}</Label>
        ) : null}
        <Control asChild>
          <ShadcnInput
            type={type}
            value={typeof fieldValue === 'string' ? fieldValue : ''}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(event) => {
              form.setValue(name, event.target.value);
              onChange?.(event.target.value);
            }}
          />
        </Control>
        {error ? (
          <div data-slot="form-error" className="text-sm text-destructive">
            {error}
          </div>
        ) : null}
      </Field>
    );
  }

  return (
    <ShadcnInput
      type={type}
      value={value ?? ''}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(event) => onChange?.(event.target.value)}
    />
  );
}
