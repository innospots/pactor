import { useEffect, useId, type CSSProperties } from 'react';

import { Textarea as ShadcnTextarea } from '../../../ui/textarea.js';
import { useFormContext } from '../Form/context.js';
import { FieldShell } from '../Form/form-item.js';
import type { FieldRule } from '../Input/index.js';

export interface TextareaProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues） */
  value?: string;
  placeholder?: string;
  /** 行数（缺省由内容自适应） */
  rows?: number;
  disabled?: boolean;
  /** 输入事件，传出 string 值 */
  onChange?: (value: string) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器，独立渲染时为控件本身） */
  className?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

/**
 * Textarea 适配器（shadcn kit）：Form 内声明 `name` 自动成为表单项；
 * onChange 传出 string（非原生 event）。
 */
export function Textarea({
  name,
  label,
  rules,
  value,
  placeholder,
  rows,
  disabled,
  onChange,
  className,
  style,
}: TextareaProps) {
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

  if (inForm && form && name) {
    const fieldValue = form.values[name];
    return (
      <FieldShell
        layout={form.layout}
        label={label}
        htmlFor={controlId}
        error={form.errors[name]}
        className={className}
        style={style}
      >
        <ShadcnTextarea
          id={controlId}
          value={typeof fieldValue === 'string' ? fieldValue : ''}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          onChange={(event) => {
            form.setValue(name, event.target.value);
            onChange?.(event.target.value);
          }}
        />
      </FieldShell>
    );
  }

  return (
    <ShadcnTextarea
      value={value ?? ''}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={className}
      style={style}
      onChange={(event) => onChange?.(event.target.value)}
    />
  );
}
