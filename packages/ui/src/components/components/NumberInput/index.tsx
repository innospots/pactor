import { useI18n } from '@pactor-app/runtime';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useEffect, useId, useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Input as ShadcnInput } from '../../../ui/input.js';
import { useFormContext } from '../Form/context.js';
import { FieldShell } from '../Form/form-item.js';
import type { FieldRule } from '../Input/index.js';

export interface NumberInputProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues） */
  value?: number;
  /** 最小值（输入越界时钳制） */
  min?: number;
  /** 最大值（输入越界时钳制） */
  max?: number;
  /** 步长（原生步进按钮步距），默认 1 */
  step?: number;
  /** 小数精度位数；声明后输入值按此精度四舍五入 */
  precision?: number;
  placeholder?: string;
  disabled?: boolean;
  /** 输入事件，传出 number；清空时传出 undefined */
  onChange?: (value: number | undefined) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器，独立渲染时为控件包裹节点） */
  className?: string;
  /** 控件本体（input）class（无论是否在 Form 内都挂 input 节点） */
  controlClassName?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

function clamp(value: number, min?: number, max?: number): number {
  let next = value;
  if (typeof min === 'number' && next < min) next = min;
  if (typeof max === 'number' && next > max) next = max;
  return next;
}

function applyPrecision(value: number, precision?: number): number {
  if (typeof precision !== 'number') return value;
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function decimalPlaces(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const str = String(value);
  const eIndex = str.indexOf('e-');
  if (eIndex !== -1) return Number(str.slice(eIndex + 2));
  const dot = str.indexOf('.');
  return dot === -1 ? 0 : str.length - dot - 1;
}

function toDisplayText(value: number | undefined): string {
  return typeof value === 'number' && Number.isFinite(value) ? String(value) : '';
}

/**
 * NumberInput 适配器（shadcn kit）：数字输入框，右侧带增加/减少步进按钮。
 * 在 Form 内且声明 `name` 时自动成为表单项（label / rules 生效，
 * 值由 Form 上下文托管）；否则渲染独立受控控件。
 * onChange 传出 number（DSL 语义值）；输入过程保留中间文本（如 "-" / "1."），
 * 可解析时传出钳制 + 精度规整后的 number，清空时传出 undefined。
 * 步进按钮按 step 增减并以 min/max 钳制；到达边界或 disabled 时对应按钮禁用。
 */
export function NumberInput({
  name,
  label,
  rules,
  value,
  min,
  max,
  step = 1,
  precision,
  placeholder,
  disabled,
  onChange,
  className,
  controlClassName,
  style,
}: NumberInputProps) {
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
  const externalValue =
    typeof fieldValue === 'number'
      ? fieldValue
      : inForm
        ? undefined
        : typeof value === 'number'
          ? value
          : undefined;

  // 输入中间态文本（允许 "-" / "1." 等未完结输入），外部值变化时回同步
  const [text, setText] = useState(() => toDisplayText(externalValue));
  useEffect(() => {
    setText((current) => {
      const parsed = current === '' ? undefined : Number(current);
      const currentNumber =
        parsed !== undefined && Number.isFinite(parsed)
          ? applyPrecision(clamp(parsed, min, max), precision)
          : undefined;
      // 文本与外部值语义一致时保留文本（避免输入 "1." 被打断）
      return currentNumber === externalValue ? current : toDisplayText(externalValue);
    });
  }, [externalValue, min, max, precision]);

  const commit = (next: number | undefined) => {
    if (inForm && form && name) {
      form.setValue(name, next);
    }
    onChange?.(next);
  };

  // 步进：基于当前已提交值（空值以 0 为基准）按 step 增减，钳制 + 精度规整；
  // 未声明 precision 时按 step 与当前值的小数位数推导，消除 0.1+0.2 一类浮点误差
  const stepBy = (direction: 1 | -1) => {
    const base = externalValue ?? 0;
    const effectivePrecision =
      typeof precision === 'number'
        ? precision
        : Math.max(decimalPlaces(step), decimalPlaces(base));
    const next = applyPrecision(clamp(base + direction * step, min, max), effectivePrecision);
    setText(toDisplayText(next));
    commit(next);
  };
  const atMax =
    typeof max === 'number' && externalValue !== undefined && externalValue >= max;
  const atMin =
    typeof min === 'number' && externalValue !== undefined && externalValue <= min;

  const stepperClass =
    'flex flex-1 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50';
  // 包裹节点承载步进按钮（data-slot="number-input"）；原生步进箭头隐藏，
  // 避免与自定义按钮重复（键盘 ArrowUp/ArrowDown 步进行为不受影响）
  const control = (
    <span
      data-slot="number-input"
      className={cn('relative block', !inForm && className)}
      style={!inForm ? style : undefined}
    >
      <ShadcnInput
        id={controlId}
        type="number"
        value={text}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'pr-7 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          controlClassName,
        )}
        onChange={(event) => {
          const raw = event.target.value;
          setText(raw);
          if (raw === '') {
            commit(undefined);
            return;
          }
          const parsed = Number(raw);
          if (!Number.isFinite(parsed)) return;
          commit(applyPrecision(clamp(parsed, min, max), precision));
        }}
      />
      <span className="absolute inset-y-0 right-0 flex w-7 flex-col divide-y divide-input border-l border-input">
        <button
          type="button"
          tabIndex={-1}
          aria-label={t('pactor.numberInput.increase')}
          disabled={disabled === true || atMax}
          className={stepperClass}
          onClick={() => stepBy(1)}
        >
          <ChevronUpIcon className="size-3" />
        </button>
        <button
          type="button"
          tabIndex={-1}
          aria-label={t('pactor.numberInput.decrease')}
          disabled={disabled === true || atMin}
          className={stepperClass}
          onClick={() => stepBy(-1)}
        >
          <ChevronDownIcon className="size-3" />
        </button>
      </span>
    </span>
  );

  if (inForm && form && name) {
    return (
      <FieldShell
        layout={form.layout}
        label={label}
        htmlFor={controlId}
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
