import { useRenderer } from '@pactor/runtime';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { cn } from '../../../lib/utils.js';
import type { FieldRule } from '../Input/index.js';
import { FormContextProvider, type FormContextValue } from './context.js';

export interface FormProps {
  /** 表单名（缺省 'default'）：`form.setValues` 联动动作按名寻址 */
  name?: string;
  /** 表单布局，默认 vertical */
  layout?: 'horizontal' | 'vertical' | 'inline';
  /** 表单初始值（创建时生效；字段级 value 优先于 initialValues[name]） */
  initialValues?: Record<string, unknown>;
  children?: ReactNode;
  /** 提交事件（校验通过后触发），参数为表单 values */
  onSubmit?: (values: Record<string, unknown>) => void;
  /** 任一字段变化事件（可选） */
  onValuesChange?: (
    changed: Record<string, unknown>,
    values: Record<string, unknown>,
  ) => void;
}

function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || value === '';
}

/**
 * Form 容器（shadcn kit，语义对齐 antd 版）：
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
      layout,
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
    [layout, values, errors, onValuesChange, setValuesBatch],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    for (const [name, rules] of fieldRulesRef.current) {
      for (const rule of rules ?? []) {
        if (rule.required && isEmpty(values[name])) {
          nextErrors[name] =
            rule.message ?? context.i18n.t('pactor.form.required');
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
      <form
        data-slot="form"
        className={cn(layout === 'inline' && 'flex flex-wrap items-center gap-3')}
        onSubmit={handleSubmit}
      >
        {children}
      </form>
    </FormContextProvider>
  );
}
