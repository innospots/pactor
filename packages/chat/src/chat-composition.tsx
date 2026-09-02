import type { DslNode } from '@pactor-app/core';
import { useRenderer } from '@pactor-app/runtime';
import {
  Component,
  isValidElement,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

import { ArtifactStore, type ChatArtifact } from './artifact.js';
import type { ChatWorkspaceServices } from './chat-workspace.js';
import { useChatModel } from './hooks/use-chat-model.js';
import type {
  BuiltinMessageAction,
  ChatAttachment,
  ChatContextItem,
  ChatContextSource,
  ChatMessage,
  ChatMessageAction,
  ChatModelOption,
} from './model.js';
import { ConversationStore } from './store.js';
import { AppShell } from './view/AppShell.js';
import { ArtifactPanel } from './view/ArtifactPanel.js';
import { ChatView } from './view/ChatView.js';
import type { ChatSuggestion } from './view/EmptyState.js';
import { ModelChip } from './view/ModelChip.js';
import {
  WorkspaceHeader,
  type ChatHeaderAction,
} from './view/WorkspaceHeader.js';

/**
 * 渲染内嵌 DslNode 槽：经 useRenderer().renderChildren 以当前作用域渲染
 * （Table columns[].cell 同款机制）。仅在页面运行时（DslRenderer）上下文
 * 内挂载——纯 React 直连场景请用服务的 ReactNode 槽。
 */
function DslNodeSlotInner({ node }: { node: DslNode }): ReactNode {
  const { renderChildren } = useRenderer();
  return renderChildren([node]);
}

/**
 * DslNode 槽的受控降级守卫（spec: chat-dsl-component）：useRenderer 在
 * DslRenderer 之外抛错，纯 React 场景传入 DslNode 槽时告警并跳过，
 * 不击穿整棵子树。
 */
class DslSlotGuard extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  override state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  override componentDidCatch(): void {
    console.warn(
      '[@pactor-app/chat] DslNode 槽仅在页面运行时（DslRenderer）上下文内可渲染，已跳过',
    );
  }

  override render(): ReactNode {
    return this.state.failed ? null : this.props.children;
  }
}

/** 带降级守卫的 DslNode 槽渲染 */
export function DslNodeSlot({ node }: { node: DslNode }): ReactNode {
  return (
    <DslSlotGuard>
      <DslNodeSlotInner node={node} />
    </DslSlotGuard>
  );
}

/**
 * 判定值是否为 DslNode（带字符串 `type` 字段的普通对象）。
 * React 元素同样带 `type`（宿主元素为字符串），须先经 isValidElement 排除。
 */
export function isDslNodeValue(value: unknown): value is DslNode {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !isValidElement(value) &&
    typeof (value as { type?: unknown }).type === 'string'
  );
}

/**
 * 解析 DslNode / ReactNode 双型槽（spec: chat-dsl-component，设计决策 D3）：
 * DslNode 经 renderChildren 渲染（页面运行时内），ReactNode 原样渲染。
 */
export function resolveSlot(slot: DslNode | ReactNode | undefined): ReactNode {
  if (slot === undefined || slot === null) {
    return undefined;
  }
  if (isDslNodeValue(slot)) {
    return <DslNodeSlot node={slot} />;
  }
  return slot;
}

/**
 * ChatComposition 的入参：服务 + 已解析的槽位内容（ReactNode）。
 * DslNode / ReactNode 的判定与渲染由调用方（Chat / ChatWorkspace）完成。
 */
export interface ChatCompositionProps {
  services: ChatWorkspaceServices;
  title?: string;
  greeting?: string;
  subtitle?: string;
  suggestions?: ChatSuggestion[];
  conversationId?: string;
  params?: Record<string, unknown>;
  /** 是否渲染头部（由调用方按自身默认规则计算后传入） */
  showHeader: boolean;
  /** 整体替换内建 header（提供且 showHeader 时渲染） */
  header?: ReactNode;
  /** 内建 header 标题右侧扩展区 */
  headerExtra?: ReactNode;
  /**
   * 内建 header 操作组（spec: chat-dsl-component / Header 配置，决策 D4）：
   * 按数组顺序渲染在 headerExtra 槽之前；缺省 / 空数组不渲染任何操作按钮。
   * 默认行为总在包内执行（export 下载 Markdown / theme 切换
   * data-pactor-theme / clear 清空 store），事件为并行通知
   */
  headerActions?: ChatHeaderAction[];
  /** 标题可编辑（点击进入编辑，Enter / blur 提交）；缺省 false */
  editableTitle?: boolean;
  onExport?: () => void;
  onThemeChange?: (theme: 'light' | 'dark') => void;
  onClear?: () => void;
  onTitleChange?: (title: string) => void;
  /**
   * 内建模型选择（spec: chat-model-selector，决策 D5）：透传 ChatView；
   * model + onModelChange 同时提供即受控，仅 models 时非受控缺省 models[0]
   */
  models?: ChatModelOption[];
  model?: string;
  onModelChange?: (value: string) => void;
  /**
   * 模型 chip 渲染位置（spec: chat-model-selector / 模型选择位置配置，
   * 决策 D2）：缺省 'composer'；'header' 时 chip 渲染在工作区头部左端
   * （title 之前），Composer 不再渲染 chip
   */
  modelPlacement?: 'composer' | 'header';
  /** 内建上下文数据源（spec: chat-context-sources）：透传 ChatView */
  contexts?: ChatContextSource[];
  onContextsChange?: (chips: ChatContextItem[]) => void;
  /**
   * 消息操作条声明式配置（spec: chat-message-actions，决策 D1/D5）：
   * 透传 ChatView；缺省渲染内建 copy / regenerate / retry / edit
   */
  messageActions?: Array<BuiltinMessageAction | ChatMessageAction>;
  /** 全部消息动作（含内建）点击的并行通知（透传 ChatView） */
  onMessageAction?: (actionId: string, message: ChatMessage) => void;
  /** 侧栏内容（提供时以 AppShell 包裹工作区，含移动端抽屉） */
  sidebar?: ReactNode;
  /** Composer 工具栏右端附加槽（与服务注入的 toolbarEnd 先后渲染） */
  toolbarEnd?: ReactNode;
  className?: string;
  /** 发送回调：在 services.onSend 之后触发，均在 transport turn 之前 */
  onSend?: (text: string) => void;
  /**
   * 产出物面板（spec: chat-artifact-panel，设计决策 D2）——受控优先：
   * `panelOpen` 或 `artifact` 任一提供即全受控（以 props 为准，panelOpen
   * 缺省随 artifact 是否存在推导）；都未提供时由内部 / 注入的
   * ArtifactStore 状态驱动。都未配置且面板未打开时不渲染面板 DOM。
   */
  artifact?: ChatArtifact | null;
  panelOpen?: boolean;
  /** 面板关闭按钮 / 窄屏遮罩点击回调（DSL 侧典型接法：setState panelOpen=false） */
  onPanelClose?: () => void;
  /** 面板内容槽：提供时整体替代内建渲染器（标题栏保留） */
  inspector?: ReactNode;
  /** artifact part 就绪（status ready）时触发（透传 ChatView） */
  onArtifact?: (artifact: ChatArtifact) => void;
  /**
   * 产出物卡片"在面板中打开"按钮点击回调（spec: chat-artifact-panel）：
   * 无条件触发——受控场景的面板打开入口（DSL 侧典型接法：
   * setState artifact=${event.artifact}, panelOpen=true）；非受控场景
   * 并行 store.open（纯 React 零接线可用）。
   */
  onOpenArtifact?: (artifact: ChatArtifact) => void;
}

/**
 * ChatComposition（spec: chat-dsl-component，设计决策 D5）：
 * ChatWorkspace 与 Chat 共用的组合逻辑——AppShell 包裹 / 工作区头部 /
 * ChatView 装配 / store 自持（ref 保持）/ 附件受控状态。槽位一律以
 * 已解析的 ReactNode 传入，组合层不关心 DSL。
 */
export function ChatComposition({
  services,
  title,
  greeting,
  subtitle,
  suggestions,
  conversationId,
  params,
  showHeader,
  header,
  headerExtra,
  headerActions,
  editableTitle,
  onExport,
  onThemeChange,
  onClear,
  onTitleChange,
  models,
  model,
  onModelChange,
  modelPlacement = 'composer',
  contexts,
  onContextsChange,
  messageActions,
  onMessageAction,
  sidebar,
  toolbarEnd,
  className,
  onSend,
  artifact,
  panelOpen,
  onPanelClose,
  inspector,
  onArtifact,
  onOpenArtifact,
}: ChatCompositionProps): ReactNode {
  // store 首渲染确定、ref 保持：重渲染 / props 变化不重建（决策 D2）
  const storeRef = useRef<ConversationStore | null>(null);
  if (storeRef.current === null) {
    storeRef.current =
      services.store ?? services.storeFactory?.() ?? new ConversationStore();
  }
  const store = storeRef.current;

  // ArtifactStore（决策 D1）：与 ConversationStore 同款 ref 自持 +
  // services.artifactStore 注入；受控模式下仍可被卡片按钮安全调用
  const artifactStoreRef = useRef<ArtifactStore | null>(null);
  if (artifactStoreRef.current === null) {
    artifactStoreRef.current = services.artifactStore ?? new ArtifactStore();
  }
  const artifactStore = artifactStoreRef.current;

  // 受控规则（决策 D2）：panelOpen 或 artifact 任一提供即全受控
  const panelControlled = panelOpen !== undefined || artifact !== undefined;
  const storeArtifact = useSyncExternalStore(
    (listener) => artifactStore.subscribe(listener),
    () => artifactStore.get(),
  );
  const effectiveArtifact = panelControlled
    ? (artifact ?? null)
    : storeArtifact;
  const effectivePanelOpen = panelControlled
    ? (panelOpen ?? artifact != null)
    : storeArtifact !== null;

  // 关闭：受控只回调（面板不单方面改外部状态）；非受控同时落 store
  const handlePanelClose = (): void => {
    onPanelClose?.();
    if (!panelControlled) {
      artifactStore.close();
    }
  };

  // 卡片"在面板中打开"：无条件触发宿主回调（受控场景的开面板入口）；
  // 非受控时并行落 store（纯 React 零接线可用）
  const handleOpenArtifact = (next: ChatArtifact): void => {
    onOpenArtifact?.(next);
    if (!panelControlled) {
      artifactStore.open(next);
    }
  };

  // 附件受控状态：宿主 onAttachFiles 回传的附件追加；发送后清空
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);

  const handleAttachFiles = services.onAttachFiles
    ? (files: File[]): void => {
        void Promise.resolve(services.onAttachFiles!(files)).then(
          (created) => {
            if (created && created.length > 0) {
              setAttachments((prev) => [...prev, ...created]);
            }
          },
        );
      }
    : undefined;

  const handleSend = (text: string): void => {
    services.onSend?.(text);
    onSend?.(text);
    setAttachments([]);
  };

  // 模型状态上移（spec: chat-model-selector，决策 D2）：组合层解析
  // 受控/非受控选中态，解析结果以受控形态同时下发 WorkspaceHeader
  // （header 位 chip）与 ChatView（composer 位 chip + ChatInput.model），
  // 两个位置共享同一状态；ChatView 单独使用时仍自持（同 hook 兜底）
  const { modelsEnabled, currentModel, handleModelChange } = useChatModel({
    models,
    model,
    onModelChange,
  });
  const headerModelChip =
    modelPlacement === 'header' && modelsEnabled ? (
      <ModelChip
        models={models!}
        model={currentModel}
        onModelChange={handleModelChange}
      />
    ) : undefined;

  // 工具栏右端：宿主闭包 ReactNode 槽 + 附加槽（如 DSL toolbarEnd）先后渲染
  const mergedToolbarEnd =
    services.toolbarEnd !== undefined || toolbarEnd !== undefined ? (
      <>
        {services.toolbarEnd}
        {toolbarEnd}
      </>
    ) : undefined;

  const workspace = (
    <div
      className={`pactor-chat-workspace${className ? ` ${className}` : ''}`}
    >
      {showHeader ? (
        (header ?? (
          <WorkspaceHeader
            title={title}
            headerExtra={headerExtra}
            headerActions={headerActions}
            editableTitle={editableTitle}
            headerStart={headerModelChip}
            store={store}
            onExport={onExport}
            onThemeChange={onThemeChange}
            onClear={onClear}
            onTitleChange={onTitleChange}
          />
        ))
      ) : null}
      <ChatView
        store={store}
        transport={services.transport}
        onSend={handleSend}
        safeRegistry={services.safeRegistry}
        capabilities={services.capabilities}
        permission={services.permission}
        confirm={services.confirm}
        conversationId={conversationId}
        user={services.user}
        params={params}
        greeting={greeting}
        subtitle={subtitle}
        suggestions={suggestions}
        attachments={attachments}
        onAttachmentsChange={setAttachments}
        onAttachFiles={handleAttachFiles}
        onAttachmentClick={services.onAttachmentClick}
        toolbarStart={services.toolbarStart}
        toolbarEnd={mergedToolbarEnd}
        onMentionTrigger={services.onMentionTrigger}
        onPlusMenu={services.onPlusMenu}
        onArtifact={onArtifact}
        onOpenArtifact={handleOpenArtifact}
        models={models}
        model={currentModel}
        onModelChange={handleModelChange}
        modelPlacement={modelPlacement}
        contexts={contexts}
        onContextsChange={onContextsChange}
        callService={services.callService}
        messageActions={messageActions}
        onMessageAction={onMessageAction}
      />
    </div>
  );

  // 侧栏：提供时以 AppShell 包裹（侧栏 + 移动端抽屉）
  const main = sidebar ? <AppShell sidebar={sidebar}>{workspace}</AppShell> : workspace;

  // 产出物面板（决策 D2）：打开时 workspace 与面板 flex 同行；
  // 窄屏由 CSS 媒体查询退化为右侧覆盖抽屉（遮罩点击关闭）；
  // 关闭 / 未配置时不渲染面板 DOM。
  //
  // 结构稳定性：面板功能被使用（受控 props / 事件回调 / inspector /
  // 注入 artifactStore 任一提供）时恒渲染 host 包裹层，面板开关只改
  // host 内面板子树的显隐——否则 main 在树中的深度随开关变化，整个
  // ChatView 子树重挂载（composer 草稿丢失、onArtifact 去重 ref 重置
  // 导致历史 ready part 重放）。功能完全未使用且面板未打开时保持
  // 直返 main（零渲染承诺不破）。
  const panelFeatureUsed =
    artifact !== undefined ||
    panelOpen !== undefined ||
    inspector !== undefined ||
    onPanelClose !== undefined ||
    onArtifact !== undefined ||
    onOpenArtifact !== undefined ||
    services.artifactStore !== undefined;
  if (!panelFeatureUsed && !effectivePanelOpen) {
    return main;
  }
  return (
    <div className="pactor-chat-inspector-host">
      {main}
      {effectivePanelOpen ? (
        <>
          <div
            className="pactor-chat-inspector__scrim"
            aria-hidden
            onClick={handlePanelClose}
          />
          <ArtifactPanel
            artifact={effectiveArtifact}
            inspector={inspector}
            onClose={handlePanelClose}
            safeRegistry={services.safeRegistry}
            user={services.user}
          />
        </>
      ) : null}
    </div>
  );
}
