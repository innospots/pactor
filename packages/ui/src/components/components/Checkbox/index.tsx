import type { DslNode } from '@pactor-app/core';
import { useEffect, useId } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';
import { Checkbox as ShadcnCheckbox } from '../../../ui/checkbox.js';
import { DslSlot } from '../../dsl-slot.js';
import { useFormContext } from '../Form/context.js';
import { FieldShell } from '../Form/form-item.js';
import type { FieldRule } from '../Input/index.js';

/** Checkbox 组模式选项 */
export interface CheckboxOption {
  label: string;
  value: string | number | boolean;
  /** 选项次级说明文案（cards 变体渲染在 label 下方） */
  description?: string;
  /** 行右端占位内容（cards 变体）：ReactNode 或 DSL 节点（如图标 / 标签 / 操作按钮） */
  trailing?: DslNode | ReactNode;
  /**
   * cards 变体：整卡可点开关（默认 true）。false 时该行不可点击选中
   * （外观不变，区别于 disabled 的半透明置灰），行内 trailing 仍可交互。
   */
  clickable?: boolean;
  /** 单个选项禁用 */
  disabled?: boolean;
}

/** 组模式的已勾选值 */
export type CheckboxValue = string | number | boolean;

/** 组模式外观变体：default 经典勾选框；cards 行式卡片（选中行高亮） */
export type CheckboxVariant = 'default' | 'cards';

interface CheckboxBaseProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 单选模式：勾选框旁的标签文本；组模式：表单项标签（FieldShell 呈现） */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  disabled?: boolean;
  /** 通用：根节点 class（Form 内为 form-item 容器，独立渲染时为控件包裹） */
  className?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

/** 单选模式（缺省）：单个布尔命题，value / onChange 为 boolean */
export interface CheckboxSingleProps extends CheckboxBaseProps {
  options?: undefined;
  /** 受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues） */
  value?: boolean;
  /** 勾选变化事件，传出 boolean */
  onChange?: (checked: boolean) => void;
}

/** 组模式（提供 options）：多选集合，value / onChange 为已勾选 value 数组 */
export interface CheckboxGroupModeProps extends CheckboxBaseProps {
  /** 选项列表；提供即进入多选组模式 */
  options: CheckboxOption[];
  /** 外观变体，默认 default */
  variant?: CheckboxVariant;
  /** cards 变体行边框，默认 true（false 隐藏边框） */
  bordered?: boolean;
  /** 选项排列方向，默认 vertical（cards 变体恒为纵向） */
  direction?: 'horizontal' | 'vertical';
  /** 受控值（已勾选 value 数组，独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues） */
  value?: CheckboxValue[];
  /** 勾选变化事件，传出全部已勾选 value 数组（toggle 语义） */
  onChange?: (value: CheckboxValue[]) => void;
}

export type CheckboxProps = CheckboxSingleProps | CheckboxGroupModeProps;

/**
 * 组模式 cards 变体（与 RadioGroup cards 同族，交互设计参考 arc
 * https://uiarc.dev/components/radio-group，Tailwind 实现）：原生 checkbox
 * （sr-only）包在 label 行内；多选语义下不做单一滑动高亮，改为每个选中行
 * 各自高亮（transition-colors），勾选指示 scale 弹入（motion-reduce 无动画）。
 */
function CheckboxCards({
  options,
  groupValue,
  groupName,
  disabled,
  bordered = true,
  onToggle,
  className,
  style,
}: {
  options: CheckboxOption[];
  groupValue: CheckboxValue[];
  groupName: string;
  disabled?: boolean;
  bordered?: boolean;
  onToggle: (value: CheckboxValue) => void;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      data-slot="checkbox-group"
      data-variant="cards"
      role="group"
      className={cn('flex flex-col gap-1', className)}
      style={style}
    >
      {options.map((option) => {
        const checked = groupValue.includes(option.value);
        const optionDisabled = disabled === true || option.disabled === true;
        // clickable=false：功能上不可点选但外观不变（区别于 disabled 置灰）
        const clickable = !optionDisabled && option.clickable !== false;
        return (
          <label
            key={String(option.value)}
            data-slot="checkbox-group-card"
            data-checked={checked || undefined}
            className={cn(
              'flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors duration-200 ease-out motion-reduce:transition-none',
              bordered && (checked ? 'border border-primary' : 'border border-border'),
              checked && 'bg-accent',
              optionDisabled
                ? 'cursor-not-allowed opacity-50'
                : clickable
                  ? 'cursor-pointer'
                  : 'cursor-default',
            )}
          >
            <input
              type="checkbox"
              className="sr-only"
              name={groupName}
              value={String(option.value)}
              checked={checked}
              disabled={!clickable}
              onChange={() => onToggle(option.value)}
            />
            <span
              aria-hidden
              className={cn(
                'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors',
                checked ? 'border-primary bg-primary' : 'border-input',
              )}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  'size-3 text-primary-foreground transition-transform duration-200 ease-out motion-reduce:transition-none',
                  checked ? 'scale-100' : 'scale-0',
                )}
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-sm leading-tight font-medium">{option.label}</span>
              {option.description ? (
                <span className="text-xs text-muted-foreground">{option.description}</span>
              ) : null}
            </span>
            {option.trailing != null ? (
              // 占位区为中立区域：阻止 label 的隐式激活，避免与 trailing
              // 内控件（如按钮）交互时误触勾选切换
              <span
                data-slot="checkbox-group-card-trailing"
                className="ml-auto shrink-0 self-center"
                onClick={(event) => event.preventDefault()}
              >
                <DslSlot content={option.trailing} />
              </span>
            ) : null}
          </label>
        );
      })}
    </div>
  );
}

/**
 * Checkbox 适配器（shadcn kit）：基于 vendored Checkbox（Base UI）。
 * - 单选模式（缺省）：单个布尔命题，label 渲染在勾选框旁并与之关联，
 *   onChange 传出 boolean；
 * - 组模式（提供 options）：多选集合，value / onChange 为已勾选 value 数组
 *   （toggle 语义），variant 控制外观（default 勾选框列表 / cards 行式卡片，
 *   交互参考 arc）。
 * 两种模式在 Form 内声明 name 均自动成为表单项（label / rules 生效）。
 */
export function Checkbox(props: CheckboxProps) {
  const { name, label, rules, disabled, className, style } = props;
  const form = useFormContext();
  const controlId = useId();
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';
  const isGroup = props.options !== undefined;

  useEffect(() => {
    if (inForm && form && name) {
      form.registerField(name, rules, props.value);
      return () => form.unregisterField(name);
    }
    return undefined;
  });

  const current = inForm && form && name ? form.values[name] : props.value;

  // ===== 组模式 =====
  if (isGroup) {
    const options = props.options;
    // 始终受控：未勾选任何项用 [] 占位，避免 uncontrolled → controlled 切换
    const groupValue: CheckboxValue[] = Array.isArray(current)
      ? (current as CheckboxValue[])
      : [];

    const handleToggle = (optionValue: CheckboxValue) => {
      const next = groupValue.includes(optionValue)
        ? groupValue.filter((item) => item !== optionValue)
        : [...groupValue, optionValue];
      if (inForm && form && name) {
        form.setValue(name, next);
      }
      props.onChange?.(next);
    };

    const group =
      props.variant === 'cards' ? (
        <CheckboxCards
          options={options}
          groupValue={groupValue}
          groupName={inForm && name ? name : controlId}
          disabled={disabled}
          bordered={props.bordered}
          onToggle={handleToggle}
          className={!inForm ? className : undefined}
          style={inForm ? undefined : style}
        />
      ) : (
        <div
          data-slot="checkbox-group"
          role="group"
          className={cn(
            props.direction === 'horizontal'
              ? 'flex flex-wrap items-center gap-x-6 gap-y-2'
              : 'flex flex-col gap-2',
            !inForm && className,
          )}
          style={inForm ? undefined : style}
        >
          {options.map((option, index) => {
            const itemId = `${controlId}-${index}`;
            const optionDisabled = disabled === true || option.disabled === true;
            return (
              <span key={String(option.value)} className="inline-flex items-center gap-2">
                <ShadcnCheckbox
                  id={itemId}
                  checked={groupValue.includes(option.value)}
                  disabled={optionDisabled}
                  name={inForm ? name : undefined}
                  onCheckedChange={() => {
                    if (!optionDisabled) {
                      handleToggle(option.value);
                    }
                  }}
                />
                <label
                  htmlFor={itemId}
                  className={cn(
                    'text-sm leading-none font-medium',
                    optionDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                  )}
                >
                  {option.label}
                </label>
              </span>
            );
          })}
        </div>
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

  // ===== 单选模式 =====
  const checked = current === true;

  const handleChange = (next: boolean) => {
    if (inForm && form && name) {
      form.setValue(name, next);
    }
    props.onChange?.(next);
  };

  const control = (
    <span
      className={cn('inline-flex items-center gap-2', !inForm && className)}
      style={inForm ? undefined : style}
    >
      <ShadcnCheckbox
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
