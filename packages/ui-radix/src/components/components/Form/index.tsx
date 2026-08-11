import { Root as FormRoot } from '@radix-ui/react-form';
import type { FieldRule, FormProps } from 'pactor-ui-antd/components';
import { useRenderer } from 'pactor-runtime';
import { useMemo, useRef, useState } from 'react';

import { FormContextProvider, type FormContextValue } from './context.js';

function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || value === '';
}

/**
 * Form 容器（Radix kit，语义对齐 antd 版）：
 * 维护受控 values 并经 React Context 下发，Form 内声明了 `name` 的
 * Input / Select 自动成为表单项。提交（`submit: true` 的 Button）时：
 * 1. 统一校验已注册字段的 rules（required + message），失败则展示错误并阻止提交
 * 2. 校验通过把 values 写入 runtime state 的 `form` 路径（`${form.<field>}` 可用）
 * 3. 以 values 调用 onSubmit（Renderer 把它放入 `event` 作用域）
 */
export function Form({
  layout = 'vertical',
  children,
  onSubmit,
  onValuesChange,
}: FormProps) {
  const { context } = useRenderer();
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fieldRulesRef = useRef(new Map<string, FieldRule[] | undefined>());

  const formContext = useMemo<FormContextValue>(
    () => ({
      inForm: true,
      values,
      errors,
      setValue(name, value) {
        const next = { ...values, [name]: value };
        setValues(next);
        setErrors((prev) => {
          if (!(name in prev)) {
            return prev;
          }
          const rest = { ...prev };
          delete rest[name];
          return rest;
        });
        onValuesChange?.({ [name]: value }, next);
      },
      registerField(name, rules) {
        fieldRulesRef.current.set(name, rules);
      },
      unregisterField(name) {
        fieldRulesRef.current.delete(name);
      },
    }),
    [values, errors, onValuesChange],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    for (const [name, rules] of fieldRulesRef.current) {
      for (const rule of rules ?? []) {
        if (rule.required && isEmpty(values[name])) {
          nextErrors[name] = rule.message ?? '必填';
          break;
        }
      }
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    context.state.set('form', values);
    onSubmit?.(values);
  };

  return (
    <FormContextProvider value={formContext}>
      <FormRoot
        className={`pcr-form pcr-form-layout-${layout}`}
        onSubmit={handleSubmit}
      >
        {children}
      </FormRoot>
    </FormContextProvider>
  );
}
