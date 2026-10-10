import { useI18n } from '@pactor-app/runtime';
import { useEffect, useId, useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import {
  ComboboxContent,
  ComboboxTrigger,
  Combobox as ShadcnCombobox,
} from '../../../ui/combobox.js';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../../ui/command.js';
import { CLEARABLE_GROUP, CLEARABLE_ICON_HIDE, ClearHoverButton } from '../../clearable.js';
import { CONTROL_SIZE_BOX, type ControlSize } from '../../control-size.js';
import { formItemClass, useFormContext } from '../Form/context.js';
import type { FieldRule } from '../Input/index.js';

/** Combobox 选项（支持表达式解析后的数组） */
export interface ComboboxOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface ComboboxProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 选项列表 */
  options?: ComboboxOption[];
  /** 受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues） */
  value?: string | number;
  placeholder?: string;
  /** 是否可搜索过滤（缺省 true） */
  searchable?: boolean;
  disabled?: boolean;
  /** 控件尺寸（默认 middle，即现行 h-9 尺寸） */
  size?: ControlSize;
  /** hover 清除（缺省开启，传 false 关闭）：有选中值时悬停触发器，上下箭头替换为 ×，点击清空（传出 undefined） */
  allowClear?: boolean;
  /** 选中变化事件，传出选中项的原始 value */
  onChange?: (value: string | number | undefined) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器，独立渲染时为触发器） */
  className?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

/**
 * Combobox 适配器（shadcn kit）：vendored Combobox（Popover + Command 组合）；
 * 支持搜索过滤；onChange 传出选中项原始 value（DSL 语义值）；
 * Form 内声明 `name` 自动成为表单项。
 */
export function Combobox({
  name,
  label,
  rules,
  options = [],
  value,
  placeholder,
  searchable = true,
  disabled,
  size = 'middle',
  allowClear,
  onChange,
  className,
  style,
}: ComboboxProps) {
  const form = useFormContext();
  const { t } = useI18n();
  const controlId = useId();
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (inForm && form && name) {
      form.registerField(name, rules, value);
      return () => form.unregisterField(name);
    }
    return undefined;
  });

  // 独立渲染：内部选中态（外部 value 变化时同步镜像）
  const [innerValue, setInnerValue] = useState(value);
  useEffect(() => {
    if (!inForm) setInnerValue(value);
  }, [inForm, value]);

  const current = inForm && form && name ? form.values[name] : innerValue;
  const selected = options.find((option) => option.value === current);
  // hover 清除：有选中且未禁用时，悬停把触发器右侧上下箭头替换为 ×
  const showClear = allowClear !== false && disabled !== true && selected !== undefined;
  const handleClear = () => {
    if (inForm && form && name) {
      form.setValue(name, undefined);
    } else {
      setInnerValue(undefined);
    }
    onChange?.(undefined);
  };

  const handleSelect = (option: ComboboxOption) => {
    if (option.disabled) return;
    if (inForm && form && name) {
      form.setValue(name, option.value);
    } else {
      setInnerValue(option.value);
    }
    onChange?.(option.value);
    setOpen(false);
  };

  const control = (
    <ShadcnCombobox open={open} onOpenChange={setOpen}>
      <ComboboxTrigger
        id={controlId}
        type="button"
        disabled={disabled}
        iconClassName={showClear ? CLEARABLE_ICON_HIDE : undefined}
        endAdornment={
          showClear ? (
            <ClearHoverButton label={t('pactor.control.clear')} onClear={handleClear} />
          ) : null
        }
        className={cn(
          CONTROL_SIZE_BOX[size],
          CLEARABLE_GROUP,
          !selected && 'text-muted-foreground',
          !inForm && className,
        )}
        style={inForm ? undefined : style}
      >
        {selected ? selected.label : (placeholder ?? '')}
      </ComboboxTrigger>
      <ComboboxContent>
        <Command>
          {searchable ? <CommandInput placeholder={placeholder} /> : null}
          <CommandList>
            <CommandEmpty>无匹配结果</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={String(option.value)}
                  value={String(option.value)}
                  keywords={[option.label]}
                  disabled={option.disabled}
                  data-checked={option.value === current ? '' : undefined}
                  onSelect={() => handleSelect(option)}
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </ComboboxContent>
    </ShadcnCombobox>
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
          <label
            htmlFor={controlId}
            className="shrink-0 text-sm leading-none font-medium whitespace-nowrap"
          >
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

  return control;
}
