import type { DslNode, Registry } from 'pactor-core';
import type { ReactNode } from 'react';

import { resolveSlot } from '../chat-composition.js';
import { AppShell } from './AppShell.js';
import { ChatSidebarMenu, type ChatMenuItem } from './Chat.js';

/**
 * ChatShell（spec: chat-dsl-component / ChatShell 外壳组件，设计决策 D6）：
 * 菜单外壳 = AppShell + 内建菜单侧栏（复用 Chat 的 ChatMenuItem 数据 /
 * 图标白名单 / activeMenuKey 高亮 / onMenuSelect 事件）+ 主区内容槽。
 *
 * 纯展示外壳：MUST NOT 含聊天逻辑与路由逻辑——菜单点击只发事件，
 * 导航还是状态切换由宿主 / DSL 决定。典型用法：DSL 场景 content 槽内
 * 放若干带 when 条件的子树（onMenuSelect → setState 闭环）；应用场景
 * content 传路由出口（onMenuSelect → bridge.push，刷新由路由还原）。
 */
export interface ChatShellProps {
  /** 左侧菜单数据；提供时以 AppShell 承载内建菜单侧栏 */
  menu?: ChatMenuItem[];
  /** 受控高亮项 key（DSL 侧可绑 ${state.x}，经 onMenuSelect + setState 闭环） */
  activeMenuKey?: string;
  /** 移动端顶栏品牌区（透传 AppShell） */
  brand?: ReactNode;
  /** 侧栏槽：提供时替代内建菜单侧栏 */
  sidebar?: DslNode | ReactNode;
  /** 主区内容槽：DslNode 经 renderChildren 渲染；ReactNode 原样渲染（路由出口等） */
  content?: DslNode | ReactNode;
  className?: string;
  /** 菜单项点击回调（disabled 项不触发；DSL 侧 event 含 key 与 item） */
  onMenuSelect?: (key: string, item: ChatMenuItem) => void;
}

export function ChatShell({
  menu,
  activeMenuKey,
  brand,
  sidebar,
  content,
  className,
  onMenuSelect,
}: ChatShellProps): ReactNode {
  // 侧栏槽优先（整体替代内建菜单）；否则 menu 数据驱动内建菜单
  const sidebarContent =
    resolveSlot(sidebar) ??
    (menu && menu.length > 0 ? (
      <ChatSidebarMenu
        menu={menu}
        activeMenuKey={activeMenuKey}
        onMenuSelect={onMenuSelect}
      />
    ) : null);

  return (
    <AppShell sidebar={sidebarContent} brand={brand} className={className}>
      {resolveSlot(content)}
    </AppShell>
  );
}

/** ChatShell 的 DSL 组件类型名 */
export const CHAT_SHELL_COMPONENT_TYPE = 'ChatShell';

type DslEventHandler = (event: unknown) => void;

/**
 * DSL 适配层（ChatDslAdapter 同款）：React 签名 onMenuSelect(key, item)
 * 折算为事件对象，DSL 侧即 event.key / event.item。
 */
function ChatShellDslAdapter({
  onMenuSelect,
  ...rest
}: Omit<ChatShellProps, 'onMenuSelect'> & {
  onMenuSelect?: DslEventHandler;
}): ReactNode {
  return (
    <ChatShell
      {...rest}
      onMenuSelect={
        onMenuSelect
          ? (key: string, item: ChatMenuItem) => onMenuSelect({ key, item })
          : undefined
      }
    />
  );
}

/**
 * 注册 ChatShell DSL 组件：已存在同名类型时 MUST NOT 覆盖。
 * 一般由 registerChatComponent 一并调用（Chat 与 ChatShell 同源注册）。
 */
export function registerChatShellComponent(registry: Registry<unknown>): void {
  if (!registry.has(CHAT_SHELL_COMPONENT_TYPE)) {
    registry.register(CHAT_SHELL_COMPONENT_TYPE, ChatShellDslAdapter);
  }
}
