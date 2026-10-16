import type { DslNode } from '@pactor-app/core';
import { useRenderer } from '@pactor-app/runtime';
import {
  Component,
  isValidElement,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

import { ArtifactStore, collectArtifacts, mergeArtifacts, type ChatArtifact } from './artifact.js';
import type { ChatWorkspaceServices } from './chat-workspace.js';
import { useChatModel } from './hooks/use-chat-model.js';
import type {
  BuiltinMessageAction,
  ChatAgentIdentity,
  ChatAttachment,
  ChatContextItem,
  ChatContextSource,
  ChatMessage,
  ChatMessageAction,
  ChatModelOption,
} from './model.js';
import { ConversationStore } from './store.js';
import { AppShell } from './view/AppShell.js';
import { ArtifactPanel } from './view/ChatArtifactPanel.js';
import { ChatView } from './view/ChatView.js';
import type { ChatSuggestion } from './view/EmptyState.js';
import { ModelSelect } from './view/ModelChip.js';
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
  /**
   * 会话级 Agent 身份（透传 ChatView）：assistant 消息顶部
   * 「图标 + 加粗名称」展示的兜底，消息自带 message.agent 优先
   */
  agent?: ChatAgentIdentity;
  subtitle?: string;
  suggestions?: ChatSuggestion[];
  conversationId?: string;
  params?: Record<string, unknown>;
  /**
   * 是否渲染头部：显式 false 关闭；未传（undefined）按内容自动判定——
   * header 槽 / title / headerExtra / headerActions / header 位模型 chip
   * 任一存在才渲染，无内容时 `.pactor-chat-workspace__header` 节点不渲染
   */
  showHeader?: boolean;
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
  /** Composer 工具栏左 / 右附加槽（与服务注入的同名槽先后渲染，服务槽在先） */
  toolbarStart?: ReactNode;
  /** Composer 工具栏右端附加槽（与服务注入的 toolbarEnd 先后渲染） */
  toolbarEnd?: ReactNode;
  /** Composer footer 槽（spec: chat-composer-slots；与服务注入的 composerFooter 先后渲染，服务槽在先） */
  composerFooter?: ReactNode;
  /** Composer 下方自定义内容槽（与服务注入的 composerBottom 先后渲染，服务槽在先；未提供不渲染） */
  composerBottom?: ReactNode;
  /** 隐藏 Composer 工具栏行（透传 ChatView；toolbar 槽一并抑制，Enter 发送保留） */
  hideToolbar?: boolean;
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
  /**
   * 多产物列表（tabs / 目录列表视图数据源）：非受控时缺省取内部
   * ArtifactStore 的列表；受控场景由宿主注入（配合 onSelectArtifact）
   */
  artifacts?: ChatArtifact[];
  /** tab / 目录列表点击切换回调；受控场景的典型接法：setState artifact=... */
  onSelectArtifact?: (artifact: ChatArtifact) => void;
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
  /**
   * 卡片区"查看所有产物（n)"点击回调（spec: chat-artifact-panel /
   * 卡片区收起）：无条件触发——受控场景的开面板入口（DSL 侧典型接法：
   * setState panelOpen=true）；面板同时经内部信号定位产物目录视图；
   * 非受控场景并行打开面板（无激活产物时激活列表首项）。
   */
  onOpenArtifactList?: () => void;
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
  agent,
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
  toolbarStart,
  toolbarEnd,
  composerFooter,
  composerBottom,
  hideToolbar,
  className,
  onSend,
  artifact,
  panelOpen,
  artifacts: artifactsProp,
  onSelectArtifact,
  onPanelClose,
  inspector,
  onArtifact,
  onOpenArtifact,
  onOpenArtifactList,
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
  // 多产物列表：tabs / 目录列表视图的数据源——消息流归集为主
  // （受控 / 非受控一致），合并 store 打开记录（流式补丁版本优先）。
  // 消息数组引用不变时 useMemo 结果稳定（快照安全）
  const storeArtifacts = useSyncExternalStore(
    (listener) => artifactStore.subscribe(listener),
    () => artifactStore.list(),
  );
  const messages = useSyncExternalStore(
    (listener) => store.subscribe(listener),
    () => store.getMessages(),
  );
  const streamArtifacts = useMemo(() => collectArtifacts(messages), [messages]);
  const mergedArtifacts = useMemo(
    () => mergeArtifacts(streamArtifacts, storeArtifacts),
    [streamArtifacts, storeArtifacts],
  );
  const effectiveArtifact = panelControlled
    ? (artifact ?? null)
    : storeArtifact;
  const effectivePanelOpen = panelControlled
    ? (panelOpen ?? artifact != null)
    : storeArtifact !== null;
  const effectiveArtifacts = artifactsProp ?? mergedArtifacts;
  const handleSelectArtifact = (next: ChatArtifact): void => {
    onSelectArtifact?.(next);
    if (!panelControlled) {
      // open = upsert + 激活：流内未打开过的产物一并入列
      artifactStore.open(next);
    }
  };

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

  // 卡片区"查看所有产物"：无条件触发宿主回调（受控场景的开面板入口）；
  // 面板经 viewRequest 信号定位产物目录视图（受控 / 非受控一致）；
  // 非受控时并行打开面板（无激活产物时激活列表首项——面板打开条件
  // 为 store 存在激活项，目录视图下该激活项不作内容展示）
  const [listViewRequest, setListViewRequest] = useState<number | null>(null);
  const handleOpenArtifactList = (): void => {
    onOpenArtifactList?.();
    setListViewRequest((value) => (value ?? 0) + 1);
    if (!panelControlled && artifactStore.get() === null) {
      const first = mergedArtifacts[0];
      if (first !== undefined) {
        artifactStore.open(first);
      }
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
      <ModelSelect
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

  // 工具栏左端 / footer（spec: chat-composer-slots）：服务槽在先、props 槽在后
  const mergedToolbarStart =
    services.toolbarStart !== undefined || toolbarStart !== undefined ? (
      <>
        {services.toolbarStart}
        {toolbarStart}
      </>
    ) : undefined;
  const mergedComposerFooter =
    services.composerFooter !== undefined || composerFooter !== undefined ? (
      <>
        {services.composerFooter}
        {composerFooter}
      </>
    ) : undefined;
  // Composer 下方自定义内容：服务槽在先、props 槽在后（同 footer 合并规则）
  const mergedComposerBottom =
    services.composerBottom !== undefined || composerBottom !== undefined ? (
      <>
        {services.composerBottom}
        {composerBottom}
      </>
    ) : undefined;

  // 头部内容判定：showHeader 显式 false 关闭；否则任一内容存在才渲染
  // （无内容时 workspace__header 节点整体零渲染）
  const hasHeaderContent =
    header !== undefined && header !== null
      ? true
      : title !== undefined ||
        (headerExtra !== undefined && headerExtra !== null) ||
        (headerActions !== undefined && headerActions.length > 0) ||
        headerModelChip !== undefined;
  const renderHeader = showHeader !== false && hasHeaderContent;

  // header 不随对话列限宽：上移为全宽容器（host / with-header 包裹层）
  // 的直接子级，产物面板调宽时保持通栏
  const workspaceHeader = renderHeader
    ? (header ?? (
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
    : null;

  const workspace = (
    <div
      className={`pactor-chat-workspace${className ? ` ${className}` : ''}`}
    >
      <ChatView
        store={store}
        transport={services.transport}
        agent={agent}
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
        toolbarStart={mergedToolbarStart}
        toolbarEnd={mergedToolbarEnd}
        composerFooter={mergedComposerFooter}
        composerBottom={mergedComposerBottom}
        hideToolbar={hideToolbar}
        onMentionTrigger={services.onMentionTrigger}
        onPlusMenu={services.onPlusMenu}
        onArtifact={onArtifact}
        onOpenArtifact={handleOpenArtifact}
        onOpenArtifactList={handleOpenArtifactList}
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
  // header 位置：收进 __main 左列（header + 对话区），随 __main 通栏
  // （左贴宿主边缘、右贴面板分隔线）——面板独占右列全高，header 不覆盖
  // 面板上方；面板关闭时 __main 占满行宽，header 同样通栏。
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
    onOpenArtifactList !== undefined ||
    services.artifactStore !== undefined;
  if (!panelFeatureUsed && !effectivePanelOpen) {
    return workspaceHeader ? (
      <div className="pactor-chat-with-header">
        {workspaceHeader}
        {main}
      </div>
    ) : (
      main
    );
  }
  return (
    <div className="pactor-chat-inspector-host">
      <div className="pactor-chat-inspector-host__row">
        <div className="pactor-chat-inspector-host__main">
          {workspaceHeader}
          {main}
        </div>
        {effectivePanelOpen ? (
          <>
            <div
              className="pactor-chat-inspector__scrim"
              aria-hidden
              onClick={handlePanelClose}
            />
            <ArtifactPanel
              artifact={effectiveArtifact}
              artifacts={effectiveArtifacts}
              activeArtifactId={effectiveArtifact?.id}
              onSelectArtifact={handleSelectArtifact}
              inspector={inspector}
              onClose={handlePanelClose}
              safeRegistry={services.safeRegistry}
              user={services.user}
              artifactViewers={services.artifactViewers}
              viewRequest={listViewRequest}
              onViewRequestConsumed={() => setListViewRequest(null)}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
