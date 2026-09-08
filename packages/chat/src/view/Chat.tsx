import type { DslNode, Registry } from '@pactor-app/core';
import { createComponentRegistry, Icon, RailTooltip } from '@pactor-app/ui/components';
import { Fragment, useEffect, useRef, type ReactNode } from 'react';

import { ChatComposition, resolveSlot } from '../chat-composition.js';
import { useChatServices } from '../chat-services.js';
import type { ChatArtifact } from '../artifact.js';
import type {
  BuiltinMessageAction,
  ChatContextItem,
  ChatContextSource,
  ChatMessage,
  ChatMessageAction,
  ChatModelOption,
} from '../model.js';
import { useSidebarDrawer } from './AppShell.js';
import { setChatChromeHandlers } from './chrome/actions.js';
import { ChromeSlot } from './chrome/ChromeSlot.js';
import { buildSidebarMenuFragment } from './chrome/menu.js';
import { registerChatShellComponent } from './ChatShell.js';
import type { ChatSuggestion } from './EmptyState.js';
import type { ChatHeaderAction } from './WorkspaceHeader.js';

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
  /** 状态圆点（spec: chat-dsl-component / 菜单项状态点，决策 D4）：label 右侧渲染 danger 系小圆点；与 badge 可共存 */
  dot?: boolean;
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
  /** 传 false 关闭 header；缺省按内容自动渲染（header 槽整体替换 > title + headerExtra / headerActions / header 位模型 chip 内建 header，均无内容时 header 节点不渲染） */
  showHeader?: boolean;
  /** 左侧菜单数据；提供时以 AppShell 承载内建侧栏 */
  menu?: ChatMenuItem[];
  /** 受控高亮项 key（DSL 侧可绑 ${state.x}，经 onMenuSelect + setState 闭环） */
  activeMenuKey?: string;
  /** 侧栏槽：提供时替代内建菜单侧栏 */
  sidebar?: DslNode | ReactNode;
  /**
   * Composer 槽（spec: chat-composer-slots / Composer 槽配置）：
   * toolbarStart 工具栏左端 / toolbarEnd 工具栏右端（发送钮之前）/
   * composerFooter footer 区域（工具栏下方、带分隔线）；
   * 与服务注入的同名槽并存时服务槽在先
   */
  toolbarStart?: DslNode | ReactNode;
  toolbarEnd?: DslNode | ReactNode;
  composerFooter?: DslNode | ReactNode;
  /**
   * Composer 下方自定义内容槽（DslNode | ReactNode）：
   * 渲染在 Composer 之外正下方（页面底部留白区内），
   * 与服务注入的同名槽并存时服务槽在先；未提供不渲染
   */
  composerBottom?: DslNode | ReactNode;
  /**
   * 隐藏 Composer 工具栏行（缺省 false；DSL 可序列化标量）：
   * true 时工具栏行整体不渲染，toolbarStart / toolbarEnd 槽一并抑制
   * （composerFooter 槽不受影响），Enter 发送保留
   */
  hideToolbar?: boolean;
  /** 内建 header 标题右侧槽 */
  headerExtra?: DslNode | ReactNode;
  /** header 槽：整体替换内建 header */
  header?: DslNode | ReactNode;
  /**
   * 内建 header 操作组（spec: chat-dsl-component / Header 配置，决策 D4）：
   * 按数组顺序渲染 export / theme / clear 图标按钮（headerExtra 槽之前）；
   * 缺省不渲染。默认行为总在包内执行，事件为并行通知
   */
  headerActions?: ChatHeaderAction[];
  /** 标题可编辑（点击进入编辑，Enter / blur 提交）；缺省 false */
  editableTitle?: boolean;
  onExport?: () => void;
  onThemeChange?: (theme: 'light' | 'dark') => void;
  onClear?: () => void;
  onTitleChange?: (title: string) => void;
  /**
   * 内建模型选择（spec: chat-model-selector）：DSL 可表达数据；
   * model + onModelChange 构成受控闭环（典型接法：
   * model: ${state.model} + events.onModelChange → setState）
   */
  models?: ChatModelOption[];
  model?: string;
  onModelChange?: (value: string) => void;
  /** 模型 chip 渲染位置（spec: chat-model-selector / 模型选择位置配置，决策 D2；DSL 可序列化标量，缺省 'composer'） */
  modelPlacement?: 'composer' | 'header';
  /** 内建上下文数据源（spec: chat-context-sources）；service 引用经 ChatServices.callService 解析 */
  contexts?: ChatContextSource[];
  onContextsChange?: (chips: ChatContextItem[]) => void;
  /**
   * 消息操作条声明式配置（spec: chat-message-actions，决策 D1）：
   * DSL 可序列化数据；缺省渲染内建 copy / regenerate / retry / edit；
   * 传入数组时严格按数组渲染（数组即真相），自定义动作 service 引用经
   * ChatServices.callService 派发
   */
  messageActions?: Array<BuiltinMessageAction | ChatMessageAction>;
  /** 消息动作点击通知（event 作用域含 action 与 message；内建动作亦通知） */
  onMessageAction?: (actionId: string, message: ChatMessage) => void;
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

/**
 * 菜单图标名（spec: chat-icon-convergence）：契约取值（plus / chat /
 * history / settings / star / search / user / folder）直接作为 ui Icon
 * 白名单名渲染，未知名由 ui Icon 渲染占位图标，不抛错。
 * 白名单曾映射 lucide 子集（MENU_ICONS），收敛后删除。
 */

/** 内建侧栏：menu 数据驱动的菜单（分组标题 + 图标 + badge + disabled）；ChatShell 同款复用。
 * chrome DSL 渲染层（spec: chat-on-ui-components）：DSL 环境优先经宿主
 * Menu 组件组合渲染（chat.menuSelect 接回同一传播与 drawer close），
 * 无 renderer / 类型缺失时回退下方手写菜单 */
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

  // DSL 路径的选择桥接：chat.menuSelect → 同一 onMenuSelect 传播 + drawer close
  const menuRef = useRef(menu);
  menuRef.current = menu;
  const selectRef = useRef(onMenuSelect);
  selectRef.current = onMenuSelect;
  const drawerRef = useRef(drawer);
  drawerRef.current = drawer;
  useEffect(() => {
    setChatChromeHandlers({
      menuSelect: (key) => {
        const item = menuRef.current.find((entry) => entry.key === key);
        if (item === undefined || item.disabled === true) {
          return;
        }
        selectRef.current?.(key, item);
        drawerRef.current?.close();
      },
    });
  }, []);

  const fallback = (() => {
    let lastGroup: string | undefined;
    return (
      <nav className="pactor-chat-menu" aria-label="会话导航">
        {menu.map((item) => {
          const groupLabel =
            item.group !== undefined && item.group !== lastGroup
              ? item.group
              : undefined;
          lastGroup = item.group;
          const active = item.key === activeMenuKey;
          const collapsed = drawer?.collapsed === true;
          const button = (
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
                <span className="pactor-chat-menu__icon">
                  {/* 未知名由 ui Icon 渲染占位（spec: chat-icon-convergence） */}
                  <Icon name={item.icon} size={15} strokeWidth={1.7} />
                </span>
              ) : null}
              <span className="pactor-chat-menu__label">{item.label}</span>
              {item.dot === true ? (
                <span className="pactor-chat-menu__dot" aria-hidden />
              ) : null}
              {item.badge !== undefined ? (
                <span className="pactor-chat-menu__badge">{item.badge}</span>
              ) : null}
            </button>
          );
          return (
            <Fragment key={item.key}>
              {groupLabel !== undefined ? (
                <div className="pactor-chat-menu__group">{groupLabel}</div>
              ) : null}
              {/* icon rail（桌面折叠态，决策 D3）：label 经 CSS 隐藏，
                  hover 经 RailTooltip 展示（可访问名同源） */}
              {collapsed ? (
                <RailTooltip label={item.label}>{button}</RailTooltip>
              ) : (
                button
              )}
            </Fragment>
          );
        })}
      </nav>
    );
  })();

  return (
    <ChromeSlot
      fragment={buildSidebarMenuFragment({ menu, activeMenuKey })}
      fallback={fallback}
    />
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
  toolbarStart,
  toolbarEnd,
  composerFooter,
  composerBottom,
  hideToolbar,
  headerExtra,
  header,
  headerActions,
  editableTitle,
  onExport,
  onThemeChange,
  onClear,
  onTitleChange,
  models,
  model,
  onModelChange,
  modelPlacement,
  contexts,
  onContextsChange,
  messageActions,
  onMessageAction,
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
        '[@pactor-app/chat] Chat 未检测到 ChatServicesProvider：请在应用根部以 ' +
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
      showHeader={showHeader}
      header={resolveSlot(header)}
      headerExtra={resolveSlot(headerExtra) ?? services.headerExtra}
      toolbarStart={resolveSlot(toolbarStart)}
      toolbarEnd={resolveSlot(toolbarEnd)}
      composerFooter={resolveSlot(composerFooter)}
      composerBottom={resolveSlot(composerBottom)}
      hideToolbar={hideToolbar}
      headerActions={headerActions}
      editableTitle={editableTitle}
      onExport={onExport}
      onThemeChange={onThemeChange}
      onClear={onClear}
      onTitleChange={onTitleChange}
      models={models}
      model={model}
      onModelChange={onModelChange}
      modelPlacement={modelPlacement}
      contexts={contexts}
      onContextsChange={onContextsChange}
      messageActions={messageActions}
      onMessageAction={onMessageAction}
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
 * DSL 侧即 event.text / event.key / event.item / event.artifact /
 * event.model / event.contexts / event.theme / event.title /
 * event.action / event.message（onMessageAction）
 * （onExport / onClear / onPanelClose 为空对象 {}）。
 */
function ChatDslAdapter({
  onSend,
  onMenuSelect,
  onPanelClose,
  onArtifact,
  onOpenArtifact,
  onModelChange,
  onContextsChange,
  onMessageAction,
  onExport,
  onThemeChange,
  onClear,
  onTitleChange,
  ...rest
}: Omit<
  ChatProps,
  | 'onSend'
  | 'onMenuSelect'
  | 'onPanelClose'
  | 'onArtifact'
  | 'onOpenArtifact'
  | 'onModelChange'
  | 'onContextsChange'
  | 'onMessageAction'
  | 'onExport'
  | 'onThemeChange'
  | 'onClear'
  | 'onTitleChange'
> & {
  onSend?: DslEventHandler;
  onMenuSelect?: DslEventHandler;
  onPanelClose?: DslEventHandler;
  onArtifact?: DslEventHandler;
  onOpenArtifact?: DslEventHandler;
  onModelChange?: DslEventHandler;
  onContextsChange?: DslEventHandler;
  onMessageAction?: DslEventHandler;
  onExport?: DslEventHandler;
  onThemeChange?: DslEventHandler;
  onClear?: DslEventHandler;
  onTitleChange?: DslEventHandler;
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
      onModelChange={
        onModelChange ? (model: string) => onModelChange({ model }) : undefined
      }
      onContextsChange={
        onContextsChange
          ? (contexts: ChatContextItem[]) => onContextsChange({ contexts })
          : undefined
      }
      onMessageAction={
        onMessageAction
          ? (action: string, message: ChatMessage) =>
              onMessageAction({ action, message })
          : undefined
      }
      onExport={onExport ? () => onExport({}) : undefined}
      onThemeChange={
        onThemeChange
          ? (theme: 'light' | 'dark') => onThemeChange({ theme })
          : undefined
      }
      onClear={onClear ? () => onClear({}) : undefined}
      onTitleChange={
        onTitleChange ? (title: string) => onTitleChange({ title }) : undefined
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

/**
 * 便捷工厂：创建含全部内置组件 + Chat / ChatShell 的组件注册表，
 * 直接作为 createPactorApplication 的 componentRegistry 选项：
 *
 * ```ts
 * import { createChatComponentRegistry } from '@pactor-app/chat';
 *
 * createPactorApplication({
 *   appId: 'my-chat',
 *   componentRegistry: createChatComponentRegistry,
 * });
 * ```
 */
export function createChatComponentRegistry(): Registry<unknown> {
  const registry = createComponentRegistry();
  registerChatComponent(registry);
  return registry;
}
