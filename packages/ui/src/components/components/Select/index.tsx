import { useI18n } from '@pactor-app/runtime';
import { useEffect, useId, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select.js';
import { formItemClass, useFormContext } from '../Form/context.js';
import type { FieldRule } from '../Input/index.js';

/** Select 选项（支持表达式解析后的数组） */
export interface SelectOption {
  label: string;
  value: string | number | boolean;
  /** 单个选项禁用 */
  disabled?: boolean;
}

export interface SelectProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 选项列表 */
  options?: SelectOption[];
  /** 受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues） */
  value?: string | number | boolean;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  /** 选中变化事件，传出选中的 value */
  onChange?: (value: unknown) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器，独立渲染时为控件包裹） */
  className?: string;
  /** 控件本体 class（无论是否在 Form 内都挂控件包裹节点；独立渲染时与
   *  className 同点合并——Form 内需要精确设置控件样式（如宽度）时使用） */
  controlClassName?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

/**
 * Select 适配器（shadcn kit，语义对齐 antd 版）：
 * 基于 vendored shadcn Select（@base-ui/react）；Form 内声明 `name`
 * 自动成为表单项；onChange 传出选中的原始 value（Base UI Select 的
 * value 原生支持 string/number/boolean，无需序列化）。
 *
 * value→label 映射经 Root 的 `items` 提供：选中值对应的 item 尚未渲染过
 * popup 时（如表单初始值回填），Trigger 同样显示 label（对齐原 Radix 坑
 * 的对应场景，见 design D2/风险表）。
 */
export function Select({
  name,
  label,
  rules,
  options = [],
  value,
  placeholder,
  disabled,
  allowClear,
  onChange,
  className,
  controlClassName,
  style,
}: SelectProps) {
  const form = useFormContext();
  const { t } = useI18n();
  const controlId = useId();
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';

  // 注册字段校验规则，同时把 value prop 作为字段级初始值交给 Form 上下文合并
  useEffect(() => {
    if (inForm && form && name) {
      form.registerField(name, rules, value);
      return () => form.unregisterField(name);
    }
    return undefined;
  });

  const current = inForm && form && name ? form.values[name] : value;
  const selectedValue =
    current === undefined || current === null || current === ''
      ? null
      : (current as SelectOption['value']);

  const handleChange = (next: SelectOption['value'] | null) => {
    if (inForm && form && name) {
      form.setValue(name, next ?? undefined);
    }
    onChange?.(next ?? undefined);
  };

  const inFormRoot = inForm === true;
  const select = (
    <span
      className={cn(
        // Form / Field（Form 上下文）内控件占满整行宽度；独立渲染保持内容自然宽度
        inFormRoot
          ? 'flex w-full items-center gap-1'
          : 'inline-flex items-center gap-1',
        !inFormRoot && className,
        controlClassName,
      )}
      style={inFormRoot ? undefined : style}
    >
      <ShadcnSelect<SelectOption['value']>
        items={options}
        value={selectedValue}
        onValueChange={handleChange}
        disabled={disabled}
        name={inForm ? name : undefined}
      >
        <SelectTrigger id={controlId} className={inFormRoot ? 'w-full' : undefined}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={String(option.value)}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </ShadcnSelect>
      {allowClear && selectedValue !== null && !disabled ? (
        <button
          type="button"
          aria-label={t('pactor.select.clear')}
          className="cursor-pointer text-muted-foreground hover:text-foreground"
          onClick={() => {
            if (inForm && form && name) {
              form.setValue(name, undefined);
            }
            onChange?.(undefined);
          }}
        >
          ×
        </button>
      ) : null}
    </span>
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
        {select}
        {error ? (
          <div data-slot="form-error" className="text-sm text-destructive">
            {error}
          </div>
        ) : null}
      </div>
    );
  }

  return select;
}
