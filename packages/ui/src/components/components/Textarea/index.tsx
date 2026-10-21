import { useI18n } from '@pactor-app/runtime';
import { useEffect, useId, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Textarea as ShadcnTextarea, type TextareaAutoSize } from '../../../ui/textarea.js';
import { CONTROL_SIZE_AREA, type ControlSize } from '../../control-size.js';
import { useFormContext } from '../Form/context.js';
import { FieldShell } from '../Form/form-item.js';
import type { FieldRule } from '../Input/index.js';

export interface TextareaProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues） */
  value?: string;
  placeholder?: string;
  /** 行数（缺省 3）；autoSize 开启时作为内容不足时的下限行数 */
  rows?: number;
  /** 高度随内容自适应：true 无上限；{ minRows, maxRows } 限定行数区间（超上限内部滚动）；缺省 false 固定 rows 行高（可拖拽调高） */
  autoSize?: boolean | TextareaAutoSize;
  disabled?: boolean;
  /** 最大输入长度（原生 maxLength，达到上限后无法继续输入） */
  maxLength?: number;
  /** 控件尺寸（默认 middle；影响内边距与字号，高度仍由行数/内容决定） */
  size?: ControlSize;
  /** 输入事件，传出 string 值 */
  onChange?: (value: string) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器，独立渲染时为控件本身） */
  className?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

/**
 * Textarea 适配器（shadcn kit）：Form 内声明 `name` 自动成为表单项；
 * onChange 传出 string（非原生 event）；autoSize（缺省 false）开启后
 * 高度随内容自适应（{ minRows, maxRows } 限定行数区间）。
 */
export function Textarea({
  name,
  label,
  rules,
  value,
  placeholder,
  rows,
  autoSize,
  disabled,
  maxLength,
  size = 'middle',
  onChange,
  className,
  style,
}: TextareaProps) {
  const form = useFormContext();
  const { t } = useI18n();
  const controlId = useId();
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';

  useEffect(() => {
    if (inForm && form && name) {
      form.registerField(name, rules, value);
      return () => form.unregisterField(name);
    }
    return undefined;
  });

  if (inForm && form && name) {
    const fieldValue = form.values[name];
    return (
      <FieldShell
        layout={form.layout}
        label={label}
        rules={rules}
        htmlFor={controlId}
        error={form.errors[name]}
        className={className}
        style={style}
      >
        <ShadcnTextarea
          id={controlId}
          value={typeof fieldValue === 'string' ? fieldValue : ''}
          placeholder={placeholder ?? t('pactor.input.placeholder')}
          rows={rows}
          autoSize={autoSize}
          disabled={disabled}
          maxLength={maxLength}
          className={CONTROL_SIZE_AREA[size]}
          onChange={(event) => {
            form.setValue(name, event.target.value);
            onChange?.(event.target.value);
          }}
        />
      </FieldShell>
    );
  }

  return (
    <ShadcnTextarea
      value={value ?? ''}
      placeholder={placeholder ?? t('pactor.input.placeholder')}
      rows={rows}
      autoSize={autoSize}
      disabled={disabled}
      maxLength={maxLength}
      className={cn(CONTROL_SIZE_AREA[size], className)}
      style={style}
      onChange={(event) => onChange?.(event.target.value)}
    />
  );
}
