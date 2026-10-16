import { useContext, type CSSProperties, type ReactNode } from "react";

import { cn } from "../../../lib/utils.js";
import { Field as ShadcnField } from "../../../ui/field.js";
import { FieldNestContext } from "../Field/index.js";
import { formItemClass, type FormContextValue } from "./context.js";
import type { FieldRule } from "../Input/index.js";

export interface FieldShellProps {
  layout: FormContextValue["layout"];
  /** 表单项标签 */
  label?: string;
  /** 标签关联的控件 id（label htmlFor）；控件不可标注时省略 */
  htmlFor?: string;
  /** 校验规则（含 required 时 label 前自动渲染必填星号，对齐 Field 的 required 语义） */
  rules?: FieldRule[];
  /** 校验错误文案 */
  error?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * 表单项外壳（shadcn kit 各表单适配器共用）：Form 内的控件自动嵌套
 * Field——根节点为 Base UI Field Root（保留 data-slot="form-item" 兼容），
 * label（htmlFor 关联；rules 含 required 时自动加必填星号）+ 控件 + 错误。
 * 需要 description / labelHint / 按钮组间距等完整 Field 能力时，DSL 仍
 * 可显式声明 Field 组件手动包裹。
 */
export function FieldShell({
  layout,
  label,
  htmlFor,
  rules,
  error,
  className,
  style,
  children,
}: FieldShellProps) {
  const required = rules?.some((rule) => rule.required) === true;
  // 已在手动 Field 内：间距由外层 Field 承担，自身只保留结构（避免
  // mb-2 / min-h-9 叠加）
  const inField = useContext(FieldNestContext);
  return (
    <ShadcnField
      data-slot="form-item"
      className={cn(
        // ShadcnField 基础为 flex-col：horizontal / inline 需显式回正为行向
        layout !== "vertical" && "flex-row",
        inField
          ? layout === "vertical"
            ? "flex flex-col gap-2"
            : "flex items-center gap-2"
          : formItemClass(layout),
        className,
      )}
      style={style}
    >
      {label ? (
        // 星号为 label 的同级 aria-hidden 兄弟（而非伪元素 / label 子节点）：
        // 不占 label 文本内容与可访问名，视觉仍在 label 前
        <span className="flex items-center">
          {required ? (
            <span aria-hidden className="mr-0.5 text-destructive">
              *
            </span>
          ) : null}
          <label
            htmlFor={htmlFor}
            className="shrink-0 text-sm leading-none font-medium whitespace-nowrap"
          >
            {label}
          </label>
        </span>
      ) : null}
      {children}
      {error ? (
        <div data-slot="form-error" className="text-sm text-destructive">
          {error}
        </div>
      ) : null}
    </ShadcnField>
  );
}
