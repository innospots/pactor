import { useI18n } from '@pactor-app/runtime';
import { useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../ui/popover.js';
import { Icon } from '../Icon/index.js';

/** ChipSelect 可选维度 */
export interface ChipSelectItem {
  /** 提交值 */
  value: string;
  /** 展示文案 */
  text: string;
  /** 单个维度禁用 */
  disabled?: boolean;
}

export interface ChipSelectProps {
  /** 可选维度列表（表达式解析后的数组） */
  items?: ChipSelectItem[];
  /** 已选值数组（受控） */
  value?: string[];
  /** 选择变化：传出全部已选值（追加 / 删除后的新数组） */
  onChange?: (value: string[]) => void;
  /** 浮层标题（如「添加筛选（选一个维度）」） */
  title?: string;
  /** 触发器文案 */
  triggerText?: string;
  /** 触发器图标（Icon 白名单，缺省 plus） */
  triggerIcon?: string;
  /** 已选筛选项内的图标（如 funnel），不传则不渲染 */
  chipIcon?: string;
  /** 触发器 class：定制高度 / 圆角等设计稿样式 */
  triggerClassName?: string;
  /** 浮层 class：定制浮层宽度 / 内边距等设计稿样式 */
  panelClassName?: string;
  /** 通用：根节点 class */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * ChipSelect 适配器（shadcn kit）：触发器打开浮层，浮层内以 Chip 网格
 * 罗列可选维度；点选一个维度即追加到 value 并关闭浮层。已选项在触发器
 * 旁渲染为可关闭 Chip，点右侧 x 从 value 移除。已选维度在浮层内以
 * 「已选」态展示（对勾 + 主色），再次点选不会重复追加。
 *
 * 选择逻辑由组件内部完成（表达式引擎不支持数组方法），DSL 只需把
 * onChange 接到 setState：
 *   { type: 'ChipSelect',
 *     props: { items: [...], value: '${state.filters}',
 *              triggerText: '筛选', title: '添加筛选（选一个维度）' },
 *     events: { onChange: { action: 'setState', params: { filters: '${event}' } } } }
 */
export function ChipSelect({
  items,
  value,
  onChange,
  title,
  triggerText,
  triggerIcon = 'plus',
  chipIcon,
  triggerClassName,
  panelClassName,
  className,
  style,
}: ChipSelectProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const options = Array.isArray(items) ? items : [];
  const selected = Array.isArray(value) ? value : [];
  const selectedItems = selected.map(
    (item) =>
      options.find((option) => option.value === item) ?? {
        value: item,
        text: item,
      },
  );

  const addItem = (item: ChipSelectItem) => {
    if (selected.includes(item.value)) return;
    onChange?.([...selected, item.value]);
    setOpen(false);
  };

  const removeItem = (item: string) => {
    onChange?.(selected.filter((current) => current !== item));
  };

  return (
    <div
      data-slot="chip-select"
      className={cn('flex min-w-0 flex-wrap items-center gap-2', className)}
      style={style}
    >
      {selectedItems.map((item) => (
        <div
          key={item.value}
          data-slot="chip-select-chip"
          className="inline-flex h-9 min-w-0 items-stretch overflow-hidden rounded-lg border border-border bg-card"
        >
          <span
            data-slot="chip-select-chip-body"
            className="flex min-w-0 flex-1 items-center justify-between gap-4 px-3"
          >
            <span
              data-slot="chip-select-chip-text"
              className="truncate text-sm text-foreground"
            >
              {item.text}
            </span>
            {chipIcon ? (
              <Icon
                name={chipIcon}
                size="sm"
                className="shrink-0 text-muted-foreground"
              />
            ) : null}
          </span>
          <button
            type="button"
            data-slot="chip-select-chip-remove"
            aria-label={t('pactor.chipSelect.remove', { text: item.text })}
            className="flex w-9 shrink-0 cursor-pointer items-center justify-center border-l border-border text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
            onClick={() => removeItem(item.value)}
          >
            <Icon name="x" size="sm" />
          </button>
        </div>
      ))}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          type="button"
          data-slot="chip-select-trigger"
          className={cn(
            'inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-border bg-card px-3.5 text-sm font-medium text-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
            triggerClassName,
          )}
        >
          <Icon name={triggerIcon} size="sm" />
          {triggerText}
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="start"
          sideOffset={8}
          className={cn(
            'w-[760px] max-w-[calc(100vw-24px)] p-4',
            panelClassName,
          )}
        >
          <div data-slot="chip-select-panel">
            {title ? (
              <div
                data-slot="chip-select-title"
                className="mb-3 text-base font-semibold text-foreground"
              >
                {title}
              </div>
            ) : null}
            <div
              data-slot="chip-select-options"
              className="flex max-h-[min(440px,calc(100dvh-220px))] flex-wrap content-start gap-2 overflow-y-auto"
            >
              {options.map((item) => {
                const isSelected = selected.includes(item.value);
                return (
                  <button
                    key={item.value}
                    type="button"
                    data-slot="chip-select-option"
                    data-selected={isSelected || undefined}
                    aria-pressed={isSelected}
                    aria-disabled={isSelected || item.disabled || undefined}
                    disabled={item.disabled}
                    onClick={() => addItem(item)}
                    className={cn(
                      'inline-flex h-8 max-w-full shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-muted px-3 text-sm whitespace-nowrap text-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
                      isSelected &&
                        'cursor-default border border-primary/40 bg-primary/10 text-primary hover:bg-primary/10',
                    )}
                  >
                    {isSelected ? (
                      <Icon name="check" size="sm" className="shrink-0" />
                    ) : null}
                    {item.text}
                  </button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
