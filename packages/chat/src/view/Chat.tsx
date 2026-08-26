import type { DslNode, Registry } from 'pactor-core';
import {
  Folder,
  History,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Star,
  User,
} from 'lucide-react';
import {
  Fragment,
  useEffect,
  type ComponentType,
  type ReactNode,
} from 'react';

import { ChatComposition, resolveSlot } from '../chat-composition.js';
import { useChatServices } from '../chat-services.js';
import type { ChatArtifact } from '../artifact.js';
import { useSidebarDrawer } from './AppShell.js';
import { registerChatShellComponent } from './ChatShell.js';
import type { ChatSuggestion } from './EmptyState.js';

/**
 * 菜单项（spec: chat-dsl-component，设计决策 D2）：纯数据驱动——
 * DSL 可表达的标量字段，图标为字符串名（白名单映射内置 lucide 子集，
 * 避免 DSL 携带组件）。`group` 为分组标题：与上一项 group 不同时
 * 在该项之前渲染分组行。
 */
export interface ChatMenuItem {
  key: string;
  label: string;
  /** 字符串图标名（plus / chat / history / settings / star / search / user / folder）；未知名渲染占位圆点 */
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
  /** 分组标题（相邻同组只渲染一次） */
  group?: string;
}

/**
 * Chat 组件 props（spec: chat-dsl-component）：标量 / 数组 / 普通对象为
 * DSL 可表达配置；sidebar / headerExtra / header 槽同时接受 DslNode
 * （页面运行时内经 renderChildren 渲染）与 ReactNode（纯 React 直连）。
 */
export interface ChatProps {
  /** 内建 header 标题 */
  title?: string;
  /** 空会话问候语 */
  greeting?: string;
  /** 空会话副标题 */
  subtitle?: string;
  /** 空会话起始建议；空数组 / 未传时不渲染建议区 */
  suggestions?: ChatSuggestion[];
  /** 会话 id（注入 dsl part 作用域 conversation.id） */
  conversationId?: string;
  /** 注入 dsl part 作用域 params */
  params?: Record<string, unknown>;
  /** 传 false 关闭 header；缺省渲染（header 槽整体替换 > title + headerExtra 内建 header） */
  showHeader?: boolean;
  /** 左侧菜单数据；提供时以 AppShell 承载内建侧栏 */
  menu?: ChatMenuItem[];
  /** 受控高亮项 key（DSL 侧可绑 ${state.x}，经 onMenuSelect + setState 闭环） */
  activeMenuKey?: string;
  /** 侧栏槽：提供时替代内建菜单侧栏 */
  sidebar?: DslNode | ReactNode;
  /** 内建 header 标题右侧槽 */
  headerExtra?: DslNode | ReactNode;
  /** header 槽：整体替换内建 header */
  header?: DslNode | ReactNode;
  /**
   * 产出物面板（spec: chat-artifact-panel / chat-dsl-component，决策 D2）：
   * `artifact` / `panelOpen` 可绑 DSL state；任一提供即全受控，
   * 都未提供时由内部 / 注入的 ArtifactStore 驱动
   */
  artifact?: ChatArtifact | null;
  panelOpen?: boolean;
  /** 面板关闭按钮 / 窄屏遮罩点击回调（典型接法：setState panelOpen=false） */
  onPanelClose?: () => void;
  /** 面板内容槽：提供时整体替代面板内建渲染器 */
  inspector?: DslNode | ReactNode;
  /** artifact part 就绪时触发（event 作用域含 artifact；框架不擅自开面板） */
  onArtifact?: (artifact: ChatArtifact) => void;
  /** 产出物卡片"在面板中打开"按钮点击回调（event 作用域含 artifact；受控场景的开面板入口） */
  onOpenArtifact?: (artifact: ChatArtifact) => void;
  className?: string;
  /** 发送回调：与 transport 驱动 turn 并行（同 ChatView onSend 语义） */
  onSend?: (text: string) => void;
  /** 菜单项点击回调（disabled 项不触发） */
  onMenuSelect?: (key: string, item: ChatMenuItem) => void;
}

/** 菜单图标名 → lucide 子集（白名单式，未知名渲染占位圆点，不抛错） */
export const MENU_ICONS: Record<
  string,
  ComponentType<{ size?: number; strokeWidth?: number }>
> = {
  plus: Plus,
  chat: MessageSquare,
  history: History,
  settings: Settings,
  star: Star,
  search: Search,
  user: User,
  folder: Folder,
};

/** 内建侧栏：menu 数据驱动的菜单（分组标题 + 图标 + badge + disabled）；ChatShell 同款复用 */
export function ChatSidebarMenu({
  menu,
  activeMenuKey,
  onMenuSelect,
}: {
  menu: ChatMenuItem[];
  activeMenuKey?: string;
  onMenuSelect?: (key: string, item: ChatMenuItem) => void;
}): ReactNode {
  const drawer = useSidebarDrawer();
  let lastGroup: string | undefined;
  return (
    <nav className="pactor-chat-menu" aria-label="会话导航">
      {menu.map((item) => {
        const groupLabel =
          item.group !== undefined && item.group !== lastGroup
            ? item.group
            : undefined;
        lastGroup = item.group;
        const Icon = item.icon !== undefined ? MENU_ICONS[item.icon] : undefined;
        const active = item.key === activeMenuKey;
        return (
          <Fragment key={item.key}>
            {groupLabel !== undefined ? (
              <div className="pactor-chat-menu__group">{groupLabel}</div>
            ) : null}
            <button
              type="button"
              className={`pactor-chat-menu__item${active ? ' pactor-chat-menu__item--active' : ''}`}
              disabled={item.disabled === true}
              aria-current={active ? 'true' : undefined}
              onClick={() => {
                if (item.disabled) {
                  return;
                }
                onMenuSelect?.(item.key, item);
                drawer?.close();
              }}
            >
              {item.icon !== undefined ? (
                Icon ? (
                  <span className="pactor-chat-menu__icon">
                    <Icon size={15} strokeWidth={1.7} />
                  </span>
                ) : (
                  <span
                    className="pactor-chat-menu__icon-placeholder"
                    aria-hidden
                  />
                )
              ) : null}
              <span className="pactor-chat-menu__label">{item.label}</span>
              {item.badge !== undefined ? (
                <span className="pactor-chat-menu__badge">{item.badge}</span>
              ) : null}
            </button>
          </Fragment>
        );
      })}
    </nav>
  );
}

/**
 * Chat（spec: chat-dsl-component）：一等 DSL 聊天工作区组件——
 * 与 Button / Input 同级，注册后 `{ type: 'Chat', props, events }` 即可声明。
 *
 * 服务经最近的 ChatServicesProvider 读取（决策 D1）；缺失时渲染受控
 * 「未配置聊天服务」提示并 console.warn，不抛错。组合逻辑与
 * createChatWorkspace 共用内部 ChatComposition（决策 D5）。
 */
export function Chat({
  title,
  greeting,
  subtitle,
  suggestions,
  conversationId,
  params,
  showHeader,
  menu,
  activeMenuKey,
  sidebar,
  headerExtra,
  header,
  artifact,
  panelOpen,
  onPanelClose,
  inspector,
  onArtifact,
  onOpenArtifact,
  className,
  onSend,
  onMenuSelect,
}: ChatProps): ReactNode {
  const services = useChatServices();

  useEffect(() => {
    if (!services) {
      console.warn(
        '[pactor-chat] Chat 未检测到 ChatServicesProvider：请在应用根部以 ' +
          '<ChatServicesProvider> 注入 transport 等服务',
      );
    }
  }, [services]);

  if (!services) {
    return (
      <div className="pactor-chat-notice" role="note">
        未配置聊天服务：请在 Chat 外层使用 ChatServicesProvider 注入
        transport 等服务后重试。
      </div>
    );
  }

  // 侧栏槽优先（整体替代内建菜单）；否则 menu 数据驱动内建侧栏
  const sidebarSlot = resolveSlot(sidebar);
  const sidebarContent =
    sidebarSlot ??
    (menu && menu.length > 0 ? (
      <ChatSidebarMenu
        menu={menu}
        activeMenuKey={activeMenuKey}
        onMenuSelect={onMenuSelect}
      />
    ) : undefined);

  return (
    <ChatComposition
      services={services}
      title={title}
      greeting={greeting}
      subtitle={subtitle}
      suggestions={suggestions}
      conversationId={conversationId}
      params={params}
      className={className}
      showHeader={showHeader !== false}
      header={resolveSlot(header)}
      headerExtra={resolveSlot(headerExtra) ?? services.headerExtra}
      sidebar={sidebarContent}
      onSend={onSend}
      artifact={artifact}
      panelOpen={panelOpen}
      onPanelClose={onPanelClose}
      inspector={resolveSlot(inspector)}
      onArtifact={onArtifact}
      onOpenArtifact={onOpenArtifact}
    />
  );
}

/** Chat 的 DSL 组件类型名 */
export const CHAT_COMPONENT_TYPE = 'Chat';

type DslEventHandler = (event: unknown) => void;

/**
 * DSL 适配层（决策 D4）：renderer 把 events.onX 绑成单参函数（入参进
 * event 作用域），而 Chat 的 React 签名是 onSend(text) /
 * onMenuSelect(key, item)——适配器把调用折算为事件对象，
 * DSL 侧即 event.text / event.key / event.item / event.artifact。
 */
function ChatDslAdapter({
  onSend,
  onMenuSelect,
  onPanelClose,
  onArtifact,
  onOpenArtifact,
  ...rest
}: Omit<
  ChatProps,
  'onSend' | 'onMenuSelect' | 'onPanelClose' | 'onArtifact' | 'onOpenArtifact'
> & {
  onSend?: DslEventHandler;
  onMenuSelect?: DslEventHandler;
  onPanelClose?: DslEventHandler;
  onArtifact?: DslEventHandler;
  onOpenArtifact?: DslEventHandler;
}): ReactNode {
  return (
    <Chat
      {...rest}
      onSend={
        onSend ? (text: string) => onSend({ text }) : undefined
      }
      onMenuSelect={
        onMenuSelect
          ? (key: string, item: ChatMenuItem) => onMenuSelect({ key, item })
          : undefined
      }
      onPanelClose={onPanelClose ? () => onPanelClose({}) : undefined}
      onArtifact={
        onArtifact
          ? (artifact: ChatArtifact) => onArtifact({ artifact })
          : undefined
      }
      onOpenArtifact={
        onOpenArtifact
          ? (artifact: ChatArtifact) => onOpenArtifact({ artifact })
          : undefined
      }
    />
  );
}

/**
 * 注册 Chat DSL 组件（spec: chat-dsl-component / Chat 组件注册）：
 * 已存在同名类型时不覆盖（沿用 registerChatLayout 的语义）。
 * ChatShell（spec: chat-dsl-component / ChatShell 外壳组件，决策 D6）
 * 一并注册，同样不覆盖已有同名类型。
 */
export function registerChatComponent(registry: Registry<unknown>): void {
  if (!registry.has(CHAT_COMPONENT_TYPE)) {
    registry.register(CHAT_COMPONENT_TYPE, ChatDslAdapter);
  }
  registerChatShellComponent(registry);
}
