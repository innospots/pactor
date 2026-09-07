import { ChatShell, type ChatMenuItem } from '@pactor-app/chat';
import {
  Badge,
  Button,
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@pactor-app/ui/ui';
import { Icon } from '@pactor-app/ui/components';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { DEMO_MENUS, type DemoMenuItem } from './bootstrap';

/**
 * chat 外壳布局（spec: example-chat-on-pactor-app，设计决策 D3）：
 * 经入口 layoutRegistry 注册为 type: 'chat'，由 bootstrap
 * layout.type 命中。框架对非 admin 布局只传 { brand, children }
 * （app-shell ShellLayout），故布局自给自足：
 *
 * - 菜单：与 bootstrap 同源的 DEMO_MENUS 映射为 ChatMenuItem
 *   （group / dot / badge 展示扩展透传）；本示例无 hidden 可见项与
 *   权限过滤，直接映射声明数组即可；
 * - 高亮：由 URL 推导（刷新即还原），含「最近」会话 ?id= 命中
 *   历史会话项的修正（与原手写壳逻辑一致）；
 * - 导航：布局渲染在 Router 之内，onMenuSelect 直接 navigate
 *   （历史会话 /chat?id=<key> 约定不变）。
 */

/** MenuItem（bootstrap 声明）→ ChatMenuItem（图标名透传白名单映射） */
function toChatMenu(items: DemoMenuItem[]): ChatMenuItem[] {
  return items
    .filter((item) => !item.hidden)
    .map((item) => ({
      key: item.id,
      label: item.title,
      icon: item.icon,
      badge: item.badge,
      group: item.group,
      dot: item.dot,
    }));
}

export interface ChatAppLayoutProps {
  brand?: { title: string; logo?: ReactNode };
  children?: ReactNode;
}

export function ChatAppLayout({ brand, children }: ChatAppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // 高亮推导：/chat?id=xxx 且 xxx 为「最近」分组历史会话项时高亮该项
  // 自身；否则按 pathname 命中功能菜单（智能体列表带来的
  // /chat?id=<agentId> 回退高亮「对话」）
  const queryId =
    location.pathname === '/chat'
      ? (new URLSearchParams(location.search).get('id') ?? undefined)
      : undefined;
  const historyItem = queryId
    ? DEMO_MENUS.find((item) => item.id === queryId)
    : undefined;
  const baseActiveKey = DEMO_MENUS.find(
    (item) => !item.hidden && item.path === location.pathname,
  )?.id;
  const activeMenuKey =
    queryId && historyItem?.pageId === 'chat' && queryId !== 'chat'
      ? queryId
      : baseActiveKey;

  return (
    <div className="demo-app">
      <main className="demo-main">
        <ChatShell
          menu={toChatMenu(DEMO_MENUS)}
          activeMenuKey={activeMenuKey}
          brand={
            <span className="text-sm font-semibold">
              {brand?.title ?? 'Pactor Chat'}
            </span>
          }
          collapsible
          sidebarFooter={
            <Card>
              <CardHeader>
                <CardTitle>
                  <Badge variant="secondary">A</Badge> Ariake
                </CardTitle>
                <CardDescription>ariake@pactor.dev</CardDescription>
                <CardAction>
                  <Button variant="ghost" size="icon" aria-label="通知">
                    <Icon name="bell" />
                  </Button>
                </CardAction>
              </CardHeader>
            </Card>
          }
          onMenuSelect={(key) => {
            const menu = DEMO_MENUS.find((item) => item.id === key);
            if (!menu) {
              return;
            }
            // 「最近」分组历史会话与「对话」共用 /chat 路由，
            // 以 ?id= 区分会话（刷新可还原）
            navigate(
              menu.pageId === 'chat' && key !== 'chat'
                ? `/chat?id=${key}`
                : menu.path,
            );
          }}
          content={children}
        />
      </main>
    </div>
  );
}
