import { createContext, useContext } from 'react';
import type { FieldRule } from 'pactor-ui-antd/components';

/**
 * Form 容器上下文（Radix kit）：Form 组件维护受控 values / 校验错误
 * 并经 React Context 下发；Input / Select 据此判断自身是否在表单内。
 * 与 antd 版不同：不持有 UI 库表单实例，values 由框架侧受控管理
 *（Radix Form 校验模型与 antd 不同，对齐到 spec 级语义）。
 */
export interface FormContextValue {
  /** 标记后代字段处于 Form 容器内 */
  inForm: true;
  /** 当前表单 values（受控） */
  values: Record<string, unknown>;
  /** 校验错误（字段名 → 错误文案） */
  errors: Record<string, string>;
  /** 更新字段值（受控写入并清除该字段错误） */
  setValue(name: string, value: unknown): void;
  /** 批量写入字段值（form.setValues 联动桥）：不触发 onValuesChange 与校验 */
  setValues(values: Record<string, unknown>): void;
  /**
   * 注册字段校验规则（提交时统一校验）；
   * `initialValue` 为字段级初始值（value prop），仅在该字段首次注册时合并
   * 进 values（字段级优先于 Form initialValues；已有合并结果不覆盖）
   */
  registerField(name: string, rules?: FieldRule[], initialValue?: unknown): void;
  /** 注销字段 */
  unregisterField(name: string): void;
}

const FormReactContext = createContext<FormContextValue | null>(null);

export const FormContextProvider = FormReactContext.Provider;

/** 在字段组件内探测 Form 上下文；不在 Form 内时返回 null */
export function useFormContext(): FormContextValue | null {
  return useContext(FormReactContext);
}
