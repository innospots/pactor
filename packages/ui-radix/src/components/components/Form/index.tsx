import { Root as FormRoot } from '@radix-ui/react-form';
import type { FieldRule, FormProps } from 'pactor-ui-antd/components';
import { useRenderer } from 'pactor-runtime';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { FormContextProvider, type FormContextValue } from './context.js';

function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || value === '';
}

/**
 * Form 容器（Radix kit，语义对齐 antd 版）：
 * 维护受控 values 并经 React Context 下发，Form 内声明了 `name` 的
 * Input / Select 自动成为表单项。创建时以 `initialValues` 初始化 values，
 * 字段挂载注册时合并字段级 `value` 初始值（字段级优先，仅首次注册写入）。
 * 提交（`submit: true` 的 Button）时：
 * 1. 统一校验已注册字段的 rules（required + message），失败则展示错误并阻止提交
 * 2. 校验通过把 values 写入 runtime state 的 `form` 路径（`${form.<field>}` 可用）
 * 3. 以 values 调用 onSubmit（Renderer 把它放入 `event` 作用域）
 */
export function Form({
  name = 'default',
  layout = 'vertical',
  initialValues,
  children,
  onSubmit,
  onValuesChange,
}: FormProps) {
  const { context } = useRenderer();
  const [values, setValues] = useState<Record<string, unknown>>(() => ({
    ...initialValues,
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fieldRulesRef = useRef(new Map<string, FieldRule[] | undefined>());
  // 已合并字段级初始值的字段集合：useEffect 无依赖导致每次渲染重注册，
  // 以 ref 记录保证初始值只写入一次（不清除，否则每次渲染都会重写覆盖用户输入）
  const mergedInitialFieldsRef = useRef(new Set<string>());

  // 批量写入（form.setValues 联动桥）：函数式 setState 保持稳定引用，
  // 不触发 onValuesChange、不动 errors（语义对齐 antd setFieldsValue）
  const setValuesBatch = useCallback((partial: Record<string, unknown>) => {
    setValues((prev) => ({ ...prev, ...partial }));
  }, []);

  // 表单联动桥：挂载注册句柄、卸载注销
  useEffect(() => {
    context.forms.register(name, { setValues: setValuesBatch });
    return () => {
      context.forms.unregister(name);
    };
  }, [context, name, setValuesBatch]);

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
      setValues: setValuesBatch,
      registerField(name, rules, initialValue) {
        fieldRulesRef.current.set(name, rules);
        // 字段级初始值：仅首次注册时写入（字段级优先于 initialValues）
        if (
          initialValue !== undefined &&
          !mergedInitialFieldsRef.current.has(name)
        ) {
          mergedInitialFieldsRef.current.add(name);
          setValues((prev) => ({ ...prev, [name]: initialValue }));
        }
      },
      unregisterField(name) {
        fieldRulesRef.current.delete(name);
      },
    }),
    [values, errors, onValuesChange, setValuesBatch],
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
