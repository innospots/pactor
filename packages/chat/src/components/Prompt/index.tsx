import type { CSSProperties } from 'react';

import { cn } from '../../lib/utils.js';
import { Icon } from '@pactor-app/ui/components';

export interface PromptProps {
  /** 提示词标题 */
  title?: string;
  /** 补充描述 */
  description?: string;
  /** 前缀图标名（Icon 白名单） */
  icon?: string;
  /** 点击传出值（缺省取 title） */
  value?: string;
  /** 禁用 */
  disabled?: boolean;
  /** 选择事件（Renderer 绑定 events.onSelect） */
  onSelect?: (value: string) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * Prompt 适配器（shadcn kit）：可复用提示词 / 任务入口卡片——
 * 图标 + 标题 + 描述，点击经 onSelect 传出 value（缺省取 title）。
 */
export function Prompt({ title, description, icon, value, disabled, onSelect, className, style }: PromptProps) {
  return (
    <button
      type="button"
      data-slot="prompt"
      disabled={disabled}
      className={cn(
        'flex items-start gap-2.5 rounded-md border border-border p-3 text-left transition-colors hover:border-primary disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      style={style}
      onClick={() => onSelect?.(value ?? title ?? '')}
    >
      {icon ? (
        <span className="mt-0.5 shrink-0 text-primary">
          <Icon name={icon} size="sm" />
        </span>
      ) : null}
      <span className="min-w-0">
        <span data-slot="prompt-title" className="block text-sm font-medium">
          {title}
        </span>
        {description ? (
          <span data-slot="prompt-description" className="mt-0.5 block text-xs text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
    </button>
  );
}
