import { useEffect, useId, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Switch as ShadcnSwitch } from '../../../ui/switch.js';
import { useFormContext } from '../Form/context.js';
import type { FieldRule } from '../Input/index.js';

export interface SwitchProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 开关旁的标签文本 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues） */
  value?: boolean;
  disabled?: boolean;
  /** 开关变化事件，传出 boolean */
  onChange?: (checked: boolean) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器，独立渲染时为控件包裹） */
  className?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

/**
 * Switch 适配器（shadcn kit）：基于 vendored Switch（Base UI）；
 * onChange 传出 boolean（DSL 语义值，非 DOM 事件）。
 */
export function Switch({
  name,
  label,
  rules,
  value,
  disabled,
  onChange,
  className,
  style,
}: SwitchProps) {
  const form = useFormContext();
  const controlId = useId();
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';

  useEffect(() => {
    if (inForm && form && name) {
      form.registerField(name, rules, value);
      return () => form.unregisterField(name);
    }
    return undefined;
  });

  const current = inForm && form && name ? form.values[name] : value;
  const checked = current === true;

  const handleChange = (next: boolean) => {
    if (inForm && form && name) {
      form.setValue(name, next);
    }
    onChange?.(next);
  };

  const control = (
    <span
      className={cn('inline-flex items-center gap-2', !inForm && className)}
      style={inForm ? undefined : style}
    >
      <ShadcnSwitch
        id={controlId}
        checked={checked}
        disabled={disabled}
        name={inForm ? name : undefined}
        onCheckedChange={handleChange}
      />
      {label ? (
        <label htmlFor={controlId} className="text-sm leading-none font-medium">
          {label}
        </label>
      ) : null}
    </span>
  );

  if (inForm && form && name) {
    return (
      <div
        data-slot="form-item"
        className={cn('mb-4', className)}
        style={style}
      >
        {control}
        {form.errors[name] ? (
          <div data-slot="form-error" className="mt-1.5 text-sm text-destructive">
            {form.errors[name]}
          </div>
        ) : null}
      </div>
    );
  }

  return control;
}
