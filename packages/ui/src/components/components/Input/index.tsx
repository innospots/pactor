import { useI18n } from '@pactor-app/runtime';
import { useEffect, useId, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Input as ShadcnInput } from '../../../ui/input.js';
import { formItemClass, useFormContext } from '../Form/context.js';

/** DSL 校验规则（框架级协议，当前支持 required + message） */
export interface FieldRule {
  required?: boolean;
  message?: string;
}

export interface InputProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues） */
  value?: string;
  /** 输入类型：password 时掩码输入（缺省 text） */
  type?: 'text' | 'password';
  placeholder?: string;
  disabled?: boolean;
  /** 值为非空时显示清除按钮，点击清空当前值；开启后独立渲染的
   *  className/style 挂控件包裹节点（含清除按钮），未开启时保持挂控件本身 */
  allowClear?: boolean;
  /** 输入事件，传出 string 值（非原生 event，设计决策 D2） */
  onChange?: (value: string) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器，独立渲染时为控件本身） */
  className?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

/**
 * Input 适配器（shadcn kit，语义对齐 antd 版）：
 * 在 Form 内且声明 `name` 时自动成为表单项（label / rules 生效，
 * 值由 Form 上下文托管）；否则渲染独立受控控件，onChange 传出 string。
 * 表单项为去原语化结构（design D3）：`<div data-slot="form-item">` +
 * `<label htmlFor>` 与控件 `useId` 关联。
 */
export function Input({
  name,
  label,
  rules,
  value,
  type = 'text',
  placeholder,
  disabled,
  allowClear,
  onChange,
  className,
  style,
}: InputProps) {
  const form = useFormContext();
  const { t } = useI18n();
  const controlId = useId();
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';

  // 注册/注销字段校验规则（rules 每次渲染刷新，卸载时注销）；
  // 同时把 value prop 作为字段级初始值交给 Form 上下文合并（仅首次注册生效）
  useEffect(() => {
    if (inForm && form && name) {
      form.registerField(name, rules, value);
      return () => form.unregisterField(name);
    }
    return undefined;
  });

  const fieldValue = inForm && form && name ? form.values[name] : undefined;
  const currentValue =
    typeof fieldValue === 'string' ? fieldValue : inForm ? '' : (value ?? '');
  const showClear = allowClear === true && disabled !== true && currentValue !== '';

  const handleClear = () => {
    if (inForm && form && name) {
      form.setValue(name, '');
    }
    onChange?.('');
  };

  const inFormRoot = inForm === true;
  const input = (
    <ShadcnInput
      id={controlId}
      type={type}
      value={currentValue}
      placeholder={placeholder}
      disabled={disabled}
      className={!inFormRoot && allowClear !== true ? className : undefined}
      style={!inFormRoot && allowClear !== true ? style : undefined}
      onChange={(event) => {
        if (inForm && form && name) {
          form.setValue(name, event.target.value);
        }
        onChange?.(event.target.value);
      }}
    />
  );
  const clearButton = showClear ? (
    <button
      type="button"
      aria-label={t('pactor.input.clear')}
      className="shrink-0 cursor-pointer text-muted-foreground hover:text-foreground"
      onClick={handleClear}
    >
      ×
    </button>
  ) : null;
  // allowClear 需要包裹节点承载清除按钮；未开启时保持裸控件（className/style 挂 input 本身）
  const control =
    allowClear === true ? (
      <span
        className={cn('flex items-center gap-1', !inFormRoot && className)}
        style={inFormRoot ? undefined : style}
      >
        {input}
        {clearButton}
      </span>
    ) : (
      input
    );

  if (inForm && form && name) {
    const error = form.errors[name];
    return (
      <div
        data-slot="form-item"
        className={cn(formItemClass(form.layout), className)}
        style={style}
      >
        {label ? (
          <label
            htmlFor={controlId}
            className="shrink-0 text-sm leading-none font-medium whitespace-nowrap"
          >
            {label}
          </label>
        ) : null}
        {control}
        {error ? (
          <div data-slot="form-error" className="text-sm text-destructive">
            {error}
          </div>
        ) : null}
      </div>
    );
  }

  return control;
}
