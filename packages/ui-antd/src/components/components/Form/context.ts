import { createContext, useContext } from 'react';
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
