import { format, isValid, parseISO } from 'date-fns';
import { useEffect, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Calendar as ShadcnCalendar } from '../../../ui/calendar.js';
import { formItemClass, useFormContext } from '../Form/context.js';
import type { FieldRule } from '../Input/index.js';

export interface CalendarProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 选择模式（当前仅支持 single） */
  mode?: 'single';
  /** 受控值（ISO 日期字符串 yyyy-MM-dd）；Form 内作为字段初始值 */
  value?: string;
  disabled?: boolean;
  /** 选中日期事件，传出 ISO 日期字符串（yyyy-MM-dd），清除传 undefined */
  onChange?: (value: string | undefined) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器） */
  className?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

/** ISO 字符串 → Date（非法输入返回 undefined） */
function parseValue(value: unknown): Date | undefined {
  if (typeof value !== 'string' || value === '') return undefined;
  const date = parseISO(value);
  return isValid(date) ? date : undefined;
}

/**
 * Calendar 适配器（shadcn kit）：基于 vendored Calendar（react-day-picker）；
 * DSL 值为 ISO 日期字符串（yyyy-MM-dd），onChange 同样传出 ISO 字符串
 * （DSL 语义值，非 Date 对象）；Form 内声明 `name` 自动成为表单项。
 */
export function Calendar({
  name,
  label,
  rules,
  mode = 'single',
  value,
  disabled,
  onChange,
  className,
  style,
}: CalendarProps) {
  const form = useFormContext();
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';

  useEffect(() => {
    if (inForm && form && name) {
      form.registerField(name, rules, value);
      return () => form.unregisterField(name);
    }
    return undefined;
  });

  const current = inForm && form && name ? form.values[name] : value;

  const handleSelect = (date: Date | undefined) => {
    const next = date ? format(date, 'yyyy-MM-dd') : undefined;
    if (inForm && form && name) {
      form.setValue(name, next);
    }
    onChange?.(next);
  };

  const calendar = (
    <ShadcnCalendar
      mode={mode}
      selected={parseValue(current)}
      onSelect={handleSelect}
      disabled={disabled === true ? true : undefined}
      className={cn(!inForm && className)}
      style={inForm ? undefined : style}
    />
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
        {calendar}
        {error ? (
          <div data-slot="form-error" className="text-sm text-destructive">
            {error}
          </div>
        ) : null}
      </div>
    );
  }

  return calendar;
}
