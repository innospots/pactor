import { useRenderer } from '@pactor-app/runtime';
import type { MouseEvent } from 'react';

/**
 * 站内链接点击拦截判定（SPA 导航，设计见 embedded-page-view spec）：
 * 组件仍渲染 `<a href>` 保留原生语义（SEO、中键/Cmd+点击新窗口、右键
 * 复制链接、屏幕阅读器），仅拦截「左键 + 无修饰键 + 站内路径（`/` 开头）+
 * target 缺省或 `_self`」的点击；外链（http(s)://）、锚点（#）、显式
 * target、修饰键/中键点击一律保持原生行为。
 */
export function shouldInterceptLinkClick(
  event: MouseEvent<HTMLAnchorElement>,
  href: string | undefined,
  target?: string,
): href is string {
  return (
    typeof href === 'string' &&
    href.startsWith('/') &&
    (target === undefined || target === '_self') &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

/**
 * 链接类组件（Link / Breadcrumb 等）共用的站内导航点击处理：
 * 命中拦截条件时 preventDefault 并走渲染上下文路由 `route.navigate`
 * （整应用模式 = react-router 导航桥；嵌入模式 = 宿主注入的 navigate，
 * 缺省 location.assign），否则不处理（原生跳转）。
 */
export function useSpaLinkClick() {
  const { context } = useRenderer();
  return (
    event: MouseEvent<HTMLAnchorElement>,
    href?: string,
    target?: string,
  ) => {
    if (shouldInterceptLinkClick(event, href, target)) {
      event.preventDefault();
      context.route.navigate(href);
    }
  };
}
