import { useI18n } from '@pactor-app/runtime';
import type { CSSProperties } from 'react';

import { cn } from '../../lib/utils.js';
import { inferKind } from '@pactor-app/ui/components';
import { Icon } from '@pactor-app/ui/components';

/** 会话附件项 */
export interface AttachmentItemData {
  /** 唯一标识（onRemove / onRetry 传出；缺省传出数组下标） */
  id?: string;
  name: string;
  /** 大小（字节） */
  fileSize?: number;
  /** MIME 或扩展名（类别图标推断） */
  fileType?: string;
  /** 状态，默认 done */
  status?: 'uploading' | 'done' | 'error';
  /** 上传进度（0-100，status=uploading 时展示） */
  progress?: number;
}

export interface AttachmentProps {
  /** 附件列表（可含表达式解析后的数组） */
  items?: AttachmentItemData[];
  /** 移除事件，传出 id（无 id 传下标）；提供时展示移除按钮 */
  onRemove?: (id: string | number) => void;
  /** 重试事件（status=error 时展示重试按钮），传出 id / 下标 */
  onRetry?: (id: string | number) => void;
  /** 卡片点击事件（预览等由调用方实现），传出该附件项 */
  onClick?: (item: AttachmentItemData) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

const kindIcon = { image: 'image', text: 'file-text', video: 'video', audio: 'music', other: 'file' } as const;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * Attachment 适配器（shadcn kit）：会话附件 chip 组——
 * 类别图标（复用 FilePreview 的推断）+ 名称 + 大小 + 状态
 * （uploading 进度条 / error 重试）+ 可移除。
 * 上传与存储由调用方负责，本组件只做呈现与事件上报。
 */
export function Attachment({ items = [], onRemove, onRetry, onClick, className, style }: AttachmentProps) {
  const { t } = useI18n();
  return (
    <div data-slot="attachment" className={cn('flex flex-wrap gap-2', className)} style={style}>
      {items.map((item, index) => {
        const key = item.id ?? index;
        const kind = inferKind(item.name, item.fileType);
        const status = item.status ?? 'done';
        return (
          <div
            key={key}
            data-slot="attachment-item"
            data-status={status}
            className={cn(
              'flex w-56 flex-col rounded-md border border-border px-2 py-1.5',
              onClick && 'cursor-pointer',
            )}
            onClick={onClick ? () => onClick(item) : undefined}
          >
            <div className="flex items-center gap-1.5">
              <span className="shrink-0 text-muted-foreground">
                <Icon name={kindIcon[kind]} size="sm" />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm">{item.name}</span>
              {status === 'uploading' ? (
                <span className="shrink-0 animate-spin text-muted-foreground motion-reduce:animate-none">
                  <Icon name="loader-circle" size="sm" />
                </span>
              ) : null}
              {status === 'error' && onRetry ? (
                <button
                  type="button"
                  data-slot="attachment-retry"
                  aria-label={t('pactor.chat.attachment.retry', { name: item.name })}
                  className="shrink-0 text-destructive hover:opacity-80"
                  onClick={(event) => {
                    event.stopPropagation();
                    onRetry(key);
                  }}
                >
                  <Icon name="refresh-ccw" size="sm" />
                </button>
              ) : null}
              {onRemove ? (
                <button
                  type="button"
                  data-slot="attachment-remove"
                  aria-label={t('pactor.chat.attachment.remove', { name: item.name })}
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                  onClick={(event) => {
                    event.stopPropagation();
                    onRemove(key);
                  }}
                >
                  <Icon name="x" size="sm" />
                </button>
              ) : null}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 pl-5 text-xs">
              {item.fileSize !== undefined ? (
                <span className="text-muted-foreground">{formatSize(item.fileSize)}</span>
              ) : null}
              {status === 'error' ? (
                <span className="text-destructive">
                  {t('pactor.chat.attachment.uploadFailed')}
                </span>
              ) : null}
            </div>
            {status === 'uploading' && item.progress !== undefined ? (
              <div data-slot="attachment-progress" className="mt-1 ml-5 h-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary transition-[width]" style={{ width: `${item.progress}%` }} />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
