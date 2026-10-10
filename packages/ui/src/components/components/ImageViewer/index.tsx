import { useI18n } from '@pactor-app/runtime';
import { useCallback, useEffect, useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Icon } from '../Icon/index.js';

export interface ImageViewerProps {
  /** 图片地址 */
  src?: string;
  /** 替代文本 */
  alt?: string;
  /** 是否允许点击放大查看（灯箱：缩放 / 旋转 / 复位），默认 true */
  preview?: boolean;
  /** 灯箱关闭事件（Renderer 绑定 events.onClose） */
  onClose?: () => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

export interface ImageLightboxProps {
  src?: string;
  alt?: string;
  /** 当前序号（从 1 起）与总数；提供 count > 1 时显示序号与前后切换 */
  index?: number;
  count?: number;
  onPrev?: () => void;
  onNext?: () => void;
  onClose: () => void;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 4;

const toolButtonClass =
  'flex size-9 items-center justify-center rounded-md text-foreground hover:bg-accent disabled:pointer-events-none disabled:opacity-50';

/**
 * 图片灯箱（ImageViewer / Gallery 共享，不注册为 DSL 组件）：
 * 覆盖层 + 居中图片（scale / rotate 变换）+ 工具条（放大 / 缩小 / 旋转 /
 * 复位 / 关闭）+ 可选前后切换与序号；Esc 或点击遮罩关闭。
 */
export function ImageLightbox({ src, alt, index, count, onPrev, onNext, onClose }: ImageLightboxProps) {
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const { t } = useI18n();

  const reset = useCallback(() => {
    setScale(1);
    setRotate(0);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  // 切换图片时复位变换
  useEffect(() => {
    reset();
  }, [src, reset]);

  return (
    <div
      data-slot="image-lightbox"
      className="fixed inset-0 z-50 flex flex-col bg-(--overlay-background)"
      role="dialog"
      aria-modal="true"
      aria-label={t('pactor.imageViewer.open')}
    >
      <button
        type="button"
        aria-label={t('pactor.overlay.close')}
        className="absolute inset-0 cursor-zoom-out"
        onClick={onClose}
      />
      {count !== undefined && count > 1 && index !== undefined ? (
        <div
          data-slot="image-lightbox-indicator"
          className="pointer-events-none absolute top-4 left-1/2 z-10 -translate-x-1/2 rounded-md bg-background/80 px-2 py-1 text-xs text-foreground"
        >
          {index} / {count}
        </div>
      ) : null}
      <div className="pointer-events-none relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        {src ? (
          <img
            data-slot="image-lightbox-img"
            src={src}
            alt={alt ?? ''}
            className="pointer-events-none max-h-full max-w-full object-contain transition-transform duration-200"
            style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
          />
        ) : null}
      </div>
      {onPrev ? (
        <button
          type="button"
          data-slot="image-lightbox-prev"
          aria-label={t('pactor.imageViewer.prev')}
          className={cn(toolButtonClass, 'absolute top-1/2 left-4 z-10 -translate-y-1/2 bg-background/80')}
          onClick={onPrev}
        >
          <Icon name="chevron-left" />
        </button>
      ) : null}
      {onNext ? (
        <button
          type="button"
          data-slot="image-lightbox-next"
          aria-label={t('pactor.imageViewer.next')}
          className={cn(toolButtonClass, 'absolute top-1/2 right-4 z-10 -translate-y-1/2 bg-background/80')}
          onClick={onNext}
        >
          <Icon name="chevron-right" />
        </button>
      ) : null}
      <div
        data-slot="image-lightbox-toolbar"
        className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-md bg-background/80 p-1 shadow-md"
      >
        <button
          type="button"
          data-slot="image-lightbox-zoom-out"
          aria-label={t('pactor.imageViewer.zoomOut')}
          className={toolButtonClass}
          disabled={scale <= MIN_SCALE}
          onClick={() => setScale((value) => Math.max(MIN_SCALE, value - 0.5))}
        >
          <Icon name="zoom-out" size="sm" />
        </button>
        <button
          type="button"
          data-slot="image-lightbox-zoom-in"
          aria-label={t('pactor.imageViewer.zoomIn')}
          className={toolButtonClass}
          disabled={scale >= MAX_SCALE}
          onClick={() => setScale((value) => Math.min(MAX_SCALE, value + 0.5))}
        >
          <Icon name="zoom-in" size="sm" />
        </button>
        <button
          type="button"
          data-slot="image-lightbox-rotate"
          aria-label={t('pactor.imageViewer.rotate')}
          className={toolButtonClass}
          onClick={() => setRotate((value) => value - 90)}
        >
          <Icon name="rotate-ccw" size="sm" />
        </button>
        <button
          type="button"
          data-slot="image-lightbox-reset"
          aria-label={t('pactor.imageViewer.reset')}
          className={toolButtonClass}
          onClick={reset}
        >
          <Icon name="refresh-ccw" size="sm" />
        </button>
        <button
          type="button"
          data-slot="image-lightbox-close"
          aria-label={t('pactor.imageViewer.close')}
          className={toolButtonClass}
          onClick={onClose}
        >
          <Icon name="x" size="sm" />
        </button>
      </div>
    </div>
  );
}

/**
 * ImageViewer 适配器（shadcn kit）：单图查看器——行内图片 +
 * 点击打开灯箱（缩放 / 旋转 / 复位 / Esc 与遮罩关闭）。
 * 与数据展示分类 Image 的差异：本组件面向「查看」，Image 面向「展示」。
 */
export function ImageViewer({ src, alt, preview = true, onClose, className, style }: ImageViewerProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  return (
    <span data-slot="image-viewer" className={cn('inline-block', className)} style={style}>
      {src ? (
        <img
          data-slot="image-viewer-img"
          src={src}
          alt={alt ?? ''}
          className={cn('max-w-full rounded-md', preview && 'cursor-zoom-in')}
          onClick={preview ? () => setOpen(true) : undefined}
        />
      ) : null}
      {open && src ? <ImageLightbox src={src} alt={alt} onClose={close} /> : null}
    </span>
  );
}
