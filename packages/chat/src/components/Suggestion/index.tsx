import { useI18n } from '@pactor-app/runtime';
import type { CSSProperties } from 'react';

import { cn } from '../../lib/utils.js';
import { Icon } from '@pactor-app/ui/components';

/** 建议项：字符串或 { label, value?, icon? }（value 缺省取 label） */
export type SuggestionItem = string | { label: string; value?: string; icon?: string };

export interface SuggestionProps {
  /** 建议列表（可含表达式解析后的数组） */
  items?: SuggestionItem[];
  /** 水平对齐，默认 start */
  justify?: 'start' | 'center';
  /** 选择事件，传出选中项 value（Renderer 绑定 events.onSelect） */
  onSelect?: (value: string) => void;
  /** 刷新建议（提供时 chips 末尾展示刷新按钮；加载逻辑由宿主实现） */
  onRefresh?: () => void;
  /** 刷新中：按钮旋转并禁用，防止重复触发 */
  refreshing?: boolean;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

function normalize(item: SuggestionItem): { label: string; value: string; icon?: string } {
  if (typeof item === 'string') return { label: item, value: item };
  return { label: item.label, value: item.value ?? item.label, icon: item.icon };
}

/**
 * Suggestion 适配器（shadcn kit）：追问 / 下一步建议 chips——
 * 圆角描边小按钮横向排列（可换行），点击经 onSelect 传出 value。
 */
export function Suggestion({
  items = [],
  justify = 'start',
  onSelect,
  onRefresh,
  refreshing = false,
  className,
  style,
}: SuggestionProps) {
  const { t } = useI18n();
  return (
    <div
      data-slot="suggestion"
      className={cn('flex flex-wrap gap-2', justify === 'center' && 'justify-center', className)}
      style={style}
    >
      {items.map((item, index) => {
        const { label, value, icon } = normalize(item);
        return (
          <button
            key={`${value}-${index}`}
            type="button"
            data-slot="suggestion-item"
            data-value={value}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm transition-colors hover:bg-accent"
            onClick={() => onSelect?.(value)}
          >
            {icon ? <Icon name={icon} size="sm" /> : null}
            {label}
          </button>
        );
      })}
      {onRefresh ? (
        <button
          type="button"
          data-slot="suggestion-refresh"
          aria-label={
            refreshing
              ? t('pactor.chat.suggestion.refreshing')
              : t('pactor.chat.suggestion.refresh')
          }
          aria-busy={refreshing}
          disabled={refreshing}
          className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-60"
          onClick={onRefresh}
        >
          <span
            className={cn(
              refreshing && 'animate-spin motion-reduce:animate-none',
            )}
          >
            <Icon name="refresh-cw" size="sm" />
          </span>
        </button>
      ) : null}
    </div>
  );
}
