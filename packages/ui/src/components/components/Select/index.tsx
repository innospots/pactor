import { useI18n } from '@pactor-app/runtime';
import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select.js';
import { useFormContext } from '../Form/context.js';
import { FieldShell } from '../Form/form-item.js';
import { Icon } from '../Icon/index.js';
import { CLEARABLE_GROUP, CLEARABLE_ICON_HIDE, ClearHoverButton } from '../../clearable.js';
import {
  CONTROL_SIZE_SELECT_ATTR,
  CONTROL_SIZE_TRIGGER_TEXT,
  type ControlSize,
} from '../../control-size.js';
import type { FieldRule } from '../Input/index.js';

/** Select 选项（支持表达式解析后的数组） */
export interface SelectOption {
  label: string;
  value: string | number | boolean;
  /** 选项图标（Icon 白名单键，如 `grid`）：下拉项与触发器选中值前置展示 */
  icon?: string;
  /** 单个选项禁用 */
  disabled?: boolean;
}

/**
 * Select 选项分组（结构对齐 antd 的 options 分组）：label 为分组标题，
 * options 为组内选项。分组只用作展示分隔，选中值仍取组内选项的 value。
 */
export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

/** options 数组元素：平铺选项与分组可混排，顺序即渲染顺序 */
export type SelectOptionEntry = SelectOption | SelectOptionGroup;

function isSelectOptionGroup(option: SelectOptionEntry): option is SelectOptionGroup {
  return Array.isArray((option as SelectOptionGroup).options);
}

/** 展开分组得到全部叶子选项：触发器 value→label 映射与自动搜索计数共用 */
function flattenSelectOptions(options: SelectOptionEntry[]): SelectOption[] {
  return options.flatMap((option) =>
    isSelectOptionGroup(option) ? option.options : [option],
  );
}

/**
 * 搜索过滤：按叶子选项 label 匹配；整组子项都不匹配时隐藏分组标题，
 * 部分匹配时保留分组与命中的子项，与分组混排的平铺选项行为不变。
 */
function filterSelectOptions(
  options: SelectOptionEntry[],
  keyword: string,
): SelectOptionEntry[] {
  return options.flatMap<SelectOptionEntry>((option) => {
    if (isSelectOptionGroup(option)) {
      const children = option.options.filter((child) =>
        child.label.toLowerCase().includes(keyword),
      );
      return children.length > 0 ? [{ ...option, options: children }] : [];
    }
    return option.label.toLowerCase().includes(keyword) ? [option] : [];
  });
}

export interface SelectProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 选项列表；元素可为平铺选项或分组（分组与平铺选项可混排） */
  options?: SelectOptionEntry[];
  /**
   * 选项搜索：true 始终展示搜索框；false 禁止；缺省选项数 > 10 时自动展示。
   * 按 label 包含匹配过滤（大小写不敏感）
   */
  showSearch?: boolean;
  /** 受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues） */
  value?: string | number | boolean;
  placeholder?: string;
  disabled?: boolean;
  /** 控件尺寸（默认 middle，即现行 h-9 尺寸） */
  size?: ControlSize;
  /** hover 清除（缺省开启，传 false 关闭）：有选中值时悬停触发器，下拉箭头替换为 ×，点击清空选中 */
  allowClear?: boolean;
  /** 选中变化事件，传出选中的 value */
  onChange?: (value: unknown) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器，独立渲染时为控件包裹） */
  className?: string;
  /** 控件本体 class（无论是否在 Form 内都挂控件包裹节点；独立渲染时与
   *  className 同点合并——Form 内需要精确设置控件样式（如宽度）时使用） */
  controlClassName?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
  /** 触发器 id；缺省自动生成。独立渲染时供外部 label 的 htmlFor 关联 */
  id?: string;
  /** 触发器 class：独立渲染时补充设计稿尺寸 / 圆角等样式 */
  triggerClassName?: string;
  /** 触发器图标 class：定制下拉箭头尺寸 / 颜色，clearable 的悬停隐藏自动合并 */
  iconClassName?: string;
}

/**
 * Select 适配器（shadcn kit，语义对齐 antd 版）：
 * 基于 vendored shadcn Select（@base-ui/react）；Form 内声明 `name`
 * 自动成为表单项；onChange 传出选中的原始 value（Base UI Select 的
 * value 原生支持 string/number/boolean，无需序列化）。
 *
 * value→label 映射经 Root 的 `items` 提供：选中值对应的 item 尚未渲染过
 * popup 时（如表单初始值回填），Trigger 同样显示 label（对齐原 Radix 坑
 * 的对应场景，见 design D2/风险表）。
 */
export function Select({
  name,
  label,
  rules,
  options = [],
  value,
  placeholder,
  disabled,
  size = 'middle',
  allowClear,
  showSearch,
  onChange,
  className,
  controlClassName,
  style,
  id,
  triggerClassName,
  iconClassName,
}: SelectProps) {
  const form = useFormContext();
  const { t } = useI18n();
  const controlId = useId();
  const triggerId = id ?? controlId;
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 分组仅参与展示；自动搜索阈值、选中项回查与 value→label 映射都按叶子选项计算
  const flatOptions = flattenSelectOptions(options);
  const searchEnabled = showSearch ?? flatOptions.length > 10;
  const keyword = query.trim().toLowerCase();
  const visibleOptions = keyword
    ? filterSelectOptions(options, keyword)
    : options;

  // 注册字段校验规则，同时把 value prop 作为字段级初始值交给 Form 上下文合并
  useEffect(() => {
    if (inForm && form && name) {
      form.registerField(name, rules, value);
      return () => form.unregisterField(name);
    }
    return undefined;
  });

  const current = inForm && form && name ? form.values[name] : value;
  const selectedValue =
    current === undefined || current === null || current === ''
      ? null
      : (current as SelectOption['value']);
  const showClear = allowClear !== false && disabled !== true && selectedValue !== null;

  const handleChange = (next: SelectOption['value'] | null) => {
    if (inForm && form && name) {
      form.setValue(name, next ?? undefined);
    }
    onChange?.(next ?? undefined);
  };

  const inFormRoot = inForm === true;
  const selectedOption =
    selectedValue === null
      ? undefined
      : flatOptions.find((option) => option.value === selectedValue);
  const selectedIcon = selectedOption?.icon;
  // 选中值对应的完整 label：触发器内文案会被省略号截断，title 提供
  // 原生 hover 提示；未选中时不给 title，避免空提示
  const selectedLabel =
    selectedValue === null
      ? undefined
      : (selectedOption?.label ?? String(selectedValue));
  // 分组内的选项左侧缩进，与平铺选项 / 分组标题形成层级（对齐 antd 分组视觉）
  const renderOption = (option: SelectOption, grouped = false) => (
    <SelectItem
      key={String(option.value)}
      value={option.value}
      disabled={option.disabled}
      className={grouped ? 'pl-8' : undefined}
    >
      {option.icon ? <Icon name={option.icon} size="sm" /> : null}
      {option.label}
    </SelectItem>
  );
  const select = (
    <span
      className={cn(
        // Form / Field（Form 上下文）内控件占满整行宽度；独立渲染保持内容自然宽度。
        // min-w-0：水平布局下作为 form-item 的 flex 子项可收缩（超长选中值
        // 由 SelectValue 截断），否则 min-width:auto 会把表单项撑宽。
        inFormRoot
          ? 'flex w-full min-w-0 items-center gap-1'
          : 'inline-flex items-center gap-1',
        !inFormRoot && className,
        controlClassName,
      )}
      style={inFormRoot ? undefined : style}
    >
      <ShadcnSelect<SelectOption['value']>
        items={flatOptions}
        value={selectedValue}
        onValueChange={handleChange}
        disabled={disabled}
        name={inForm ? name : undefined}
        onOpenChange={(open) => {
          if (open) {
            // 弹层打开后聚焦搜索框（Base UI 默认把焦点给选中项，延后一帧让位）
            requestAnimationFrame(() => searchInputRef.current?.focus());
          } else {
            setQuery('');
          }
        }}
      >
        <SelectTrigger
          id={triggerId}
          title={selectedLabel}
          size={CONTROL_SIZE_SELECT_ATTR[size]}
          iconClassName={cn(iconClassName, showClear ? CLEARABLE_ICON_HIDE : undefined)}
          className={cn(
            CONTROL_SIZE_TRIGGER_TEXT[size],
            // 触发器恒撑满控件包裹节点：基类 w-fit 会让选择框宽度随
            // 选中值标签浮动，消费方经 className / controlClassName
            // 传入的宽度（如 w-28）必须落到触发器上才能真正固定；
            // 自然宽度场景包裹节点为内容尺寸，w-full 退化为 auto
            'w-full',
            CLEARABLE_GROUP,
            triggerClassName,
          )}
        >
          <SelectValue placeholder={placeholder ?? t('pactor.select.placeholder')}>
            {selectedIcon
              ? () => (
                  <span className="flex min-w-0 items-center gap-2">
                    <Icon name={selectedIcon} size="sm" />
                    <span className="truncate">{selectedOption?.label}</span>
                  </span>
                )
              : undefined}
          </SelectValue>
          {showClear ? (
            <ClearHoverButton
              label={t('pactor.select.clear')}
              onClear={() => handleChange(null)}
            />
          ) : null}
        </SelectTrigger>
        <SelectContent>
          {searchEnabled ? (
            <div
              data-slot="select-search"
              className="sticky top-0 z-10 -mx-1 -mt-1 bg-popover px-1 pt-1 pb-1"
            >
              <input
                ref={searchInputRef}
                value={query}
                placeholder={t('pactor.select.search')}
                aria-label={t('pactor.select.search')}
                className="h-8 w-full rounded-md border border-border bg-(--input-background) px-2 text-sm text-(--input-foreground) outline-none placeholder:text-muted-foreground focus:border-primary"
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  // 字符键拦截列表 typeahead；导航/确认/关闭键放行给列表处理
                  if (!['Escape', 'ArrowDown', 'ArrowUp', 'Enter', 'Tab'].includes(event.key)) {
                    event.stopPropagation();
                  }
                }}
              />
            </div>
          ) : null}
          {visibleOptions.map((option, index) =>
            isSelectOptionGroup(option) ? (
              <SelectGroup key={`group-${index}-${option.label}`}>
                <SelectLabel>{option.label}</SelectLabel>
                {option.options.map((child) => renderOption(child, true))}
              </SelectGroup>
            ) : (
              renderOption(option)
            ),
          )}
          {visibleOptions.length === 0 ? (
            <div className="px-2 py-3 text-center text-sm text-muted-foreground">
              {t('pactor.command.empty')}
            </div>
          ) : null}
        </SelectContent>
      </ShadcnSelect>
    </span>
  );

  if (inForm && form && name) {
    return (
      <FieldShell
        layout={form.layout}
        label={label}
        htmlFor={triggerId}
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
