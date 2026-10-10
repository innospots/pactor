import { Check, ChevronsUpDown, X } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../../lib/utils.js';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../../ui/command.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../ui/popover.js';
import { ClearHoverButton } from '../../clearable.js';
import { CONTROL_SIZE_BOX_GROW, type ControlSize } from '../../control-size.js';

// ─── 文案缺省值（原 next-intl Common 命名空间文案的中文默认值） ──────────────────

const DEFAULT_PLACEHOLDER = '请选择';
const DEFAULT_SEARCH_PLACEHOLDER = '搜索…';
/** 过滤后无匹配结果时的空态文案 */
const DEFAULT_EMPTY_TEXT = '无匹配结果';
/** options 本身为空（无候选）时的空态文案 */
const NO_OPTIONS_TEXT = '无选项';

export interface SearchableSelectProps {
  value?: string | string[];
  /** 单选清除时回传 ""（不用 undefined：RHF 会移除 undefined 并回退到 defaultValue） */
  onChange?: (value: string | string[] | undefined) => void;
  options: Array<{ label: string; value: string }>;
  /** 未选值时的占位文案，缺省「请选择」 */
  placeholder?: string;
  /** 搜索框占位文案，缺省「搜索…」 */
  searchPlaceholder?: string;
  /** 过滤无匹配的空态文案，缺省「无匹配结果」 */
  emptyText?: string;
  disabled?: boolean;
  /** hover 清除（缺省开启，传 false 关闭；仅单选）：有选中值时悬停触发器，上下箭头替换为 ×，点击清空（回传 ""） */
  allowClear?: boolean;
  /** 控件尺寸（默认 middle，即现行 min-h-9 尺寸；与基础表单控件同一尺寸令牌） */
  size?: ControlSize;
  className?: string;
  id?: string;
  /** Whether to show the search input. When undefined, auto-show if options.length > 8. */
  showSearch?: boolean;
  /** Whether to allow multiple selection. */
  multiple?: boolean;
  /** 下拉选项完整显示：不截断字符，弹层宽度自适应内容 */
  fullOptionText?: boolean;
  /** 自定义下拉列表（CommandList）样式，如覆盖 max-h 限制 */
  listClassName?: string;
}

export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder,
  emptyText,
  disabled = false,
  allowClear = true,
  size = 'middle',
  className,
  id,
  showSearch,
  multiple = false,
  fullOptionText = false,
  listClassName,
}: SearchableSelectProps) {
  const resolvedPlaceholder = placeholder ?? DEFAULT_PLACEHOLDER;
  const resolvedSearchPlaceholder = searchPlaceholder ?? DEFAULT_SEARCH_PLACEHOLDER;
  const resolvedEmptyText = emptyText ?? DEFAULT_EMPTY_TEXT;
  const [open, setOpen] = React.useState(false);
  const shouldShowSearch = showSearch ?? options.length > 8;

  // Normalize value to array for multi-select
  const selectedValues: string[] = multiple
    ? Array.isArray(value) ? value : (value ? [value] : [])
    : [];

  const selectedLabel = React.useMemo(
    () => !multiple ? options.find((opt) => opt.value === value)?.label : undefined,
    [options, value, multiple],
  );

  const handleSelect = (optValue: string) => {
    if (!multiple) {
      onChange?.(optValue);
      setOpen(false);
      return;
    }
    const next = selectedValues.includes(optValue)
      ? selectedValues.filter((v) => v !== optValue)
      : [...selectedValues, optValue];
    onChange?.(next);
  };

  const handleRemove = (e: React.MouseEvent, optValue: string) => {
    e.stopPropagation();
    onChange?.(selectedValues.filter((v) => v !== optValue));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Base UI Popover.Trigger 默认渲染原生 <button>（取代原 Radix asChild +
          内层 button 的写法），props 直接落到该按钮上 */}
      <PopoverTrigger
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        disabled={disabled}
        className={cn(
          "group border-input bg-background ring-offset-background flex min-h-9 w-full items-center justify-between rounded-md border px-3 py-2 text-sm",
          "placeholder:text-muted-foreground min-w-32",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          CONTROL_SIZE_BOX_GROW[size],
          multiple && "flex-wrap gap-1",
          className,
        )}
      >
        {multiple ? (
          selectedValues.length > 0 ? (
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedValues.map((v) => {
                const label = options.find((o) => o.value === v)?.label ?? v;
                return (
                  <span
                    key={v}
                    className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs font-medium"
                  >
                    {label}
                    <X
                      className="h-3 w-3 cursor-pointer opacity-60 hover:opacity-100"
                      onClick={(e) => handleRemove(e, v)}
                    />
                  </span>
                );
              })}
            </div>
          ) : (
            <span className="text-muted-foreground flex-1 text-left">{resolvedPlaceholder}</span>
          )
        ) : (
          <span className={cn("truncate", !selectedLabel && "text-muted-foreground")}>
            {selectedLabel || resolvedPlaceholder}
          </span>
        )}
        {/* 单选已选值时：hover 用清除按钮替换上下箭头（清除回传 "" 而非
            undefined：RHF 下 undefined 会被移除并回退到 defaultValue） */}
        {allowClear && !multiple && !disabled && value !== undefined && value !== "" ? (
          <ClearHoverButton
            label="clear-selection"
            className="ml-2 rounded-sm opacity-50 hover:opacity-100"
            onClear={() => onChange?.("")}
          />
        ) : null}
        <ChevronsUpDown
          className={cn(
            "ml-2 h-4 w-4 shrink-0 opacity-50",
            allowClear &&
              !multiple &&
              !disabled &&
              value !== undefined &&
              value !== "" &&
              "group-hover:hidden",
          )}
        />
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "p-0",
          // Base UI Positioner 在定位元素上暴露 --anchor-width（原 Radix 的
          // --radix-popover-trigger-width 在 Base UI 下不存在，会退化为 auto 宽度）
          fullOptionText
            ? "w-auto min-w-(--anchor-width)"
            : "w-(--anchor-width)",
        )}
        align="start"
        // 弹层 portal 到 body 后，滚轮/触摸事件会被外层 Dialog/Drawer 的滚动锁
        // （react-remove-scroll）在 document 层拦截，导致列表无法滚动；在此阻断冒泡
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <Command value={!multiple ? selectedLabel : undefined}>
          {shouldShowSearch && <CommandInput placeholder={resolvedSearchPlaceholder} />}
          <CommandList className={listClassName}>
            <CommandEmpty>
              {options.length === 0 ? NO_OPTIONS_TEXT : resolvedEmptyText}
            </CommandEmpty>
            <CommandGroup>
              {options.map((opt) => {
                const isSelected = multiple
                  ? selectedValues.includes(opt.value)
                  : value === opt.value;
                return (
                  <CommandItem
                    key={opt.value}
                    value={opt.label}
                    onSelect={() => handleSelect(opt.value)}
                    className="flex items-center justify-between"
                  >
                    <span className={cn(fullOptionText ? "whitespace-normal" : "truncate")}>{opt.label}</span>
                    <Check
                      className={cn(
                        "ml-2 h-4 w-4 shrink-0",
                        isSelected ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
