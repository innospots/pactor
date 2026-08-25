import { Menu } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

/**
 * 侧栏抽屉 context（spec: chat-app-shell）：侧栏内容（如导航项）在导航后
 * 调用 `close()` 关闭移动端抽屉；不在 AppShell 内时返回 null，
 * 调用方以可选链安全调用（`drawer?.close()`），不抛错。
 */
const SidebarDrawerContext = createContext<{ close: () => void } | null>(null);

export function useSidebarDrawer(): { close: () => void } | null {
  return useContext(SidebarDrawerContext);
}

export interface AppShellProps {
  /** 侧栏内容（会话列表等），完全由调用方注入 */
  sidebar: ReactNode;
  /** 移动端顶栏品牌区内容（logo / 名称），由调用方注入 */
  brand?: ReactNode;
  /**
   * 路由 / 会话切换标识：值变化时抽屉在渲染期关闭
   * （compare-during-render，框架无关，替代路由 hook 耦合）
   */
  locationKey?: string;
  children: ReactNode;
  className?: string;
}

/** 767px 界与 styles.css 媒体查询断点保持一致；仅用于 inert，不参与布局 */
const MOBILE_MEDIA_QUERY = '(max-width: 767px)';

/**
 * 移动视口判定：布局切换本身由 CSS 媒体查询表达（首帧即正确），
 * 这里只为 `inert` 服务——抽屉关闭后 translate-x 移出屏幕但 Tab 仍可
 * 进入不可见侧栏，这一半 CSS 表达不了，必须 JS（同参考实现的取舍）。
 */
function useIsMobileViewport(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia(MOBILE_MEDIA_QUERY).matches,
  );

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return;
    }
    const media = window.matchMedia(MOBILE_MEDIA_QUERY);
    const onChange = (event: MediaQueryListEvent): void => {
      setIsMobile(event.matches);
    };
    setIsMobile(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}

/**
 * AppShell（spec: chat-app-shell）：聊天工作区应用外壳 = 侧栏插槽 + 主区。
 *
 * 桌面（≥768px）：侧栏与主区在 flex 行内同级排列；
 * 移动端（<768px）：侧栏退出文档流变为左侧覆盖抽屉（遮罩 + 顶栏菜单按钮）。
 * 布局切换全部在 styles.css 媒体查询（`.pactor-chat-shell*`）中表达，
 * JS 只拥有抽屉开合状态 `drawerOpen`。
 */
export function AppShell({ sidebar, brand, locationKey, children, className }: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useIsMobileViewport();

  const close = useCallback(() => setDrawerOpen(false), []);

  // locationKey 变化（路由 / 会话切换）即关抽屉：渲染期比较，
  // 抽屉不会在新会话内容之上多画一帧
  const [trackedLocationKey, setTrackedLocationKey] = useState(locationKey);
  if (trackedLocationKey !== locationKey) {
    setTrackedLocationKey(locationKey);
    setDrawerOpen(false);
  }

  // Escape 关闭：仅抽屉打开期间挂 window 监听
  useEffect(() => {
    if (!drawerOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen]);

  return (
    <SidebarDrawerContext.Provider value={{ close }}>
      {/* 100dvh 而非 100vh：iOS Safari 的 100vh 包含可收起的地址栏，
          vh 定高会把主区内容推到地址栏下（同参考实现的取舍） */}
      <div className={`pactor-chat-shell${className ? ` ${className}` : ''}`}>
        {drawerOpen ? (
          <div className="pactor-chat-shell__scrim" aria-hidden onClick={close} />
        ) : null}

        <div
          className="pactor-chat-shell__sidebar"
          data-open={drawerOpen ? 'true' : 'false'}
          inert={isMobile && !drawerOpen ? true : undefined}
        >
          {sidebar}
        </div>

        <main className="pactor-chat-shell__main">
          <div className="pactor-chat-shell__topbar">
            <button
              type="button"
              className="pactor-chat-icon-button pactor-chat-shell__menu"
              aria-label="打开导航"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
            >
              <Menu size={18} strokeWidth={1.7} />
            </button>
            {brand}
          </div>
          <div className="pactor-chat-shell__content">{children}</div>
        </main>
      </div>
    </SidebarDrawerContext.Provider>
  );
}
