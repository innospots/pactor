import { Control, Field, Label } from '@radix-ui/react-form';
import type { InputProps } from 'pactor-ui-antd/components';
import { useEffect } from 'react';

import { useFormContext } from '../Form/context.js';

/**
 * Input 适配器（Radix kit，语义对齐 antd 版）：
 * 在 Form 内且声明 `name` 时自动成为表单项（label / rules 生效，
 * 值由 Form 上下文托管）；否则渲染独立受控控件，onChange 传出 string。
 */
export function Input({
  name,
  label,
  rules,
  value,
  placeholder,
  disabled,
  onChange,
}: InputProps) {
  const form = useFormContext();
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';

  // 注册/注销字段校验规则（rules 每次渲染刷新，卸载时注销）
  useEffect(() => {
    if (inForm && form && name) {
      form.registerField(name, rules);
      return () => form.unregisterField(name);
    }
    return undefined;
  });

  if (inForm && form && name) {
    const fieldValue = form.values[name];
    const error = form.errors[name];
    return (
      <Field name={name} className="pcr-form-item">
        {label ? <Label className="pcr-form-label">{label}</Label> : null}
        <Control asChild>
          <input
            className="pcr-input"
            value={typeof fieldValue === 'string' ? fieldValue : ''}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(event) => {
              form.setValue(name, event.target.value);
              onChange?.(event.target.value);
            }}
          />
        </Control>
        {error ? <div className="pcr-form-error">{error}</div> : null}
      </Field>
    );
  }

  return (
    <input
      className="pcr-input"
      value={value ?? ''}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(event) => onChange?.(event.target.value)}
    />
  );
}
