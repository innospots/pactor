import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';
import { formItemClass, type FormContextValue } from './context.js';

export interface FieldShellProps {
  layout: FormContextValue['layout'];
  /** 表单项标签 */
  label?: string;
  /** 标签关联的控件 id（label htmlFor）；控件不可标注时省略 */
  htmlFor?: string;
  /** 校验错误文案 */
  error?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * 表单项外壳（shadcn kit 各表单适配器共用，结构对齐 Input/Select）：
 * `<div data-slot="form-item">` + 可选 label（htmlFor 关联）+ 控件 + 错误。
 */
export function FieldShell({
  layout,
  label,
  htmlFor,
  error,
  className,
  style,
  children,
}: FieldShellProps) {
  return (
    <div
      data-slot="form-item"
      className={cn(formItemClass(layout), className)}
      style={style}
    >
      {label ? (
        <label
          htmlFor={htmlFor}
          className="shrink-0 text-sm leading-none font-medium whitespace-nowrap"
        >
          {label}
        </label>
      ) : null}
      {children}
      {error ? (
        <div data-slot="form-error" className="text-sm text-destructive">
          {error}
        </div>
      ) : null}
    </div>
  );
}
