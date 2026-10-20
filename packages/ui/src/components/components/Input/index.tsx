import { useI18n } from '@pactor-app/runtime';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useId, useState, type CSSProperties } from 'react';

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
  /** 输入类型：password 时掩码输入（缺省 text）；有值时右缘浮出眼睛按钮
   *  切换明文 / 掩码，清除按钮相应左移 */
  type?: 'text' | 'password';
  placeholder?: string;
  disabled?: boolean;
  /** 最大输入长度（原生 maxLength，达到上限后无法继续输入） */
  maxLength?: number;
  /** 控件尺寸（默认 middle，即现行 h-9 尺寸；全局统一尺寸令牌见 control-size） */
  size?: ControlSize;
  /** hover 清除（缺省开启，传 false 关闭）：值为非空时鼠标悬停控件，右缘浮出
   *  × 按钮（覆盖在控件内侧），点击清空当前值；独立渲染的 className/style
   *  挂控件包裹节点，关闭时保持挂控件本身 */
  allowClear?: boolean;
  /** 输入事件，传出 string 值（非原生 event，设计决策 D2） */
  onChange?: (value: string) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器；独立渲染时挂控件包裹节点——
   *  allowClear 缺省开启或 password 类型时包裹节点常态存在；仅 allowClear: false
   *  且非 password 时挂 input 本身） */
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
  maxLength,
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
  const [passwordVisible, setPasswordVisible] = useState(false);
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

  // 密码有值时右缘提供明文 / 掩码切换；值被清空后复位为掩码，
  // 避免再次输入时沿用上一次的明文状态
  useEffect(() => {
    if (currentValue === '') setPasswordVisible(false);
  }, [currentValue]);
  const showPasswordToggle =
    type === 'password' && disabled !== true && currentValue !== '';
  const inputType = type === 'password' && passwordVisible ? 'text' : type;

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
      type={inputType}
      value={currentValue}
      placeholder={placeholder ?? t('pactor.input.placeholder')}
      disabled={disabled}
      maxLength={maxLength}
      className={cn(
        CONTROL_SIZE_BOX[size],
        // 右缘浮动按钮（× / 眼睛）覆盖在控件内侧，文本预留右内边距避免被遮挡；
        // 密码有值时两枚按钮并排，清除左移，文本再加一档内边距。
        // 加 !important：聚合样式（pactor-app/styles.css）多段拼接，后段重复的
        // px-3（padding-inline）会盖掉前段的 pr-*，必须提高声明优先级
        (allowClear !== false || showPasswordToggle) && 'pr-8!',
        allowClear !== false && showPasswordToggle && 'pr-14!',
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
      className={cn(
        'absolute top-1/2 -translate-y-1/2',
        // 眼睛按钮占据最右缘，清除按钮左移避让
        showPasswordToggle ? 'right-8' : 'right-2',
      )}
      onClear={handleClear}
    />
  ) : null;
  const passwordButton = showPasswordToggle ? (
    <button
      type="button"
      data-slot="input-password-toggle"
      aria-label={t(
        passwordVisible
          ? 'pactor.input.hidePassword'
          : 'pactor.input.showPassword',
      )}
      aria-pressed={passwordVisible}
      className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
      onMouseDown={(event) => {
        // 保持输入框焦点，点击后继续输入不丢焦点
        event.preventDefault();
      }}
      onClick={() => setPasswordVisible((visible) => !visible)}
    >
      {passwordVisible ? (
        <EyeOff className="size-4" aria-hidden="true" />
      ) : (
        <Eye className="size-4" aria-hidden="true" />
      )}
    </button>
  ) : null;
  // allowClear 缺省开启或 password 类型时，输入框常态带包裹节点（group + relative）
  // 承载悬浮按钮（避免输入过程中值由空变有时结构切换导致输入框重建失焦）；
  // 其余情况保持裸控件（className/style 挂 input 本身）
  const control =
    allowClear !== false || type === 'password' ? (
      <span
        className={cn('group relative flex items-center', !inFormRoot && className)}
        style={inFormRoot ? undefined : style}
      >
        {input}
        {clearButton}
        {passwordButton}
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
