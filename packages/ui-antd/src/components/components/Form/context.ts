import { createContext, useContext, useEffect, useRef } from 'react';
import type { FormInstance } from 'antd';

/**
 * Form 容器上下文（设计决策 D3）：Form 组件创建 antd Form 实例后
 * 经 React Context 下发；Input / Select 据此判断自身是否在表单内。
 */
export interface FormContextValue {
  /** antd Form 实例 */
  form: FormInstance;
  /** 标记后代字段处于 Form 容器内 */
  inForm: true;
}

const FormReactContext = createContext<FormContextValue | null>(null);

export const FormContextProvider = FormReactContext.Provider;

/** 在字段组件内探测 Form 上下文；不在 Form 内时返回 null */
export function useFormContext(): FormContextValue | null {
  return useContext(FormReactContext);
}

/**
 * 字段级初始值（value prop）合并：antd 约定 Form 的 initialValues 优先于
 * Form.Item 的 initialValue，与 DSL 契约"字段级优先"相反；故字段挂载时
 * 以 setFieldValue 强制写入一次（仅创建时生效，不触发 onValuesChange）
 */
export function useFieldInitialValue(
  formContext: FormContextValue | null,
  name: string | undefined,
  value: unknown,
): void {
  const appliedRef = useRef(false);
  useEffect(() => {
    if (
      !appliedRef.current &&
      formContext?.inForm &&
      name &&
      value !== undefined
    ) {
      appliedRef.current = true;
      formContext.form.setFieldValue(name, value);
    }
  });
}
