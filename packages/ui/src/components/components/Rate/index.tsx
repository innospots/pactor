import { useI18n } from '@pactor-app/runtime';
import { Star } from 'lucide-react';
import { useEffect, useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { useFormContext } from '../Form/context.js';
import { FieldShell } from '../Form/form-item.js';
import type { FieldRule } from '../Input/index.js';

export interface RateProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues） */
  value?: number;
  /** 星总数，缺省 5 */
  count?: number;
  /** 允许半星（点击星左半得 x.5，右半得整数） */
  allowHalf?: boolean;
  disabled?: boolean;
  /** 评分变化事件，传出 number */
  onChange?: (value: number) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器，独立渲染时为控件本身） */
  className?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

/**
 * Rate 适配器（shadcn kit）：lucide Star 星形评分，支持半星
 * （每星左/右两个点击区）；onChange 传出 number（DSL 语义值）；
 * Form 内声明 `name` 自动成为表单项。
 */
export function Rate({
  name,
  label,
  rules,
  value,
  count = 5,
  allowHalf,
  disabled,
  onChange,
  className,
  style,
}: RateProps) {
  const form = useFormContext();
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';

  useEffect(() => {
    if (inForm && form && name) {
      form.registerField(name, rules, value);
      return () => form.unregisterField(name);
    }
    return undefined;
  });

  // 独立渲染：内部选中态（外部 value 变化时同步镜像）
  const [innerValue, setInnerValue] = useState(value);
  const { t } = useI18n();
  useEffect(() => {
    if (!inForm) setInnerValue(value);
  }, [inForm, value]);

  const current = inForm && form && name ? form.values[name] : innerValue;
  const rating = typeof current === 'number' ? current : 0;

  const handleSelect = (next: number) => {
    if (disabled) return;
    if (inForm && form && name) {
      form.setValue(name, next);
    } else {
      setInnerValue(next);
    }
    onChange?.(next);
  };

  const stars = [];
  for (let i = 1; i <= count; i += 1) {
    const full = rating >= i;
    const half = !full && rating >= i - 0.5;
    stars.push(
      <span key={i} className="relative inline-flex" data-slot="rate-star">
        <Star
          className={cn(
            'size-5',
            full ? 'fill-warning text-warning' : 'text-muted-foreground',
          )}
        />
        {half ? (
          <span className="absolute inset-0 w-1/2 overflow-hidden" aria-hidden>
            <Star className="size-5 fill-warning text-warning" />
          </span>
        ) : null}
        {allowHalf ? (
          <>
            <button
              type="button"
              aria-label={t('pactor.rate.starLeft', { index: i })}
              disabled={disabled}
              className="absolute inset-y-0 left-0 w-1/2 cursor-pointer disabled:cursor-not-allowed"
              onClick={() => handleSelect(i - 0.5)}
            />
            <button
              type="button"
              aria-label={t('pactor.rate.starRight', { index: i })}
              disabled={disabled}
              className="absolute inset-y-0 right-0 w-1/2 cursor-pointer disabled:cursor-not-allowed"
              onClick={() => handleSelect(i)}
            />
          </>
        ) : (
          <button
            type="button"
            aria-label={t('pactor.rate.star', { index: i })}
            disabled={disabled}
            className="absolute inset-0 cursor-pointer disabled:cursor-not-allowed"
            onClick={() => handleSelect(i)}
          />
        )}
      </span>,
    );
  }

  const control = (
    <div
      data-slot="rate"
      role="radiogroup"
      className={cn(
        'inline-flex items-center gap-1',
        disabled && 'opacity-50',
        !inForm && className,
      )}
      style={inForm ? undefined : style}
    >
      {stars}
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
