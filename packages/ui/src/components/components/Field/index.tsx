import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';
import {
  Field as ShadcnField,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '../../../ui/field.js';

export interface FieldProps {
  /** 表单项标签 */
  label?: string;
  /** 必填标记（label 前渲染红色 `*`；仅视觉标记，校验仍由 Form rules 承担） */
  required?: boolean;
  /** 辅助说明文案 */
  description?: string;
  /** 错误文案（声明式展示，如校验失败信息） */
  error?: string;
  /** 控件 DSL 子树（经 Renderer children 机制渲染） */
  children?: ReactNode;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  /** label 节点 class / style（必填星号随 label 节点） */
  labelClassName?: string;
  labelStyle?: CSSProperties;
  /** 控件容器（label 下方）class / style；缺省有 label 时容器自带 mt-2 */
  controlClassName?: string;
  controlStyle?: CSSProperties;
  /** 辅助说明节点 class / style */
  descriptionClassName?: string;
  descriptionStyle?: CSSProperties;
  /** 错误节点 class / style */
  errorClassName?: string;
  errorStyle?: CSSProperties;
}

/**
 * Field 适配器（shadcn kit）：通用表单项容器（Base UI Field 封装，
 * 上下结构：label 在上、控件容器在下）；label / description / error 为
 * 框架级 props，error 声明式强制展示；`required` 在 label 前渲染必填星号
 * （对齐 antd Form.Item required 语义）；label 与控件容器之间默认 mt-2，
 * 四个节点（label / 控件容器 / description / error）均可独立加样式。
 */
export function Field({
  label,
  required,
  description,
  error,
  children,
  className,
  style,
  labelClassName,
  labelStyle,
  controlClassName,
  controlStyle,
  descriptionClassName,
  descriptionStyle,
  errorClassName,
  errorStyle,
}: FieldProps) {
  return (
    <ShadcnField className={className} style={style}>
      {label ? (
        <FieldLabel className={labelClassName} style={labelStyle}>
          {required ? (
            <span aria-hidden className="text-destructive">
              *{' '}
            </span>
          ) : null}
          {label}
        </FieldLabel>
      ) : null}
      <div
        data-slot="field-control"
        className={cn(label ? 'mt-2' : undefined, controlClassName)}
        style={controlStyle}
      >
        {children}
      </div>
      {description ? (
        <FieldDescription
          className={descriptionClassName}
          style={descriptionStyle}
        >
          {description}
        </FieldDescription>
      ) : null}
      {error ? (
        <FieldError match className={errorClassName} style={errorStyle}>
          {error}
        </FieldError>
      ) : null}
    </ShadcnField>
  );
}
