import {
  Sidebar as UiSidebar,
  useSidebarDrawer as useUiSidebarDrawer,
} from '@pactor-app/ui/components';
import type { ReactNode } from 'react';

/**
 * 侧栏抽屉 context（spec: chat-app-shell）：侧栏内容（如导航项）在导航后
 * 调用 `close()` 关闭移动端抽屉；不在 AppShell 内时返回 null，
 * 调用方以可选链安全调用（`drawer?.close()`），不抛错。
 * `collapsed` 为桌面折叠（icon rail）状态（决策 D3）：侧栏内容可据此
 * 降级为纯图标展示（如菜单项以 title 兜底可访问名）。
 *
 * 实现为 ui Sidebar 的 context 转发（chat-on-ui-sidebar）：AppShell
 * 内部渲染 ui Sidebar，hook 签名与语义保持不变，调用方零改动。
 */
export function useSidebarDrawer(): {
  close: () => void;
  collapsed: boolean;
} | null {
  return useUiSidebarDrawer();
}

export interface AppShellProps {
  /** 侧栏内容（会话列表等），完全由调用方注入 */
  sidebar: ReactNode;
  /** 品牌区内容（logo / 名称）：移动端渲染在顶栏；桌面端渲染在侧栏顶部品牌行（决策 D3） */
  brand?: ReactNode;
  /**
   * 路由 / 会话切换标识：值变化时抽屉在渲染期关闭
   * （compare-during-render，框架无关，替代路由 hook 耦合）
   */
  locationKey?: string;
  /**
   * 侧栏底部固定区（spec: chat-app-shell / 侧栏底部槽）：渲染在侧栏
   * 滚动区之后（不随菜单滚动）；未提供时不渲染容器（零渲染承诺）
   */
  sidebarFooter?: ReactNode;
  /**
   * 桌面端可折叠（spec: chat-app-shell / 桌面侧栏头部与折叠，决策 D3）：
   * 为 true 时品牌行右端渲染折叠按钮，点击切换内部非受控 collapsed
   * 状态——折叠后桌面侧栏收窄为 icon rail；移动端不渲染折叠按钮、
   * 抽屉语义不受影响。缺省 false
   */
  collapsible?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * AppShell（spec: chat-app-shell）：聊天工作区应用外壳 = 侧栏插槽 + 主区。
 *
 * 实现为 ui Sidebar 的薄封装（spec: chat-on-ui-sidebar）：桌面（≥768px）
 * 侧栏与主区 flex 同行；移动端（<768px）侧栏变为覆盖抽屉（遮罩 +
 * 顶栏菜单按钮）；折叠 / 抽屉 / inert 等交互全部由 ui Sidebar 承担，
 * chat 侧只挂 `pactor-chat-shell` 类做 `--sidebar*` → `--pactor-chat-*`
 * 令牌映射（皮肤唯一入口仍为 --pactor-chat-*，见 styles.css）与
 * 高度语义（h-full 填满父容器，嵌入契约）。
 */
export function AppShell({
  sidebar,
  brand,
  locationKey,
  sidebarFooter,
  collapsible = false,
  children,
  className,
}: AppShellProps) {
  return (
    <UiSidebar
      content={sidebar}
      brand={brand}
      locationKey={locationKey}
      sidebarFooter={sidebarFooter}
      collapsible={collapsible}
      className={`pactor-chat-shell h-full min-h-0${className ? ` ${className}` : ''}`}
    >
      {children}
    </UiSidebar>
  );
}
