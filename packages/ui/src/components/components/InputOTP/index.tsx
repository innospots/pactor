import { useEffect, useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import {
  InputOTP as ShadcnInputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '../../../ui/input-otp.js';
import { formItemClass, useFormContext } from '../Form/context.js';
import type { FieldRule } from '../Input/index.js';

export interface InputOTPProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** OTP 位数（缺省 6） */
  length?: number;
  /** 受控值（独立渲染时生效）；Form 内作为字段初始值 */
  value?: string;
  disabled?: boolean;
  /** 输入事件，传出当前字符串 */
  onChange?: (value: string) => void;
  /** 输入满 length 位时触发，传出完整 OTP 字符串 */
  onComplete?: (value: string) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器） */
  className?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

/**
 * InputOTP 适配器（shadcn kit）：基于 vendored InputOTP（input-otp）；
 * onChange 传出当前字符串、onComplete 传出完整 OTP（DSL 语义值）；
 * Form 内声明 `name` 自动成为表单项。独立渲染时内部维护输入态
 * （value prop 作为初始值/受控镜像）。
 */
export function InputOTP({
  name,
  label,
  rules,
  length = 6,
  value,
  disabled,
  onChange,
  onComplete,
  className,
  style,
}: InputOTPProps) {
  const form = useFormContext();
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';

  useEffect(() => {
    if (inForm && form && name) {
      form.registerField(name, rules, value);
      return () => form.unregisterField(name);
    }
    return undefined;
  });

  // 独立渲染：内部输入态（外部 value 变化时同步）
  const [innerValue, setInnerValue] = useState(typeof value === 'string' ? value : '');
  useEffect(() => {
    if (!inForm) setInnerValue(typeof value === 'string' ? value : '');
  }, [inForm, value]);

  const current =
    inForm && form && name
      ? typeof form.values[name] === 'string'
        ? (form.values[name] as string)
        : ''
      : innerValue;

  const handleChange = (next: string) => {
    if (inForm && form && name) {
      form.setValue(name, next);
    } else {
      setInnerValue(next);
    }
    onChange?.(next);
    if (next.length === length) {
      onComplete?.(next);
    }
  };

  const control = (
    <ShadcnInputOTP
      maxLength={length}
      value={current}
      onChange={handleChange}
      disabled={disabled}
    >
      <InputOTPGroup>
        {Array.from({ length }, (_, index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </ShadcnInputOTP>
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
          <label className="shrink-0 text-sm leading-none font-medium whitespace-nowrap">
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

  return (
    <div data-slot="input-otp-field" className={cn('inline-block', className)} style={style}>
      {control}
    </div>
  );
}
