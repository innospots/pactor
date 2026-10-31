import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { RadioGroup as ShadcnRadioGroup, RadioGroupItem } from '../../../ui/radio-group.js';
import { useFormContext } from '../Form/context.js';
import { FieldShell } from '../Form/form-item.js';
import type { FieldRule } from '../Input/index.js';

/** RadioGroup 选项 */
export interface RadioGroupOption {
  label: string;
  value: string | number | boolean;
  /** 选项次级说明文案（cards 变体渲染在 label 下方） */
  description?: string;
  /** 单个选项禁用 */
  disabled?: boolean;
}

/** RadioGroup 外观变体：default 经典单选圈；cards 行式卡片（滑动高亮） */
export type RadioGroupVariant = 'default' | 'cards';

export interface RadioGroupProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 选项列表 */
  options?: RadioGroupOption[];
  /** 选项排列方向，默认 vertical（cards 变体恒为纵向） */
  direction?: 'horizontal' | 'vertical';
  /** 外观变体，默认 default */
  variant?: RadioGroupVariant;
  /** 受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues） */
  value?: string | number | boolean;
  disabled?: boolean;
  /** 选中变化事件，传出选中项的 value */
  onChange?: (value: string | number | boolean) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器，独立渲染时为控件包裹） */
  className?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

interface HighlightBox {
  top: number;
  height: number;
}

/**
 * cards 变体（交互设计参考 arc：https://uiarc.dev/components/radio-group，
 * Tailwind 实现）：原生 radio（sr-only）包在 label 行内，同 name 组天然获得
 * 方向键移动语义；一个共享高亮块经 transform 滑动到选中行（motion-reduce
 * 下无动画），选中行圆点 scale 弹入；ResizeObserver 在行高变化时重放高亮。
 */
function RadioCards({
  options,
  groupValue,
  groupName,
  disabled,
  onSelect,
  className,
  style,
}: {
  options: RadioGroupOption[];
  groupValue: RadioGroupOption['value'];
  groupName: string;
  disabled?: boolean;
  onSelect: (value: RadioGroupOption['value']) => void;
  className?: string;
  style?: CSSProperties;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const [highlight, setHighlight] = useState<HighlightBox | null>(null);
  const selectedIndex = options.findIndex((option) => option.value === groupValue);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) {
      return undefined;
    }
    const measure = () => {
      const row =
        selectedIndex >= 0
          ? (list.querySelectorAll('[data-slot=radio-group-card]')[selectedIndex] as
              | HTMLElement
              | undefined)
          : undefined;
      if (row) {
        setHighlight({ top: row.offsetTop, height: row.offsetHeight });
      } else {
        setHighlight(null);
      }
    };
    measure();
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(measure);
      observer.observe(list);
      return () => observer.disconnect();
    }
    return undefined;
  }, [selectedIndex, options]);

  return (
    <div
      ref={listRef}
      data-slot="radio-group"
      data-variant="cards"
      role="radiogroup"
      className={cn('relative flex flex-col gap-1', className)}
      style={style}
    >
      {highlight ? (
        <div
          aria-hidden
          data-slot="radio-group-highlight"
          className="pointer-events-none absolute inset-x-0 top-0 rounded-md bg-accent transition-transform duration-200 ease-out motion-reduce:transition-none"
          style={{ transform: `translateY(${highlight.top}px)`, height: highlight.height }}
        />
      ) : null}
      {options.map((option) => {
        const checked = option.value === groupValue;
        const optionDisabled = disabled === true || option.disabled === true;
        return (
          <label
            key={String(option.value)}
            data-slot="radio-group-card"
            data-checked={checked || undefined}
            className={cn(
              'relative flex items-start gap-3 rounded-md px-3 py-2.5',
              optionDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            )}
          >
            <input
              type="radio"
              className="sr-only"
              name={groupName}
              value={String(option.value)}
              checked={checked}
              disabled={optionDisabled}
              onChange={() => onSelect(option.value)}
            />
            <span
              aria-hidden
              className={cn(
                'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                checked ? 'border-primary' : 'border-input',
              )}
            >
              <span
                className={cn(
                  'size-2 rounded-full bg-primary transition-transform duration-200 ease-out motion-reduce:transition-none',
                  checked ? 'scale-100' : 'scale-0',
                )}
              />
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm leading-tight font-medium">{option.label}</span>
              {option.description ? (
                <span className="text-xs text-muted-foreground">{option.description}</span>
              ) : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}

/**
 * RadioGroup 适配器（shadcn kit）：default 变体基于 vendored RadioGroup
 * （Base UI），value 原生支持 string/number/boolean，onChange 传出选中项原始
 * value；cards 变体为原生 radio 行式卡片（共享高亮滑动到选中行，交互参考
 * arc）。`direction` 控制 default 变体选项横/纵排列；label 经 htmlFor 关联，
 * 点击文字即选中对应项。
 */
export function RadioGroup({
  name,
  label,
  rules,
  options = [],
  direction = 'vertical',
  variant = 'default',
  value,
  disabled,
  onChange,
  className,
  style,
}: RadioGroupProps) {
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

  const handleChange = (next: RadioGroupOption['value']) => {
    if (inForm && form && name) {
      form.setValue(name, next);
    }
    onChange?.(next);
  };

  // 始终受控：未选中用 '' 占位（不命中任何选项），避免 Form 内初值 undefined
  // 导致的 uncontrolled → controlled 切换
  const groupValue = (current ?? '') as RadioGroupOption['value'];

  const group =
    variant === 'cards' ? (
      <RadioCards
        options={options}
        groupValue={groupValue}
        groupName={inForm && name ? name : controlId}
        disabled={disabled}
        onSelect={handleChange}
        className={!inForm ? className : undefined}
        style={inForm ? undefined : style}
      />
    ) : (
      <ShadcnRadioGroup<RadioGroupOption['value']>
        value={groupValue}
        onValueChange={handleChange}
        disabled={disabled}
        name={inForm ? name : undefined}
        className={cn(
          direction === 'horizontal' && 'flex flex-wrap items-center gap-x-6 gap-y-2',
          !inForm && className,
        )}
        style={inForm ? undefined : style}
      >
        {options.map((option, index) => {
          const textId = `${controlId}-${index}`;
          const optionDisabled = disabled === true || option.disabled === true;
          return (
            <span key={String(option.value)} className="inline-flex items-center gap-2">
              <RadioGroupItem
                value={option.value}
                disabled={option.disabled}
                aria-labelledby={textId}
              />
              {/* Base UI Radio.Root 渲染 span（忽略 id prop），label htmlFor 无法
                  关联，可访问名经 aria-labelledby 挂到文字上，文字点击选中由
                  onClick 承担 */}
              <span
                id={textId}
                className={cn(
                  'text-sm leading-none font-medium',
                  optionDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                )}
                onClick={() => {
                  if (!optionDisabled) {
                    handleChange(option.value);
                  }
                }}
              >
                {option.label}
              </span>
            </span>
          );
        })}
      </ShadcnRadioGroup>
    );

  if (inForm && form && name) {
    return (
      <FieldShell
        layout={form.layout}
        label={label}
        rules={rules}
        error={form.errors[name]}
        className={className}
        style={style}
      >
        {group}
      </FieldShell>
    );
  }

  return group;
}
