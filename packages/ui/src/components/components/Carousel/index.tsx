import type { DslNode } from '@pactor-app/core';
import { useRenderer } from '@pactor-app/runtime';
import { useEffect, useState, type CSSProperties } from 'react';

import {
  Carousel as ShadcnCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '../../../ui/carousel.js';

/** 轮播图片项 */
export interface CarouselImage {
  src: string;
  alt?: string;
}

/** Carousel items 元素：图片对象或 DSL 子树 */
export type CarouselItemData = CarouselImage | DslNode;

export interface CarouselProps {
  /** 轮播项：图片 `{ src, alt }` 数组或 DSL 子树数组（经 renderChildren 渲染） */
  items?: CarouselItemData[];
  /** 循环滚动 */
  loop?: boolean;
  /** 自动播放：true 用默认间隔（3000ms），数字为间隔毫秒数 */
  autoplay?: boolean | number;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

function isDslNode(item: CarouselItemData): item is DslNode {
  return typeof (item as DslNode).type === 'string';
}

/**
 * Carousel 适配器（shadcn kit）：基于 vendored Carousel（embla-carousel-react）；
 * items 支持图片对象或 DSL 子树；`loop` 映射 embla loop；
 * `autoplay` 以定时器驱动 scrollNext（loop 时回绕），不引入额外插件依赖。
 */
export function Carousel({
  items = [],
  loop,
  autoplay,
  className,
  style,
}: CarouselProps) {
  const { renderChildren } = useRenderer();
  const [api, setApi] = useState<CarouselApi>();

  // 自动播放：间隔滚动；循环开启时到末尾回绕，否则停在末页
  useEffect(() => {
    if (!api || !autoplay) return;
    const interval = typeof autoplay === 'number' ? autoplay : 3000;
    const timer = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else if (loop) {
        api.scrollTo(0);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [api, autoplay, loop]);

  return (
    <ShadcnCarousel
      opts={{ loop: loop === true }}
      setApi={setApi}
      className={className}
      style={style}
    >
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem key={index}>
            {isDslNode(item) ? (
              renderChildren([item])
            ) : (
              <img
                src={item.src}
                alt={item.alt ?? ''}
                className="w-full rounded-md object-cover"
              />
            )}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </ShadcnCarousel>
  );
}
