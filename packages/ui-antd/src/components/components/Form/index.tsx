import { Form as AntForm } from 'antd';
import { useRenderer } from 'pactor-runtime';
import type { ReactNode } from 'react';

import { FormContextProvider } from './context.js';

export interface FormProps {
  /** antd 表单布局，默认 vertical */
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

/**
 * Form 容器（设计决策 D3）：
 * 创建 antd Form 实例并经 React Context 下发，Form 内声明了 `name` 的
 * Input / Select 自动成为表单项。校验通过（onFinish）时：
 * 1. 把 values 写入 runtime state 的 `form` 路径（`${form.<field>}` 可用）
 * 2. 以 values 调用 onSubmit（Renderer 把它放入 `event` 作用域）
 */
export function Form({
  layout = 'vertical',
  initialValues,
  children,
  onSubmit,
  onValuesChange,
}: FormProps) {
  const { context } = useRenderer();
  const [form] = AntForm.useForm();

  const handleFinish = (values: Record<string, unknown>) => {
    context.state.set('form', values);
    onSubmit?.(values);
  };

  return (
    <FormContextProvider value={{ form, inForm: true }}>
      <AntForm
        form={form}
        layout={layout}
        initialValues={initialValues}
        onFinish={handleFinish}
        onValuesChange={(changed, values) => onValuesChange?.(changed, values)}
      >
        {children}
      </AntForm>
    </FormContextProvider>
  );
}
