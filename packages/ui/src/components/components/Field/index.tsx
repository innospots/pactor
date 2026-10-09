import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';
import {
  Field as ShadcnField,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '../../../ui/field.js';
import { useFormContext } from '../Form/context.js';

export interface FieldProps {
  /** 表单项标签 */
  label?: string;
  /** 必填标记（label 前渲染红色 `*`；仅视觉标记，校验仍由 Form rules 承担） */
  required?: boolean;
  /** label 行右侧的提示文字（如「创建后不可修改」），右对齐小字弱化展示 */
  labelHint?: string;
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
  /** label 行右侧提示节点 class / style */
  labelHintClassName?: string;
  labelHintStyle?: CSSProperties;
  /** 控件容器（label 下方）class / style（label 与控件间距由 Field 容器 gap 承担） */
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
 * 上下结构：label 在上、控件容器在下）；label / labelHint / description /
 * error 为框架级 props，error 声明式强制展示；`required` 在 label 前渲染
 * 必填星号（对齐 antd Form.Item required 语义）；`labelHint` 与 label 同行
 * 右对齐（弱化为小字）；label 与控件容器间距由 Field 容器 flex-col gap-2
 * 承担，五个节点（label / labelHint / 控件容器 / description / error）
 * 均可独立加样式。控件容器为相邻的直接子按钮自动加间距
 * （`[&>button+button]:ml-2`，如同一 Field 放查询/重置）。
 * 处于 layout=vertical 的 Form 内时根节点自动加 mb-2
 * （表单项纵向间距）；处于 layout=inline 的 Form 内时 label 与控件同一行
 * （覆盖默认上下结构）；horizontal 布局或 Form 外不加。
 */
export function Field({
  label,
  required,
  labelHint,
  description,
  error,
  children,
  className,
  style,
  labelClassName,
  labelStyle,
  labelHintClassName,
  labelHintStyle,
  controlClassName,
  controlStyle,
  descriptionClassName,
  descriptionStyle,
  errorClassName,
  errorStyle,
}: FieldProps) {
  const form = useFormContext();
  const inline = form?.layout === 'inline';
  return (
    <ShadcnField
      className={cn(
        form?.layout === 'vertical' && 'mb-2',
        // inline Form：label 与控件同一行（覆盖默认 flex-col）
        inline && 'flex-row items-center',
        className,
      )}
      style={style}
    >
      {label || labelHint ? (
        <div
          className={cn(
            'flex min-h-3.5 items-center gap-2',
            inline ? 'shrink-0' : 'w-full justify-between',
          )}
        >
          {label ? (
            <FieldLabel className={labelClassName} style={labelStyle}>
              {required ? (
                <span aria-hidden className="text-destructive">
                  *{' '}
                </span>
              ) : null}
              {label}
            </FieldLabel>
          ) : (
            <span />
          )}
          {labelHint ? (
            <span
              data-slot="field-label-hint"
              className={cn(
                'shrink-0 text-xs leading-none text-muted-foreground',
                labelHintClassName,
              )}
              style={labelHintStyle}
            >
              {labelHint}
            </span>
          ) : null}
        </div>
      ) : null}
      <div
        data-slot="field-control"
        className={cn('[&>button+button]:ml-2', controlClassName)}
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
