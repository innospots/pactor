import type { DslNode, Registry } from 'pactor-core';
import type { ReactNode } from 'react';

import type { ArtifactStore, ChatArtifact } from './artifact.js';
import type {
  ChatCapabilityRegistry,
  ChatConfirm,
  ChatPermissionChecker,
} from './capability-action.js';
import { ChatComposition, DslNodeSlot } from './chat-composition.js';
import { ChatServicesProvider } from './chat-services.js';
import type {
  ChatAttachment,
  ChatContextItem,
  ChatContextSource,
  ChatModelOption,
} from './model.js';
import type { ConversationStore } from './store.js';
import type { ChatTransport } from './transport.js';
import type { ChatSuggestion } from './view/EmptyState.js';
import type { ChatHeaderAction } from './view/WorkspaceHeader.js';

/**
 * ChatWorkspace 宿主服务（spec: chat-dsl-page，设计决策 D1）：
 * 全部运行时依赖与交互回调由宿主注入——表达式作用域只承载
 * 可序列化数据，函数 / 实例不进 DSL props。
 * （chat-dsl-component 起同型复用为 ChatServices，经 ChatServicesProvider
 * 注入；本工厂保留为 React 直连路径。）
 */
export interface ChatWorkspaceServices {
  /** 传输层（必填）：发送即经 runChatTurn 驱动一轮对话 */
  transport: ChatTransport;
  /** 外部自持 store；与 storeFactory 二选一，缺省包内默认构造 */
  store?: ConversationStore;
  /** 缺省 store 的创建工厂（仅首渲染调用一次） */
  storeFactory?: () => ConversationStore;
  /** 产出物面板 store（spec: chat-artifact-panel）；缺省包内默认构造 */
  artifactStore?: ArtifactStore;
  /** Safe Registry（createSafeRegistry 包装后的白名单注册表） */
  safeRegistry?: Registry<unknown>;
  /** capability 白名单与确认链 */
  capabilities?: ChatCapabilityRegistry;
  permission?: ChatPermissionChecker;
  confirm?: ChatConfirm;
  /** 注入 dsl part 作用域 user */
  user?: Record<string, unknown>;
  /**
   * 附件伪上传 / 上传：粘贴、拖拽、文件选择产出的 File[] 交给宿主处理，
   * 回传的 ChatAttachment[] 追加进受控附件区（支持异步）；发送后清空
   */
  onAttachFiles?: (
    files: File[],
  ) => ChatAttachment[] | Promise<ChatAttachment[]>;
  /** 附件卡片点击通知（预览等由宿主实现） */
  onAttachmentClick?: (attachment: ChatAttachment) => void;
  /** 发送回调（在 transport 驱动 turn 之前触发） */
  onSend?: (text: string) => void;
  /**
   * 声明式数据源解析出口（spec: chat-context-sources，设计决策 D1）：
   * contexts 的 service 引用（`{ service, params? }`）经此调用解析为
   * 候选数据；宿主桥到 ServiceRegistry 或自有实现。函数不进 DSL
   * props，统一经 ChatServices 注入。
   */
  callService?: (
    name: string,
    params?: Record<string, unknown>,
  ) => Promise<unknown>;
  /** 词边界 `@` 输入触发：query 为 `@` 后文本，anchorRect 为弹层锚点 */
  onMentionTrigger?: (query: string, anchorRect: DOMRect) => void;
  /** "+" 按钮触发弹层入口 */
  onPlusMenu?: (anchorRect: DOMRect) => void;
  /** Composer 工具栏左 / 右槽（ReactNode 闭包槽，纯 React 与 DSL 场景均可用） */
  toolbarStart?: ReactNode;
  toolbarEnd?: ReactNode;
  /** 工作区头部右侧扩展区（提供 title 或 headerExtra 时渲染头部） */
  headerExtra?: ReactNode;
}

/**
 * ChatWorkspace 的 DSL 安全 props（spec: chat-dsl-page / DSL 安全 props）：
 * 全部为 DSL 可表达的标量 / 数组 / 普通对象；函数与类实例一律不出现。
 */
export interface ChatWorkspaceProps {
  /** 工作区头部标题（提供 title 或服务注入 headerExtra 时渲染头部） */
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
  /**
   * 侧栏 DslNode 槽（任务 1.1 结论：renderer 对内嵌 DslNode prop 跳过提前
   * 求值，组件经 useRenderer().renderChildren 渲染）。提供时以 AppShell
   * 包裹工作区（侧栏 + 移动端抽屉）。仅页面运行时上下文内有效。
   */
  sidebar?: DslNode;
  /** Composer 工具栏右端 DslNode 槽（与服务注入的 toolbarEnd 先后渲染） */
  toolbarEnd?: DslNode;
  /**
   * 产出物面板受控 props（spec: chat-artifact-panel，决策 D2）：
   * 任一提供即全受控；都未提供时由内部 / 注入的 ArtifactStore 驱动
   */
  artifact?: ChatArtifact | null;
  panelOpen?: boolean;
  /** 面板关闭回调（runtime 绑定 events.onPanelClose 时以函数形态传入） */
  onPanelClose?: () => void;
  /** 面板内容 DslNode 槽：提供时整体替代内建渲染器 */
  inspector?: DslNode;
  /** artifact part 就绪回调（runtime 绑定 events.onArtifact 时传入） */
  onArtifact?: (artifact: ChatArtifact) => void;
  /** 产出物卡片"在面板中打开"回调（runtime 绑定 events.onOpenArtifact 时传入） */
  onOpenArtifact?: (artifact: ChatArtifact) => void;
  /**
   * 内建 header 操作组（spec: chat-dsl-component / Header 配置，决策 D4）：
   * 按数组顺序渲染（headerExtra 槽之前）；缺省不渲染
   */
  headerActions?: ChatHeaderAction[];
  /** 标题可编辑（点击进入编辑，Enter / blur 提交）；缺省 false */
  editableTitle?: boolean;
  onExport?: () => void;
  onThemeChange?: (theme: 'light' | 'dark') => void;
  onClear?: () => void;
  onTitleChange?: (title: string) => void;
  /** 内建模型选择（spec: chat-model-selector，决策 D5 受控规则） */
  models?: ChatModelOption[];
  model?: string;
  onModelChange?: (value: string) => void;
  /** 内建上下文数据源（spec: chat-context-sources） */
  contexts?: ChatContextSource[];
  onContextsChange?: (chips: ChatContextItem[]) => void;
  className?: string;
}

/**
 * createChatWorkspace（spec: chat-dsl-page / chat-dsl-component，决策 D5）：
 * 宿主闭包注入全部运行时服务，返回可注册进 DSL 组件注册表
 * （options.components）的 ChatWorkspace 组件。
 *
 * 实现为 ChatServicesProvider + ChatComposition 的薄封装（与 Chat 组件
 * 共用同一组合，逻辑单一来源）；行为与 DSL props 契约保持不变。
 */
export function createChatWorkspace(
  services: ChatWorkspaceServices,
): (props: ChatWorkspaceProps) => ReactNode {
  function ChatWorkspace({
    title,
    greeting,
    subtitle,
    suggestions,
    conversationId,
    params,
    sidebar,
    toolbarEnd,
    artifact,
    panelOpen,
    onPanelClose,
    inspector,
    onArtifact,
    onOpenArtifact,
    headerActions,
    editableTitle,
    onExport,
    onThemeChange,
    onClear,
    onTitleChange,
    models,
    model,
    onModelChange,
    contexts,
    onContextsChange,
    className,
  }: ChatWorkspaceProps): ReactNode {
    return (
      <ChatServicesProvider value={services}>
        <ChatComposition
          services={services}
          title={title}
          greeting={greeting}
          subtitle={subtitle}
          suggestions={suggestions}
          conversationId={conversationId}
          params={params}
          className={className}
          showHeader={
            title !== undefined || services.headerExtra !== undefined
          }
          headerExtra={services.headerExtra}
          sidebar={sidebar ? <DslNodeSlot node={sidebar} /> : undefined}
          toolbarEnd={toolbarEnd ? <DslNodeSlot node={toolbarEnd} /> : undefined}
          artifact={artifact}
          panelOpen={panelOpen}
          onPanelClose={onPanelClose}
          inspector={inspector ? <DslNodeSlot node={inspector} /> : undefined}
          onArtifact={onArtifact}
          onOpenArtifact={onOpenArtifact}
          headerActions={headerActions}
          editableTitle={editableTitle}
          onExport={onExport}
          onThemeChange={onThemeChange}
          onClear={onClear}
          onTitleChange={onTitleChange}
          models={models}
          model={model}
          onModelChange={onModelChange}
          contexts={contexts}
          onContextsChange={onContextsChange}
        />
      </ChatServicesProvider>
    );
  }

  return ChatWorkspace;
}
