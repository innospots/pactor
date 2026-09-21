import { useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Icon } from '../Icon/index.js';

/** 文档页：src 渲染图片页，content 渲染文本页（二者择一，src 优先） */
export interface DocumentPageData {
  src?: string;
  content?: string;
}

export interface DocumentPreviewProps {
  /** 分页内容（可含表达式解析后的数组）；不解析 PDF 等二进制格式 */
  pages?: DocumentPageData[];
  /** 受控：当前页码（从 1 起）；提供时翻页仅经 onChange 上报 */
  currentPage?: number;
  /** 翻页事件，传出目标页码（Renderer 绑定 events.onChange） */
  onChange?: (page: number) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 2;

const toolButtonClass =
  'flex size-8 items-center justify-center rounded-md hover:bg-accent disabled:pointer-events-none disabled:opacity-50';

/**
 * DocumentPreview 适配器（shadcn kit）：分页文档阅读器——
 * 图片页 / 文本页 + 翻页（受控可选）+ 缩放工具条 + 页码指示。
 */
export function DocumentPreview({ pages = [], currentPage, onChange, className, style }: DocumentPreviewProps) {
  const [innerPage, setInnerPage] = useState(1);
  const [scale, setScale] = useState(1);

  const total = pages.length;
  const page = Math.min(Math.max(currentPage ?? innerPage, 1), Math.max(total, 1));
  const active = total > 0 ? pages[page - 1] : undefined;

  const goTo = (target: number) => {
    const next = Math.min(Math.max(target, 1), total);
    if (currentPage === undefined) {
      setInnerPage(next);
    }
    if (next !== page) {
      onChange?.(next);
    }
  };

  return (
    <div
      data-slot="document-preview"
      className={cn('flex w-full flex-col overflow-hidden rounded-md border border-border', className)}
      style={style}
    >
      <div
        data-slot="document-preview-toolbar"
        className="flex items-center gap-1 border-b border-border px-2 py-1"
      >
        <button
          type="button"
          data-slot="document-preview-prev"
          aria-label="上一页"
          className={toolButtonClass}
          disabled={page <= 1}
          onClick={() => goTo(page - 1)}
        >
          <Icon name="chevron-left" size="sm" />
        </button>
        <span data-slot="document-preview-indicator" className="px-1 text-xs text-muted-foreground">
          {total > 0 ? `${page} / ${total}` : '0 / 0'}
        </span>
        <button
          type="button"
          data-slot="document-preview-next"
          aria-label="下一页"
          className={toolButtonClass}
          disabled={page >= total}
          onClick={() => goTo(page + 1)}
        >
          <Icon name="chevron-right" size="sm" />
        </button>
        <span className="mx-1 h-4 w-px bg-border" />
        <button
          type="button"
          data-slot="document-preview-zoom-out"
          aria-label="缩小"
          className={toolButtonClass}
          disabled={scale <= MIN_SCALE}
          onClick={() => setScale((value) => Math.max(MIN_SCALE, value - 0.25))}
        >
          <Icon name="zoom-out" size="sm" />
        </button>
        <button
          type="button"
          data-slot="document-preview-zoom-in"
          aria-label="放大"
          className={toolButtonClass}
          disabled={scale >= MAX_SCALE}
          onClick={() => setScale((value) => Math.min(MAX_SCALE, value + 0.25))}
        >
          <Icon name="zoom-in" size="sm" />
        </button>
      </div>
      <div data-slot="document-preview-body" className="flex max-h-[32rem] justify-center overflow-auto bg-muted p-4">
        {active ? (
          active.src ? (
            <img
              data-slot="document-preview-page"
              src={active.src}
              alt={`第 ${page} 页`}
              className="max-w-full object-contain"
              style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
            />
          ) : (
            <div
              data-slot="document-preview-page"
              className="w-full max-w-2xl rounded-sm bg-background p-6 text-sm leading-relaxed shadow-sm"
              style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
            >
              <p className="whitespace-pre-wrap">{active.content}</p>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center p-10 text-sm text-muted-foreground">
            暂无文档内容
          </div>
        )}
      </div>
    </div>
  );
}
