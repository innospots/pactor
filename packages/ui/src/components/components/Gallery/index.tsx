import { useCallback, useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { ImageLightbox } from '../ImageViewer/index.js';

export interface GalleryItemData {
  /** 图片地址 */
  src: string;
  /** 替代文本 */
  alt?: string;
  /** 图片说明（缩略图底部一行） */
  caption?: string;
}

export interface GalleryProps {
  /** 图片列表（可含表达式解析后的数组） */
  items?: GalleryItemData[];
  /** 缩略图列数，默认 3 */
  columns?: 2 | 3 | 4;
  /** 灯箱关闭事件（Renderer 绑定 events.onClose） */
  onClose?: () => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

const columnsClass: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

/**
 * Gallery 适配器（shadcn kit）：多图浏览——缩略图栅格 +
 * 点击打开灯箱（与 ImageViewer 共享 ImageLightbox，含前后切换与序号）。
 */
export function Gallery({ items = [], columns = 3, onClose, className, style }: GalleryProps) {
  const [current, setCurrent] = useState<number | null>(null);

  const close = useCallback(() => {
    setCurrent(null);
    onClose?.();
  }, [onClose]);

  const active = current !== null ? items[current] : undefined;

  return (
    <div data-slot="gallery" className={cn('w-full', className)} style={style}>
      <div className={cn('grid gap-3', columnsClass[columns] ?? columnsClass[3])}>
        {items.map((item, index) => (
          <figure key={index} data-slot="gallery-item" className="m-0">
            <img
              src={item.src}
              alt={item.alt ?? ''}
              className="aspect-square w-full cursor-zoom-in rounded-md object-cover"
              onClick={() => setCurrent(index)}
            />
            {item.caption ? (
              <figcaption className="mt-1 truncate text-xs text-muted-foreground">
                {item.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
      {active ? (
        <ImageLightbox
          src={active.src}
          alt={active.alt}
          index={current! + 1}
          count={items.length}
          onPrev={current! > 0 ? () => setCurrent(current! - 1) : undefined}
          onNext={current! < items.length - 1 ? () => setCurrent(current! + 1) : undefined}
          onClose={close}
        />
      ) : null}
    </div>
  );
}
