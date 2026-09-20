import { useCallback, useMemo, useSyncExternalStore } from 'react';

/**
 * 内置浏览器路由（纯前端 SPA 模式）：宿主未注入 pathname / navigate 时，
 * SitemapApp 以此管理路由——History API 导航 + popstate 监听前进后退。
 * 宿主已注入（Next App Router / react-router）时本模块不生效。
 */

/** pushState 不会触发 popstate，导航后派发自定义事件通知订阅者 */
const NAV_EVENT = 'pactor:sitemap-navigate';

function readLocation(): string {
  return `${window.location.pathname}${window.location.search}`;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener('popstate', callback);
  window.addEventListener(NAV_EVENT, callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener(NAV_EVENT, callback);
  };
}

export interface BrowserRoute {
  pathname: string;
  query: Record<string, string>;
  navigate: (to: string) => void;
}

export function useBrowserRoute(): BrowserRoute {
  const location = useSyncExternalStore(
    subscribe,
    readLocation,
    // SSR 快照：服务端无 window，宿主应注入 pathname / navigate
    () => '/',
  );
  const navigate = useCallback((to: string) => {
    window.history.pushState(null, '', to);
    window.dispatchEvent(new Event(NAV_EVENT));
  }, []);
  return useMemo(() => {
    const qIndex = location.indexOf('?');
    return {
      pathname: qIndex >= 0 ? location.slice(0, qIndex) : location,
      query: Object.fromEntries(
        new URLSearchParams(qIndex >= 0 ? location.slice(qIndex + 1) : ''),
      ),
      navigate,
    };
  }, [location, navigate]);
}
