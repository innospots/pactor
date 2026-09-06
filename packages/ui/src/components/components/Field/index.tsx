import type { CSSProperties, ReactNode } from 'react';

import {
  Field as ShadcnField,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '../../../ui/field.js';

export interface FieldProps {
  /** 表单项标签 */
  label?: string;
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
}

/**
 * Field 适配器（shadcn kit）：通用表单项容器（Base UI Field 封装）；
 * label / description / error 为框架级 props，error 声明式强制展示。
 */
export function Field({ label, description, error, children, className, style }: FieldProps) {
  return (
    <ShadcnField className={className} style={style}>
      {label ? <FieldLabel>{label}</FieldLabel> : null}
      {children}
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {error ? <FieldError match>{error}</FieldError> : null}
    </ShadcnField>
  );
}
