import { useI18n } from '@pactor-app/runtime';
import { XIcon } from 'lucide-react';
import { useEffect, useId, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '../../../ui/select.js';
import { useFormContext } from '../Form/context.js';
import { FieldShell } from '../Form/form-item.js';
import {
  CONTROL_SIZE_SELECT_ATTR,
  CONTROL_SIZE_TRIGGER_TEXT,
  type ControlSize,
} from '../../control-size.js';
import type { FieldRule } from '../Input/index.js';

/** MultiSelect 选项（支持表达式解析后的数组） */
export interface MultiSelectOption {
  label: string;
  value: string | number | boolean;
  /** 单个选项禁用 */
  disabled?: boolean;
}

/** 多选值（与选项 value 同型，事件按原始类型传出） */
export type MultiSelectValue = string | number | boolean;

export interface MultiSelectProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则（required 按「至少选中一个」判断） */
  rules?: FieldRule[];
  /** 选项列表 */
  options?: MultiSelectOption[];
  /**
   * 最多可选数量：达到上限后，未选中的选项在弹层内置灰；
   * 已选项保持可点，便于取消勾选
   */
  max?: number;
  /** 未选择时的占位文案（传空字符串则不显示） */
  placeholder?: string;
  disabled?: boolean;
  /** 控件尺寸（默认 middle，即现行 h-9 尺寸） */
  size?: ControlSize;
  /** 触发器的无障碍名（外层 Field 的可见标签未与控件关联时使用） */
  ariaLabel?: string;
  /** 受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues） */
  value?: MultiSelectValue[];
  /** 选中变化事件，传出全部已选 value 数组（按选择顺序） */
  onChange?: (value: MultiSelectValue[]) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器，独立渲染时为控件包裹） */
  className?: string;
  /** 控件包裹 class（Form 内需要精确设置控件样式（如宽度）时使用） */
  controlClassName?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

/**
 * MultiSelect 适配器（shadcn kit）：基于 vendored Select 的 multiple 模式。
 * 触发器内以标签展示已选项（超出宽度逐个省略），hover 单个标签可点
 * 右侧删除按钮移除该项；弹层内可连续勾选、再次点击取消；达到 max 后
 * 未选中项置灰。Form 内声明 `name` 自动成为表单项，必填按「至少选中
 * 一个」校验——Form 原生的 `isEmpty` 只识别 undefined / null / ""，
 * 空数组会被判为有值，因此全部取消选中时写回 undefined，required
 * 规则才能拦住。
 */
export function MultiSelect({
  name,
  label,
  rules,
  options = [],
  max,
  placeholder,
  disabled,
  size = 'middle',
  ariaLabel,
  value,
  onChange,
  className,
  controlClassName,
  style,
}: MultiSelectProps) {
  const form = useFormContext();
  const { t } = useI18n();
  const controlId = useId();
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';

  // 注册字段校验规则，同时把 value prop 作为字段级初始值交给 Form 上下文合并
  useEffect(() => {
    if (inForm && form && name) {
      form.registerField(name, rules, value);
      return () => form.unregisterField(name);
    }
    return undefined;
  });

  const current = inForm && form && name ? form.values[name] : value;
  const selected: MultiSelectValue[] = Array.isArray(current)
    ? (current as MultiSelectValue[])
    : [];
  const atMax = typeof max === 'number' && selected.length >= max;
  const selectedOptions = selected.map((item) => ({
    key: `${typeof item}:${String(item)}`,
    value: item,
    label: options.find((option) => option.value === item)?.label ?? String(item),
  }));

  const handleChange = (next: MultiSelectValue[]) => {
    const values = Array.isArray(next) ? next : [];
    if (inForm && form && name) {
      form.setValue(name, values.length > 0 ? values : undefined);
    }
    onChange?.(values);
  };

  const removeValue = (target: MultiSelectValue) => {
    handleChange(selected.filter((item) => item !== target));
  };

  const inFormRoot = inForm === true;
  const select = (
    <span
      data-slot="multi-select"
      className={cn(
        // Form 内控件占满整行宽度；独立渲染保持内容自然宽度
        inFormRoot
          ? 'flex w-full min-w-0 items-center'
          : 'inline-flex max-w-full items-center',
        !inFormRoot && className,
        controlClassName,
      )}
      style={inFormRoot ? undefined : style}
    >
      <ShadcnSelect<MultiSelectValue, true>
        multiple
        items={options}
        value={selected}
        onValueChange={handleChange}
        disabled={disabled}
        name={inForm ? name : undefined}
      >
        <SelectTrigger
          id={controlId}
          aria-label={ariaLabel}
          size={CONTROL_SIZE_SELECT_ATTR[size]}
          className={cn(
            CONTROL_SIZE_TRIGGER_TEXT[size],
            // 触发器恒撑满控件包裹节点；py-1 给标签留出垂直空间
            //（vendored 基类 py-2 在 h-9 下只剩 18px 内容高，标签会被裁切）
            'w-full overflow-hidden py-1',
          )}
        >
          {selectedOptions.length > 0 ? (
            <span
              data-slot="multi-select-tags"
              className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden"
            >
              {selectedOptions.map((option) => (
                <span
                  key={option.key}
                  data-slot="multi-select-tag"
                  title={option.label}
                  className="group/tag inline-flex h-5 min-w-0 shrink items-center rounded-[4px] bg-muted px-1.5 text-xs leading-none text-foreground"
                >
                  <span className="min-w-0 truncate">{option.label}</span>
                  {disabled ? null : (
                    <span
                      data-slot="multi-select-tag-remove"
                      aria-hidden="true"
                      className="inline-flex w-0 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[3px] text-muted-foreground opacity-0 transition-[width,opacity,margin] group-hover/tag:ml-1 group-hover/tag:w-3.5 group-hover/tag:opacity-100 hover:bg-foreground/10 hover:text-foreground"
                      onPointerDown={(event) => {
                        // 阻止触发器在 pointerdown 展开弹层；
                        // 不能 preventDefault，否则浏览器会吞掉后续 click
                        event.stopPropagation();
                      }}
                      onMouseDown={(event) => {
                        event.stopPropagation();
                      }}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        removeValue(option.value);
                      }}
                    >
                      <XIcon className="size-2.5" />
                    </span>
                  )}
                </span>
              ))}
            </span>
          ) : (
            <span
              data-slot="multi-select-placeholder"
              className="min-w-0 flex-1 truncate text-muted-foreground"
            >
              {placeholder ?? t('pactor.select.placeholder')}
            </span>
          )}
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => {
            const checked = selected.includes(option.value);
            return (
              <SelectItem
                key={String(option.value)}
                value={option.value}
                disabled={option.disabled === true || (atMax && !checked)}
              >
                {option.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </ShadcnSelect>
    </span>
  );

  if (inForm && form && name) {
    return (
      <FieldShell
        layout={form.layout}
        label={label}
        htmlFor={controlId}
        rules={rules}
        error={form.errors[name]}
        className={className}
        style={style}
      >
        {select}
      </FieldShell>
    );
  }

  return select;
}
