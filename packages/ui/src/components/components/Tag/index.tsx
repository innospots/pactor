import { X } from 'lucide-react';
import { useI18n } from '@pactor-app/runtime';
import { useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Icon } from '../Icon/index.js';

/** DSL Tag 语义色 */
export type TagColor = 'default' | 'success' | 'warning' | 'error' | 'info';

export interface TagProps {
  /** 标签文本 */
  text?: string;
  /** 语义色，默认 default */
  color?: TagColor;
  /** 是否描边，默认 true（antd bordered） */
  bordered?: boolean;
  /** 是否可关闭；点击关闭按钮触发 onClose 并隐藏自身 */
  closable?: boolean;
  /** 关闭事件（Renderer 绑定 events.onClose） */
  onClose?: () => void;
  /** 前缀图标名（Icon 白名单，kebab-case / PascalCase 均可） */
  icon?: string;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

const colorClass: Record<TagColor, string> = {
  default: 'border-border bg-muted text-foreground',
  success: 'border-success/50 bg-success/10 text-success',
  warning: 'border-warning/50 bg-warning/10 text-warning',
  error: 'border-destructive/50 bg-destructive/10 text-destructive',
  info: 'border-info/50 bg-info/10 text-info',
};

/**
 * Tag 适配器（shadcn kit）：语义色小标签；closable 时尾部渲染关闭按钮，
 * 点击触发 onClose 并在非受控场景隐藏自身（DSL 侧可通过 events.onClose
 * 同步更新数据源实现受控移除）。
 */
export function Tag({
  text,
  color = 'default',
  bordered = true,
  closable,
  onClose,
  icon,
  className,
  style,
}: TagProps) {
  const [hidden, setHidden] = useState(false);
  const { t } = useI18n();
  if (hidden) return null;

  return (
    <span
      data-slot="tag"
      data-color={color}
      className={cn(
        'inline-flex w-fit items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        bordered && 'border',
        colorClass[color],
        className,
      )}
      style={style}
    >
      {icon ? <Icon name={icon} size="sm" /> : null}
      {text}
      {closable ? (
        <button
          type="button"
          data-slot="tag-close"
          aria-label={t('pactor.overlay.close')}
          className="-mr-0.5 inline-flex size-3.5 items-center justify-center rounded-sm opacity-70 hover:opacity-100"
          onClick={() => {
            onClose?.();
            setHidden(true);
          }}
        >
          <X className="size-3" />
        </button>
      ) : null}
    </span>
  );
}
