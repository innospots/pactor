import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { useFormContext } from '../Form/context.js';
import { FieldShell } from '../Form/form-item.js';
import { Icon } from '../Icon/index.js';
import type { FieldRule } from '../Input/index.js';

/** 分段选项；`icon` 为 Icon 白名单图标名（kebab-case 或 PascalCase） */
export interface SegmentedOption {
  label: string;
  value: string | number;
  icon?: string;
  disabled?: boolean;
}

export interface SegmentedProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 选项列表（可含表达式解析后的数组） */
  options?: SegmentedOption[];
  /** 受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues） */
  value?: string | number;
  /** 整体禁用 */
  disabled?: boolean;
  /** 选中变化事件，传出选中项的 value */
  onChange?: (value: string | number) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器，独立渲染时为控件本身） */
  className?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

/**
 * Segmented 适配器（shadcn kit）：药丸式分段选择器，选中项由滑动
 * 指示块（absolute pill，left/width 过渡）承载高亮；onChange 传出
 * 选中项 value（DSL 语义值）；Form 集成同 Slider 模式。
 */
export function Segmented({
  name,
  label,
  rules,
  options = [],
  value,
  disabled,
  onChange,
  className,
  style,
}: SegmentedProps) {
  const form = useFormContext();
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';
  const [innerValue, setInnerValue] = useState<string | number | undefined>(value);

  useEffect(() => {
    if (inForm && form && name) {
      form.registerField(name, rules, value);
      return () => form.unregisterField(name);
    }
    return undefined;
  });

  const current = inForm && form && name ? form.values[name] : (value ?? innerValue);

  const handleChange = (option: SegmentedOption) => {
    if (disabled || option.disabled) return;
    if (inForm && form && name) {
      form.setValue(name, option.value);
    } else if (value === undefined) {
      setInnerValue(option.value);
    }
    onChange?.(option.value);
  };

  // 滑动指示块：量取选中按钮的位置与宽度，left/width 过渡平滑移动
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);
  const activeIndex = options.findIndex((option) => option.value === current);

  useLayoutEffect(() => {
    const measure = () => {
      const el = activeIndex >= 0 ? itemRefs.current[activeIndex] : null;
      setIndicator(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeIndex, options]);

  const control = (
    <div
      data-slot="segmented"
      role="radiogroup"
      className={cn(
        'relative inline-flex items-center gap-1 rounded-full bg-muted p-1',
        disabled && 'cursor-not-allowed opacity-50',
        inForm ? undefined : className,
      )}
      style={inForm ? undefined : style}
    >
      {indicator ? (
        <span
          data-slot="segmented-indicator"
          aria-hidden
          className="pointer-events-none absolute top-1 bottom-1 rounded-full bg-background shadow-sm motion-safe:transition-[left,width] motion-safe:duration-200 motion-safe:ease-out"
          style={{ left: indicator.left, width: indicator.width }}
        />
      ) : null}
      {options.map((option, index) => {
        const active = current === option.value;
        return (
          <button
            key={option.value}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            data-slot="segmented-item"
            data-value={option.value}
            disabled={disabled === true || option.disabled === true}
            onClick={() => handleChange(option)}
            className={cn(
              'relative inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm whitespace-nowrap transition-colors',
              active
                ? 'font-medium text-foreground'
                : 'text-muted-foreground hover:text-foreground',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            {option.icon ? <Icon name={option.icon} size="sm" /> : null}
            {option.label}
          </button>
        );
      })}
    </div>
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
        {control}
      </FieldShell>
    );
  }

  return control;
}
