import type { FieldRule } from '../Input/index.js';
import { createContext, useContext } from 'react';

/**
 * Form 容器上下文（shadcn kit）：Form 组件维护受控 values / 校验错误
 * 并经 React Context 下发；Input / Select 据此判断自身是否在表单内。
 * 不持有 UI 库表单实例，values 由框架侧受控管理（去原语化，见 design D3）。
 */
export interface FormContextValue {
  /** 标记后代字段处于 Form 容器内 */
  inForm: true;
  /** 表单布局（表单项排布 class 由字段侧按此生成） */
  layout: 'horizontal' | 'vertical' | 'inline';
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

/** 表单项排布 class（按 Form layout 生成；label/控件/错误的间距由 gap 承担；
 *  统一 min-h-9（36px）并垂直居中，无 label 行的项（如裸按钮）与有 label 的
 *  项在行内保持同高同基线） */
export function formItemClass(layout: FormContextValue['layout']): string {
  switch (layout) {
    case 'horizontal':
      return 'mb-2 flex min-h-9 items-center gap-2';
    case 'inline':
      return 'flex min-h-9 items-center gap-2';
    default:
      return 'mb-2 flex min-h-9 flex-col justify-center gap-1.5';
  }
}
