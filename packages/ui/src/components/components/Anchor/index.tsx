import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';

import { cn } from '../../../lib/utils.js';

export interface AnchorItemData {
  /** 目标锚点，形如 `#section-id` */
  href: string;
  /** 链接文案 */
  title: string;
  /** 嵌套子链接 */
  children?: AnchorItemData[];
}

export interface AnchorProps {
  /** 锚点链接列表（可含表达式解析后的数组） */
  items?: AnchorItemData[];
  /** 受控：当前激活链接 href；提供时点击 / scroll-spy 仅经 onChange 上报，激活态完全由外部驱动 */
  activeKey?: string;
  /** 激活项变化事件（点击或滚动定位），传出 href（Renderer 绑定 events.onChange） */
  onChange?: (href: string) => void;
  /** 滚动定位时距离视口顶部的偏移（如有固定头部），默认 0 */
  offsetTop?: number;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

function flatten(items: AnchorItemData[]): AnchorItemData[] {
  return items.flatMap((item) => [item, ...flatten(item.children ?? [])]);
}

/**
 * Anchor 适配器（shadcn kit）：长页面章节点定位；点击平滑滚动到目标，
 * 监听 window 滚动做 scroll-spy（取最后一个顶部越过 offsetTop 的章节）。
 * 非受控（未传 activeKey）时内部维护激活态；受控时激活态完全由
 * activeKey 驱动，变化仅经 onChange 上报（去重：与当前激活项相同不重复触发）。
 */
export function Anchor({ items = [], activeKey, onChange, offsetTop = 0, className, style }: AnchorProps) {
  const [innerActive, setInnerActive] = useState<string>(items[0]?.href ?? '');
  const activeHref = activeKey ?? innerActive;
  const lastReported = useRef(activeHref);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    lastReported.current = activeHref;
  }, [activeHref]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const links = flatten(items);
    if (links.length === 0) return;

    const apply = (fire: boolean) => {
      let current = links[0]?.href ?? '';
      for (const link of links) {
        const el = document.getElementById(link.href.replace(/^#/, ''));
        if (el && el.getBoundingClientRect().top <= offsetTop + 1) {
          current = link.href;
        }
      }
      if (activeKey === undefined) {
        setInnerActive(current);
      }
      // 去重：仅真实滚动导致定位变化时上报（挂载 / 重渲染的对齐计算不触发 onChange）
      if (current !== lastReported.current) {
        lastReported.current = current;
        if (fire) onChangeRef.current?.(current);
      }
    };

    apply(false);
    const onScroll = () => apply(true);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [items, activeKey, offsetTop]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    const el = document.getElementById(href.replace(/^#/, ''));
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - offsetTop;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    if (activeKey === undefined) {
      setInnerActive(href);
    }
    if (href !== lastReported.current) {
      lastReported.current = href;
      onChangeRef.current?.(href);
    }
  };

  const renderItems = (list: AnchorItemData[], depth: number) => (
    <ul data-slot="anchor-list" className={cn(depth > 0 && 'mt-1 flex flex-col gap-1')}>
      {list.map((item) => (
        <li key={item.href} className={cn(depth > 0 && 'pl-4')}>
          <a
            data-slot="anchor-link"
            data-active={item.href === activeHref || undefined}
            href={item.href}
            onClick={(event) => handleClick(event, item.href)}
            className={cn(
              '-ml-px block border-l-2 py-1 pl-3 text-sm transition-colors',
              item.href === activeHref
                ? 'border-primary font-medium text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {item.title}
          </a>
          {item.children?.length ? renderItems(item.children, depth + 1) : null}
        </li>
      ))}
    </ul>
  );

  return (
    <nav
      data-slot="anchor"
      className={cn('flex flex-col gap-1 border-l border-border', className)}
      style={style}
    >
      {renderItems(items, 0)}
    </nav>
  );
}
