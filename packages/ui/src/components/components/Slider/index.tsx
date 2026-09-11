import { useEffect, type CSSProperties } from 'react';

import {
  Slider as ShadcnSlider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
} from '../../../ui/slider.js';
import { useFormContext } from '../Form/context.js';
import { FieldShell } from '../Form/form-item.js';
import type { FieldRule } from '../Input/index.js';

export interface SliderProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues） */
  value?: number;
  /** 最小值，默认 0 */
  min?: number;
  /** 最大值，默认 100 */
  max?: number;
  /** 步长，默认 1 */
  step?: number;
  disabled?: boolean;
  /** 拖动变化事件，传出 number */
  onChange?: (value: number) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器，独立渲染时为控件本身） */
  className?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

/**
 * Slider 适配器（shadcn kit）：基于 vendored Slider（Base UI，单值形态）；
 * onChange 传出 number（DSL 语义值，非 DOM 事件）。
 */
export function Slider({
  name,
  label,
  rules,
  value,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  onChange,
  className,
  style,
}: SliderProps) {
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
  const numberValue = typeof current === 'number' ? current : min;

  const handleChange = (next: number) => {
    if (inForm && form && name) {
      form.setValue(name, next);
    }
    onChange?.(next);
  };

  const slider = (
    <ShadcnSlider
      value={numberValue}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      name={inForm ? name : undefined}
      onValueChange={handleChange}
      className={inForm ? undefined : className}
      style={inForm ? undefined : style}
    >
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
        </SliderTrack>
        <SliderThumb />
      </SliderControl>
    </ShadcnSlider>
  );

  if (inForm && form && name) {
    return (
      <FieldShell
        layout={form.layout}
        label={label}
        error={form.errors[name]}
        className={className}
        style={style}
      >
        {slider}
      </FieldShell>
    );
  }

  return slider;
}
