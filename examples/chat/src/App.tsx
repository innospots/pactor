import {
  ChatServicesProvider,
  ChatShell,
  ConversationStore,
  registerChatComponent,
  useChatServices,
  type ChatMenuItem,
  type ChatServices,
} from '@pactor-app/chat';
import { Registry, type PageDsl } from '@pactor-app/core';
import {
  MenuRegistry,
  createRouterAdapter,
  resolveRoute,
  type MenuItem,
  type NavigationBridge,
  type RouteContext,
} from '@pactor-app/router';
import { DynamicDslRoute, useReactRouterBridge } from '@pactor-app/router/react';
import {
  PageRuntimeView,
  createPageRuntime,
  type ActionHandler,
  type PageRuntime,
} from '@pactor-app/runtime';
import { createShadcnComponentRegistry } from '@pactor-app/ui/components';
import { ShadcnInteractionProvider } from '@pactor-app/ui/interaction';
import { Badge, Button, Card, CardAction, CardDescription, CardHeader, CardTitle } from '@pactor-app/ui/ui';
import { Bell } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { HashRouter, Navigate, useLocation } from 'react-router-dom';

import agentsPageDsl from './agents.page.yaml';
import { readAsAttachment } from './attachments';
import { createChatCapabilities } from './capabilities';
import chatPageDsl from './chat.page.yaml';
import { createMockAiTransport } from './mock-ai';
import { MOCK_AGENTS, MOCK_CONTEXT_ENTRIES } from './mock-data';
import { createChatSafeRegistry } from './safe-registry';
import settingsPageDsl from './settings.page.yaml';
import { showConfirm, showMessage, uiBridge } from './ui-bridge';

/**
 * examples/chat 是"DSL 页面 + 宿主装配"的参考实现（spec:
 * chat-dsl-component / example-chat），路由化形态
 * （spec: chat-artifact-panel，设计决策 D7）：
 *
 * - HashRouter + MenuRegistry（对话 /chat、我的智能体 /agents、
 *   系统设置 /settings）：菜单切换 = URL 变化，刷新按 URL 还原页面；
 * - 外壳为 ChatShell（React 直连）：menu 来自 registry 可见树，
 *   onMenuSelect → bridge.push(item.path)，content 槽为
 *   DynamicDslRoute 路由出口（按 pageId 渲染对应 page.yaml 的
 *   PageRuntime，runtime 注入 createRouterAdapter(bridge) 使页内
 *   DSL navigate 动作可用，route.query/params 注入页面作用域）；
 * - 聊天页结构（极简头部模型选择、@/+ 上下文弹层与 chips）全部经
 *   chat.page.yaml 的 Chat props 声明（spec: chat-builtin-features /
 *   chat-default-skin），宿主零槽位组件；
 * - 聊天服务（transport / safeRegistry / capabilities / confirm /
 *   附件伪上传 / callService 服务桥）经 ChatServicesProvider 在根部
 *   注入一次；ConversationStore 按会话 id 缓存于宿主 Map，chat 页以
 *   嵌套 provider 就近注入——跨页面切换对话消息不丢。
 */

/**
 * 示例菜单项：router MenuItem + ChatShell 展示扩展字段
 * （group 分组标题 / dot 状态点；badge 为 MenuItem 既有字段，透传给
 * ChatMenuItem）
 */
type DemoMenuItem = MenuItem & { group?: string; dot?: boolean };

/**
 * 菜单声明：功能菜单（对话 / 我的智能体 / 系统设置，设置带 badge 演示）
 * + 「最近」分组历史会话（group + dot 演示，spec: chat-default-skin）。
 * 历史会话项与「对话」共用 /chat 路由，以 ?id= 区分会话
 * （chat.page.yaml conversationId 消费 query.id，刷新可还原）
 */
const DEMO_MENUS: DemoMenuItem[] = [
  { id: 'chat', type: 'page', title: '对话', path: '/chat', pageId: 'chat', icon: 'chat', order: 1 },
  { id: 'agents', type: 'page', title: '我的智能体', path: '/agents', pageId: 'agents', icon: 'user', order: 2 },
  { id: 'settings', type: 'page', title: '系统设置', path: '/settings', pageId: 'settings', icon: 'settings', order: 3, badge: 3 },
  { id: 'conv-desktop', type: 'page', title: '桌面框架调整', path: '/chat', pageId: 'chat', icon: 'history', order: 11, group: '最近', dot: true },
  { id: 'conv-weekly', type: 'page', title: '整理本周产品进展', path: '/chat', pageId: 'chat', icon: 'history', order: 12, group: '最近', dot: true },
  { id: 'conv-meeting', type: 'page', title: '会议行动项汇总', path: '/chat', pageId: 'chat', icon: 'history', order: 13, group: '最近' },
  { id: 'conv-roadmap', type: 'page', title: 'Q3 路线图梳理', path: '/chat', pageId: 'chat', icon: 'history', order: 14, group: '最近' },
];

/** pageId → 页面 DSL（vite-plugin 编译的 *.page.yaml 静态导入） */
const PAGE_DSLS: Record<string, PageDsl> = {
  chat: chatPageDsl,
  agents: agentsPageDsl,
  settings: settingsPageDsl,
};

/**
 * 页面组件注册表（三页共享单例）：shadcn 白名单组件全集 +
 * Chat / ChatShell 一等组件（registerChatComponent 不覆盖已有同名类型）
 */
const PAGE_COMPONENTS = createShadcnComponentRegistry();
registerChatComponent(PAGE_COMPONENTS);

/** 缺省会话 id（/chat 无 ?id= 时） */
const DEFAULT_CONVERSATION_ID = 'conv-demo';

/** MenuItem（registry 可见树）→ ChatMenuItem（图标名透传白名单映射，
 * badge / group / dot 展示扩展随项透传） */
function toChatMenu(items: MenuItem[]): ChatMenuItem[] {
  return items.map((item) => {
    const { group, dot } = item as DemoMenuItem;
    return {
      key: item.id,
      label: item.title,
      icon: item.icon,
      badge: item.badge,
      group,
      dot,
      disabled: item.disabled,
    };
  });
}

/**
 * 路由出口命中的 DSL 页面：按 pageId 建 PageRuntime 并渲染。
 * 运行时创建在 effect 内（StrictMode 双挂载安全），卸载即 destroy；
 * route params/query 变化由父级 key 保证整体重建（V1 无 keepAlive）。
 */
function DslPage({
  pageId,
  route,
  bridge,
  chatStore,
}: {
  pageId: string;
  route: RouteContext;
  bridge: NavigationBridge;
  /** chat 页当前会话的 store（宿主按会话 id 缓存）；其余页不传 */
  chatStore?: ConversationStore;
}) {
  const [runtime, setRuntime] = useState<PageRuntime | null>(null);
  const baseServices = useChatServices();

  // chat 页嵌套 provider：就近注入当前会话的 ConversationStore
  const chatServices = useMemo<ChatServices | null>(
    () =>
      chatStore && baseServices ? { ...baseServices, store: chatStore } : null,
    [baseServices, chatStore],
  );

  useEffect(() => {
    const actions = new Registry<ActionHandler>('ActionRegistry');
    // navigate 动作：委托 runtime route.navigate（→ router adapter → bridge.push）
    actions.register('navigate', (action, ctx) => {
      const to = action.params?.['to'];
      if (typeof to === 'string' && to !== '') {
        ctx.context.route.navigate(to);
      }
      return { ok: true };
    });
    // message 动作：toast 经示例 UiBridge（settings 页保存、chat 页 header
    // 操作事件等提示统一走这里）
    actions.register('message', (action) => {
      const params = action.params ?? {};
      const type = params['type'];
      showMessage(
        type === 'success' || type === 'error' || type === 'warning'
          ? type
          : 'info',
        String(params['text'] ?? ''),
      );
      return { ok: true };
    });
    const rt = createPageRuntime(PAGE_DSLS[pageId]!, {
      components: PAGE_COMPONENTS,
      actions,
      // 页内 DSL navigate 动作经 router adapter 落到路由桥；
      // route.params/query 注入页面作用域（${route.query.id} 等）
      router: createRouterAdapter(bridge),
      route: { params: route.params, query: route.query },
    });
    setRuntime(rt);
    void rt.ready();
    void rt.show();
    return () => {
      void rt.hide();
      void rt.destroy();
    };
    // route 内容变化由父级 key 触发重建，此处仅挂一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId, bridge]);

  if (!runtime) {
    return null;
  }
  const view = <PageRuntimeView runtime={runtime} />;
  return chatServices ? (
    <ChatServicesProvider value={chatServices}>{view}</ChatServicesProvider>
  ) : (
    view
  );
}

function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  );
}

function Shell() {
  const location = useLocation();
  const bridge = useReactRouterBridge();

  // 菜单注册表（路由 + 可见菜单树的唯一来源）
  const menuRegistry = useMemo(() => new MenuRegistry(DEMO_MENUS), []);
  // transport / 白名单 / 能力在会话内保持稳定，只创建一次。
  // ConversationStore 按会话 id 缓存（chat 页 query.id 或缺省会话），
  // 页面切换 / 会话切换后消息不丢
  const transport = useMemo(() => createMockAiTransport(), []);
  const safeRegistry = useMemo(() => createChatSafeRegistry(), []);
  const capabilities = useMemo(() => createChatCapabilities(), []);
  const storesRef = useRef(new Map<string, ConversationStore>());
  const getStore = (conversationId: string): ConversationStore => {
    const stores = storesRef.current;
    let store = stores.get(conversationId);
    if (!store) {
      store = new ConversationStore();
      stores.set(conversationId, store);
    }
    return store;
  };

  // 声明式数据源服务桥（spec: chat-context-sources，设计决策 D1）：
  // chat.page.yaml contexts 的 service 引用（agents / contexts）经此解析为
  // ChatContextItem[]（{ id, label, data }——label 用于弹层与 chip 展示，
  // data 为原始条目，transport 可结构化消费）；
  // quoteMessage（spec: chat-message-actions）：消息操作条自定义 quote 动作
  // 的派发服务——入参 { actionId, message }，演示实现把引用文本 toast 出来
  // （真实场景可写入 Composer 草稿或引用回复区）
  const callService = useMemo<NonNullable<ChatServices['callService']>>(
    () => (name, params) => {
      switch (name) {
        case 'agents':
          return Promise.resolve(
            MOCK_AGENTS.map((agent) => ({
              id: agent.id,
              label: agent.name,
              data: agent,
            })),
          );
        case 'contexts':
          return Promise.resolve(
            MOCK_CONTEXT_ENTRIES.map((entry) => ({
              id: entry.id,
              label: entry.name,
              data: entry,
            })),
          );
        case 'quoteMessage': {
          const message = params?.['message'] as
            | { id?: string; parts?: Array<{ type: string; content?: string }> }
            | undefined;
          const text = (message?.parts ?? [])
            .filter(
              (part) =>
                (part.type === 'text' || part.type === 'markdown') &&
                typeof part.content === 'string',
            )
            .map((part) => part.content)
            .join('\n');
          console.info('[example-chat] quoteMessage', params);
          showMessage(
            'info',
            `已引用回复：${text.length > 40 ? `${text.slice(0, 40)}…` : text}`,
          );
          return Promise.resolve({ ok: true });
        }
        default:
          return Promise.reject(new Error(`未知服务：${name}`));
      }
    },
    [],
  );

  // 当前路由上下文：菜单高亮由 URL 推导（刷新即还原）
  const route = resolveRoute(menuRegistry, {
    pathname: location.pathname,
    search: location.search,
  });

  // 高亮修正：/chat?id=xxx 且 xxx 为「最近」分组历史会话项时高亮该项
  // 自身；否则回退路由推导（findByPath 按 pathname 命中基础「对话」项，
  // 智能体列表带来的 /chat?id=<agentId> 也回退高亮「对话」）
  const queryId = route?.pageId === 'chat' ? route.query['id'] : undefined;
  const historyItem = queryId ? menuRegistry.findById(queryId) : undefined;
  const activeMenuKey =
    queryId && historyItem?.pageId === 'chat' && queryId !== 'chat'
      ? queryId
      : route?.activeMenu;

  // 聊天服务：全部运行时依赖经 provider 注入一次（useMemo 保持稳定
  // 引用；store 由 chat 页嵌套 provider 就近注入）。
  // 附件受控状态由 Chat 组件自持：onAttachFiles 回传（data URL 伪上传）
  // 即追加，发送后自动清空
  const chatServices = useMemo<ChatServices>(
    () => ({
      transport,
      safeRegistry,
      capabilities,
      callService,
      confirm: ({ name }) =>
        showConfirm(`高风险操作「${name}」，确认执行？`),
      onAttachFiles: (files) => Promise.all(files.map(readAsAttachment)),
      onAttachmentClick: (attachment) => {
        if (attachment.url) {
          window.open(attachment.url, '_blank');
        } else {
          showMessage('info', `附件「${attachment.name}」无 url（伪上传未产出 data URL）`);
        }
      },
    }),
    [transport, safeRegistry, capabilities, callService],
  );

  return (
    <ChatServicesProvider value={chatServices}>
      {/* @pactor-app/ui 交互层：toast / confirm 经 UiBridge 注入（宿主根部挂载） */}
      <ShadcnInteractionProvider bridge={uiBridge}>
      <div className="demo-app">
        {/* 菜单外壳：menu 来自 registry 可见树，高亮由 URL 推导，
            点击 → bridge.push（菜单切换 = URL 变化）；内容槽为路由出口。
            侧栏参考形态（spec: chat-default-skin）：brand 品牌行 +
            collapsible 折叠钮 + 「最近」分组（group/dot）+ sidebarFooter
            用户卡（@pactor-app/ui/ui 原语构建，视觉全部由包内样式承担）。
            sidebarFooter 传 ReactNode：DslNode 槽需页面运行时上下文
            （renderChildren），此层为 React 直连不可用。
            聊天页头部为极简形态（仅模型选择，modelPlacement: header），
            由 chat.page.yaml 声明 */}
        <main className="demo-main">
          <ChatShell
            menu={toChatMenu(menuRegistry.tree())}
            activeMenuKey={activeMenuKey}
            brand={<span className="text-sm font-semibold">Pactor Chat</span>}
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
                      <Bell />
                    </Button>
                  </CardAction>
                </CardHeader>
              </Card>
            }
            onMenuSelect={(key) => {
              const menu = menuRegistry.findById(key);
              if (!menu?.path) {
                return;
              }
              // 「最近」分组历史会话与「对话」共用 /chat 路由，
              // 以 ?id= 区分会话（刷新可还原）
              bridge.push(
                menu.pageId === 'chat' && key !== 'chat'
                  ? `/chat?id=${key}`
                  : menu.path,
              );
            }}
            content={
              <DynamicDslRoute
                registry={menuRegistry}
                fallback={<Navigate to="/chat" replace />}
                render={({ pageId, route: pageRoute }) => (
                  <DslPage
                    key={`${pageId}|${JSON.stringify(pageRoute.params)}|${JSON.stringify(pageRoute.query)}`}
                    pageId={pageId}
                    route={pageRoute}
                    bridge={bridge}
                    chatStore={
                      pageId === 'chat'
                        ? getStore(
                            pageRoute.query['id'] || DEFAULT_CONVERSATION_ID,
                          )
                        : undefined
                    }
                  />
                )}
              />
            }
          />
        </main>
      </div>
      </ShadcnInteractionProvider>
    </ChatServicesProvider>
  );
}

export default App;
