import {
  ChatServicesProvider,
  ChatShell,
  ConversationStore,
  registerChatComponent,
  useChatServices,
  type ChatMenuItem,
  type ChatServices,
} from 'pactor-chat';
import { Registry, type PageDsl } from 'pactor-core';
import {
  MenuRegistry,
  createRouterAdapter,
  resolveRoute,
  type MenuItem,
  type NavigationBridge,
  type RouteContext,
} from 'pactor-router';
import { DynamicDslRoute, useReactRouterBridge } from 'pactor-router/react';
import {
  PageRuntimeView,
  createPageRuntime,
  type ActionHandler,
  type PageRuntime,
} from 'pactor-runtime';
import { createShadcnComponentRegistry } from 'pactor-ui/components';
import { ShadcnInteractionProvider } from 'pactor-ui/interaction';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { HashRouter, Navigate, useLocation } from 'react-router-dom';

import agentsPageDsl from './agents.page.yaml';
import { readAsAttachment } from './attachments';
import { createChatCapabilities } from './capabilities';
import chatPageDsl from './chat.page.yaml';
import { CapabilityChip } from './components/CapabilityChip';
import { ContextChips, type ContextChipData } from './components/ContextChips';
import { ContextPickerModal } from './components/ContextPickerModal';
import { Header } from './components/Header';
import { MentionListbox } from './components/MentionListbox';
import { ModelSelector } from './components/ModelSelector';
import { PlusMenu } from './components/PlusMenu';
import { downloadMessagesAsMarkdown } from './export-markdown';
import { createMockAiTransport } from './mock-ai';
import { PICKER_CHIP_PREFIX, type PickerKind } from './mock-data';
import { createChatSafeRegistry } from './safe-registry';
import settingsPageDsl from './settings.page.yaml';
import { showConfirm, showMessage, uiBridge } from './ui-bridge';

/**
 * examples/chat 是"DSL 页面 + 宿主装配"的参考实现（spec:
 * chat-dsl-component / example-chat），本变更为路由化形态
 * （spec: chat-artifact-panel，设计决策 D7）：
 *
 * - HashRouter + MenuRegistry（对话 /chat、我的智能体 /agents、
 *   系统设置 /settings）：菜单切换 = URL 变化，刷新按 URL 还原页面；
 * - 外壳为 ChatShell（React 直连）：menu 来自 registry 可见树，
 *   onMenuSelect → bridge.push(item.path)，content 槽为
 *   DynamicDslRoute 路由出口（按 pageId 渲染对应 page.yaml 的
 *   PageRuntime，runtime 注入 createRouterAdapter(bridge) 使页内
 *   DSL navigate 动作可用，route.query/params 注入页面作用域）；
 * - 聊天服务（transport / safeRegistry / capabilities / confirm /
 *   附件伪上传 / 弹层与工具栏回调）经 ChatServicesProvider 在根部
 *   注入一次；ConversationStore 按会话 id 缓存于宿主 Map，chat 页以
 *   嵌套 provider 就近注入——跨页面切换对话消息不丢。
 */

/** 菜单声明：对话 / 我的智能体 / 系统设置（各带 pageId，hash 路径） */
const DEMO_MENUS: MenuItem[] = [
  { id: 'chat', type: 'page', title: '对话', path: '/chat', pageId: 'chat', icon: 'chat', order: 1 },
  { id: 'agents', type: 'page', title: '我的智能体', path: '/agents', pageId: 'agents', icon: 'user', order: 2 },
  { id: 'settings', type: 'page', title: '系统设置', path: '/settings', pageId: 'settings', icon: 'settings', order: 3 },
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

/** MenuItem（registry 可见树）→ ChatMenuItem（图标名透传白名单映射） */
function toChatMenu(items: MenuItem[]): ChatMenuItem[] {
  return items.map((item) => ({
    key: item.id,
    label: item.title,
    icon: item.icon,
    disabled: item.disabled,
  }));
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
    // message 动作：toast 经示例 UiBridge（settings 页保存成功提示）
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

/**
 * 宿主槽位 context：工具栏槽内的动态内容（上下文 chips）经 context 读取
 * 最新宿主状态，而不是把易变的 ReactNode 固化进服务闭包。
 */
interface DemoHost {
  chips: ContextChipData[];
  onRemoveChip: (id: string) => void;
}

const DemoHostContext = createContext<DemoHost | null>(null);

/** Composer 工具栏左槽：能力 chip + 已选上下文 chips（经 context 取最新） */
function ToolbarStartSlot() {
  const host = useContext(DemoHostContext);
  if (!host) {
    return null;
  }
  return (
    <>
      <CapabilityChip />
      <ContextChips chips={host.chips} onRemove={host.onRemoveChip} />
    </>
  );
}

/** 词边界 `@` 提及检测（与包内 Composer 同一规则）：返回 `@` 后 query */
function detectMention(text: string, caret: number): string | null {
  const match = /(?:^|\s)@([^\s@]*)$/.exec(text.slice(0, caret));
  return match ? match[1]! : null;
}

/** 当前 `@` 提及弹层状态 */
interface MentionState {
  query: string;
  rect: DOMRect;
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

  // 页壳状态：主题（写到 app 根的 data-pactor-theme）与会话标题
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [title, setTitle] = useState('新的对话');

  // 已选上下文 chips（"+" 菜单选择器 / `@` 提及选中产生，可移除）
  const [contextChips, setContextChips] = useState<ContextChipData[]>([]);

  // 弹层状态："+" 菜单（锚定）、picker Modal、`@` 提及列表（锚定）
  const [plusRect, setPlusRect] = useState<DOMRect | null>(null);
  const [pickerKind, setPickerKind] = useState<PickerKind | null>(null);
  const [mention, setMention] = useState<MentionState | null>(null);

  // `@` 提及的关闭兜底：Composer 只在仍处于 `@` 语境时回调，
  // 若用户删掉 `@`（不再有回调），这里监听输入事件复检并收起
  useEffect(() => {
    if (!mention) {
      return;
    }
    const handleInput = (event: Event): void => {
      const target = event.target;
      if (!(target instanceof HTMLTextAreaElement)) {
        return;
      }
      const caret = target.selectionStart ?? target.value.length;
      if (detectMention(target.value, caret) === null) {
        setMention(null);
      }
    };
    document.addEventListener('input', handleInput, true);
    return () => document.removeEventListener('input', handleInput, true);
  }, [mention]);

  // 当前路由上下文：菜单高亮与当前会话 id 均由 URL 推导（刷新即还原）
  const route = resolveRoute(menuRegistry, {
    pathname: location.pathname,
    search: location.search,
  });
  const currentConversationId =
    route?.pageId === 'chat'
      ? route.query['id'] || DEFAULT_CONVERSATION_ID
      : DEFAULT_CONVERSATION_ID;

  // 聊天服务：全部运行时依赖与交互回调经 provider 注入一次（useMemo
  // 保持稳定引用；store 由 chat 页嵌套 provider 就近注入）。
  // 附件受控状态由 Chat 组件自持：onAttachFiles 回传（data URL 伪上传）
  // 即追加，发送后自动清空
  const chatServices = useMemo<ChatServices>(
    () => ({
      transport,
      safeRegistry,
      capabilities,
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
      toolbarStart: <ToolbarStartSlot />,
      toolbarEnd: <ModelSelector />,
      onMentionTrigger: (query, anchorRect) =>
        setMention({ query, rect: anchorRect }),
      onPlusMenu: (anchorRect) =>
        setPlusRect((prev) => (prev ? null : anchorRect)),
    }),
    [transport, safeRegistry, capabilities],
  );

  const addChip = (label: string): void => {
    setContextChips((prev) => {
      if (prev.some((chip) => chip.label === label)) {
        return prev;
      }
      return [...prev, { id: `${Date.now()}-${prev.length}`, label }];
    });
  };

  const handleExport = (): void => {
    const messages = getStore(currentConversationId).getMessages();
    if (messages.length === 0) {
      showMessage('info', '当前会话还没有消息');
      return;
    }
    downloadMessagesAsMarkdown(title, messages);
    showMessage('success', '已导出 Markdown');
  };

  const handleClear = (): void => {
    getStore(currentConversationId).clear();
    setContextChips([]);
    showMessage('success', '会话已清空');
  };

  return (
    <DemoHostContext.Provider
      value={{
        chips: contextChips,
        onRemoveChip: (id) =>
          setContextChips((prev) => prev.filter((chip) => chip.id !== id)),
      }}
    >
      <ChatServicesProvider value={chatServices}>
        {/* pactor-ui 交互层：toast / confirm 经 UiBridge 注入（宿主根部挂载） */}
        <ShadcnInteractionProvider bridge={uiBridge}>
        <div className="demo-app" data-pactor-theme={theme === 'dark' ? 'dark' : undefined}>
          {/* 宿主应用壳：顶栏（可编辑标题 / 导出 / 明暗 / 清空）在 DSL 页面之上 */}
          <Header
            title={title}
            onTitleChange={setTitle}
            theme={theme}
            onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            onExport={handleExport}
            onClear={handleClear}
          />
          {/* 菜单外壳：menu 来自 registry 可见树，高亮由 URL 推导，
              点击 → bridge.push（菜单切换 = URL 变化）；内容槽为路由出口 */}
          <main className="demo-main">
            <ChatShell
              menu={toChatMenu(menuRegistry.tree())}
              activeMenuKey={route?.activeMenu}
              brand={<span className="demo-brand">Pactor Chat</span>}
              onMenuSelect={(key) => {
                const menu = menuRegistry.findById(key);
                if (menu?.path) {
                  bridge.push(menu.path);
                }
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

          {plusRect && (
            <PlusMenu
              rect={plusRect}
              onClose={() => setPlusRect(null)}
              onOpenPicker={(kind) => setPickerKind(kind)}
            />
          )}
          {pickerKind && (
            <ContextPickerModal
              kind={pickerKind}
              onCancel={() => setPickerKind(null)}
              onConfirm={(entries) => {
                for (const entry of entries) {
                  addChip(`${PICKER_CHIP_PREFIX[pickerKind]}：${entry.name}`);
                }
                setPickerKind(null);
              }}
            />
          )}
          {mention && (
            <MentionListbox
              query={mention.query}
              rect={mention.rect}
              onClose={() => setMention(null)}
              onSelect={(name) => addChip(`@${name}`)}
            />
          )}
        </div>
        </ShadcnInteractionProvider>
      </ChatServicesProvider>
    </DemoHostContext.Provider>
  );
}

export default App;
