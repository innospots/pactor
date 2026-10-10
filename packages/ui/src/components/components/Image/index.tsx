import { useI18n } from '@pactor-app/runtime';
import { useState, type CSSProperties, type ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';
import {
  Dialog as ShadcnDialog,
  DialogContent,
  DialogTitle,
} from '../../../ui/dialog.js';
import { Icon } from '../Icon/index.js';

export interface ImageProps {
  /** 图片地址 */
  src?: string;
  /** 替代文本 */
  alt?: string;
  /** 宽度（px 或 CSS 长度） */
  width?: number | string;
  /** 高度（px 或 CSS 长度） */
  height?: number | string;
  /** 加载失败时显示的内容；缺省为图标 + 灰色占位块 */
  fallback?: ReactNode;
  /** 点击经 Dialog 弹层放大预览，缺省 true */
  preview?: boolean;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * Image 适配器（shadcn kit）：加载失败渲染 fallback（缺省灰色占位块）；
 * preview 开启时点击经 vendored Dialog 弹层放大查看（居中大图，可关闭）。
 */
export function Image({
  src,
  alt = '',
  width,
  height,
  fallback,
  preview = true,
  className,
  style,
}: ImageProps) {
  const [failed, setFailed] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { t } = useI18n();

  const sizeStyle: CSSProperties = {
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
    ...style,
  };

  if (failed || !src) {
    return (
      <div
        data-slot="image-fallback"
        className={cn(
          'flex size-24 items-center justify-center rounded-md bg-muted text-muted-foreground',
          className,
        )}
        style={sizeStyle}
      >
        {fallback ?? <Icon name="image" size="lg" />}
      </div>
    );
  }

  return (
    <>
      <img
        data-slot="image"
        src={src}
        alt={alt}
        width={typeof width === 'number' ? width : undefined}
        height={typeof height === 'number' ? height : undefined}
        onError={() => setFailed(true)}
        onClick={preview ? () => setPreviewOpen(true) : undefined}
        className={cn('rounded-md', preview && 'cursor-zoom-in', className)}
        style={sizeStyle}
      />
      {preview ? (
        <ShadcnDialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="sm:max-w-3xl" aria-label={alt || t('pactor.image.preview')}>
            <DialogTitle className="sr-only">{alt || t('pactor.image.preview')}</DialogTitle>
            <img
              data-slot="image-preview"
              src={src}
              alt={alt}
              className="max-h-[80vh] w-full object-contain"
            />
          </DialogContent>
        </ShadcnDialog>
      ) : null}
    </>
  );
}
