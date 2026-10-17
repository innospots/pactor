import { useI18n } from '@pactor-app/runtime';
import { useEffect, useId, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Input as ShadcnInput } from '../../../ui/input.js';
import { ClearHoverButton } from '../../clearable.js';
import { CONTROL_SIZE_BOX, type ControlSize } from '../../control-size.js';
import { useFormContext } from '../Form/context.js';
import { FieldShell } from '../Form/form-item.js';

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
  /** 控件尺寸（默认 middle，即现行 h-9 尺寸；全局统一尺寸令牌见 control-size） */
  size?: ControlSize;
  /** hover 清除（缺省开启，传 false 关闭）：值为非空时鼠标悬停控件，右缘浮出
   *  × 按钮（覆盖在控件内侧），点击清空当前值；独立渲染的 className/style
   *  挂控件包裹节点，关闭时保持挂控件本身 */
  allowClear?: boolean;
  /** 输入事件，传出 string 值（非原生 event，设计决策 D2） */
  onChange?: (value: string) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器；独立渲染时挂控件包裹节点——
   *  allowClear 缺省开启、包裹节点常态存在；仅 allowClear: false 时挂 input 本身） */
  className?: string;
  /** 控件本体 class（无论是否在 Form 内都挂 input 节点；Form 内需要精确
   *  设置控件样式（如宽度）时使用） */
  controlClassName?: string;
  /** 通用：根节点内联样式（挂载规则同 className） */
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
  size = 'middle',
  allowClear,
  onChange,
  className,
  controlClassName,
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
  const showClear = allowClear !== false && disabled !== true && currentValue !== '';

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
      placeholder={placeholder ?? t('pactor.input.placeholder')}
      disabled={disabled}
      className={cn(
        CONTROL_SIZE_BOX[size],
        // 清除按钮悬浮覆盖在控件右缘内侧，文本预留右内边距避免被遮挡
        allowClear !== false && 'pr-8',
        controlClassName,
      )}
      onChange={(event) => {
        if (inForm && form && name) {
          form.setValue(name, event.target.value);
        }
        onChange?.(event.target.value);
      }}
    />
  );
  const clearButton = showClear ? (
    <ClearHoverButton
      label={t('pactor.input.clear')}
      className="absolute top-1/2 right-2 -translate-y-1/2"
      onClear={handleClear}
    />
  ) : null;
  // allowClear 缺省开启，输入框常态带包裹节点（group + relative）承载悬浮
  // 清除按钮（避免输入过程中值由空变有时结构切换导致输入框重建失焦）；
  // 显式关闭（false）时保持裸控件（className/style 挂 input 本身）
  const control =
    allowClear !== false ? (
      <span
        className={cn('group relative flex items-center', !inFormRoot && className)}
        style={inFormRoot ? undefined : style}
      >
        {input}
        {clearButton}
      </span>
    ) : (
      input
    );

  if (inForm && form && name) {
    return (
      <FieldShell
        layout={form.layout}
        label={label}
        htmlFor={controlId}
        rules={rules}
        error={form.errors[name]}
        className={className}
        style={style}
      >
        {control}
      </FieldShell>
    );
  }

  return control;
}
