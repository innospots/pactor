import { Icon } from '@pactor-app/ui/components';
import { Registry } from '@pactor-app/core';
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';

import type { ChatArtifact } from '../artifact.js';
import type { ChatConfirm, ChatPermissionChecker } from '../capability-action.js';
import type { ChatCapabilityRegistry } from '../capability-action.js';
import { CHAT_DENIED_TYPE } from '../dsl-guard.js';
import { useChatAutoScroll } from '../hooks/use-chat-auto-scroll.js';
import { useChatModel } from '../hooks/use-chat-model.js';
import type {
  BuiltinMessageAction,
  ChatAgentIdentity,
  ChatContextItem,
  ChatContextSource,
  ChatMessage,
  ChatMessageAction,
  ChatModelOption,
} from '../model.js';
import {
  createChatRuntime,
  type ChatRuntime,
  type ChatScope,
} from '../scope.js';
import type { ConversationStore } from '../store.js';
import {
  runChatTurn,
  runRegenerateTurn,
  type ChatTransport,
} from '../transport.js';
import { Composer, type ComposerProps } from './ChatComposer.js';
import { setChatChromeHandlers } from './chrome/actions.js';
import type { CallChatService } from './context-sources.js';
import { EmptyState, type ChatSuggestion } from './EmptyState.js';
import { MessageBubble } from './MessageBubble.js';
import { ChatDenied } from './PartRenderer.js';

/**
 * ChatView（设计决策 D6）：消息列表（useSyncExternalStore 订阅
 * ConversationStore）+ Composer。
 *
 * 发送语义：`onSend` 回调先行（业务可完全自管）；注入 `transport`
 * 时同时经 `runChatTurn` 驱动一轮对话（user 消息 + assistant 占位 +
 * 流式 reduce）。通常二选一。
 *
 * 流式交互（技术选型参考 DeepTutor web）：
 * - 流式中 Composer 发送按钮变为停止按钮，点击 abort 当前 turn
 *   （assistant 消息以 cancelled 收尾）；
 * - 消息区贴底自动跟随，用户上翻释放、回底恢复，释放期间显示
 *   "回到底部"浮动按钮。
 *
 * Composer 扩展 props（attachments / onAttachFiles / toolbar 槽 /
 * 提及与 "+" 触发等，见 ComposerProps）原样透传给内建 Composer。
 */
export interface ChatViewProps
  extends Pick<
    ComposerProps,
    | 'attachments'
    | 'onAttachmentsChange'
    | 'onAttachFiles'
    | 'onAttachmentClick'
    | 'toolbarStart'
    | 'toolbarEnd'
    | 'composerFooter'
    | 'hideToolbar'
    | 'onMentionTrigger'
    | 'onPlusMenu'
  > {
  store: ConversationStore;
  /** 注入后发送即驱动 turn；缺省时仅触发 onSend */
  transport?: ChatTransport;
  /**
   * 会话级 Agent 身份（assistant 消息顶部「图标 + 加粗名称」展示的兜底，
   * 消息自带 message.agent 时以消息为准）；未配置不渲染身份行
   */
  agent?: ChatAgentIdentity;
  onSend?: (text: string) => void;
  /** Safe Registry（createSafeRegistry 包装后的白名单注册表） */
  safeRegistry?: Registry<unknown>;
  /** capability 白名单与确认链（注入 capabilities 时注册 capability 动作） */
  capabilities?: ChatCapabilityRegistry;
  permission?: ChatPermissionChecker;
  confirm?: ChatConfirm;
  /** 会话 id（注入 dsl part 作用域 conversation.id） */
  conversationId?: string;
  /** 注入 dsl part 作用域 user / params */
  user?: Record<string, unknown>;
  params?: Record<string, unknown>;
  /** 空会话问候语（缺省用内置默认文案） */
  greeting?: string;
  /** 空会话副标题 */
  subtitle?: string;
  /** 空会话起始建议；空数组 / 未传时不渲染建议区 */
  suggestions?: ChatSuggestion[];
  /**
   * artifact part 就绪（status ready）时触发（spec: chat-dsl-component /
   * 产出物事件）；同一 part 只触发一次，框架不擅自打开面板
   */
  onArtifact?: (artifact: ChatArtifact) => void;
  /** artifact 卡片"在面板中打开"回调（整卡点击，经包级 handlers 桥接） */
  onOpenArtifact?: (artifact: ChatArtifact) => void;
  /** 卡片区"查看所有产物"回调（打开面板并定位产物目录视图） */
  onOpenArtifactList?: () => void;
  /**
   * 内建模型选择（spec: chat-model-selector，决策 D5）：
   * `model` + `onModelChange` 同时提供即受控（以 props 为准）；
   * 仅提供 `models` 时组件自持选中态（缺省 models[0]）；
   * 未配置 models 时不渲染 chip 且 ChatInput.model 为 undefined
   */
  models?: ChatModelOption[];
  model?: string;
  onModelChange?: (value: string) => void;
  /**
   * 模型 chip 渲染位置（spec: chat-model-selector / 模型选择位置配置，
   * 决策 D2）：缺省 'composer'（Composer 工具栏右端）；'header' 时
   * Composer 不再渲染 chip（chip 由 ChatComposition 渲染到工作区头部
   * 左端——ChatView 单独使用时 'header' 等效于不渲染 chip）
   */
  modelPlacement?: 'composer' | 'header';
  /**
   * 内建上下文数据源（spec: chat-context-sources）：chips 状态由
   * ChatView 自持（选中追加 / 单独移除 / 发送后清空），
   * `onContextsChange` 并行通知；未配置时不启用内建弹层与 "+" 入口
   */
  contexts?: ChatContextSource[];
  onContextsChange?: (chips: ChatContextItem[]) => void;
  /** service 引用解析出口（ChatServices.callService 透传 Composer 与消息动作条） */
  callService?: CallChatService;
  /**
   * 消息操作条声明式配置（spec: chat-message-actions，决策 D1）：
   * 缺省等价于 `['copy', 'regenerate', 'retry', 'edit']`（与历史行为一致）；
   * 传入数组时严格按数组顺序与内容渲染，未列出的内建动作不出现
   */
  messageActions?: Array<BuiltinMessageAction | ChatMessageAction>;
  /** 全部消息动作（含内建）点击的并行通知（event 语义，不影响内建默认行为） */
  onMessageAction?: (actionId: string, message: ChatMessage) => void;
  /**
   * Composer 下方自定义内容槽（未提供不渲染）：渲染在 Composer 之外、
   * 页面底部留白区内（空态 / 钉底两态一致），典型用途为免责声明、
   * 备案信息等弱提示行
   */
  composerBottom?: ReactNode;
  className?: string;
}

/** 末条消息的文本总长度（流式增长时驱动自动滚动） */
function lastContentLength(messages: ChatMessage[]): number {
  const last = messages[messages.length - 1];
  if (!last) {
    return 0;
  }
  return last.parts.reduce(
    (total, part) => total + ('content' in part ? String(part.content).length : 0),
    0,
  );
}

export function ChatView({
  store,
  transport,
  agent,
  onSend,
  safeRegistry,
  capabilities,
  permission,
  confirm,
  conversationId,
  user,
  params,
  greeting,
  subtitle,
  suggestions,
  className,
  onArtifact,
  onOpenArtifact,
  onOpenArtifactList,
  attachments,
  onAttachmentsChange,
  onAttachFiles,
  onAttachmentClick,
  toolbarStart,
  toolbarEnd,
  composerFooter,
  hideToolbar,
  onMentionTrigger,
  onPlusMenu,
  models,
  model,
  onModelChange,
  modelPlacement = 'composer',
  contexts,
  onContextsChange,
  callService,
  messageActions,
  onMessageAction,
  composerBottom,
}: ChatViewProps) {
  const messages = useSyncExternalStore(
    (listener) => store.subscribe(listener),
    () => store.getMessages(),
  );

  const isStreaming = messages.some(
    (message) => message.status === 'pending' || message.status === 'streaming',
  );

  // DSL part 渲染运行时：Safe Registry 快照 + ChatDenied 占位组件
  const runtime: ChatRuntime | undefined = useMemo(() => {
    if (!safeRegistry) {
      return undefined;
    }
    const components = new Registry<unknown>('ChatComponentRegistry');
    components.register(CHAT_DENIED_TYPE, ChatDenied);
    for (const name of safeRegistry.list()) {
      components.register(name, safeRegistry.get(name));
    }
    return createChatRuntime({
      safeRegistry: components,
      capabilities,
      permission,
      confirm,
      user,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeRegistry, capabilities, permission, confirm, user]);

  const scope: Omit<ChatScope, 'message'> = useMemo(
    () => ({ conversation: { id: conversationId }, params }),
    [conversationId, params],
  );

  // 产出物事件（spec: chat-dsl-component / 产出物事件）：assistant 消息中
  // artifact part 就绪（status ready，缺省视为 ready）时触发一次；
  // 是否开面板由宿主 / DSL 决定，框架不擅自抢焦点
  const notifiedArtifactsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!onArtifact) {
      return;
    }
    for (const message of messages) {
      if (message.role !== 'assistant') {
        continue;
      }
      message.parts.forEach((part, index) => {
        if (
          part.type === 'artifact' &&
          (part.status ?? 'ready') === 'ready'
        ) {
          const key = `${message.id}:${part.id ?? index}`;
          if (!notifiedArtifactsRef.current.has(key)) {
            notifiedArtifactsRef.current.add(key);
            onArtifact(part.artifact);
          }
        }
      });
    }
  }, [messages, onArtifact]);

  // 当前 turn 的取消控制器
  const abortRef = useRef<AbortController | null>(null);

  const { containerRef, isFollowing, scrollToBottom } = useChatAutoScroll({
    messageCount: messages.length,
    lastContentLength: lastContentLength(messages),
    isStreaming,
  });

  // 模型选择（spec: chat-model-selector，决策 D5）：受控/非受控解析
  // 收敛到 useChatModel——ChatView 单独使用时在此自持；经
  // ChatComposition 使用时由组合层解析后以受控形态传入（决策 D2，
  // header 位 chip 与 composer 位共享同一状态）
  const { currentModel, handleModelChange } = useChatModel({
    models,
    model,
    onModelChange,
  });

  // 上下文 chips（spec: chat-context-sources，决策 D5/D6）：ChatView
  // 自持状态（发送路径要消费）；变更 / 清空均触发 onContextsChange
  const [contextChips, setContextChips] = useState<ChatContextItem[]>([]);
  const handleContextChipsChange = (chips: ChatContextItem[]): void => {
    setContextChips(chips);
    onContextsChange?.(chips);
  };

  const handleSend = (text: string): void => {
    onSend?.(text);
    if (transport) {
      const controller = new AbortController();
      abortRef.current = controller;
      void runChatTurn(
        store,
        transport,
        {
          text,
          conversationId,
          model: currentModel,
          contexts: contextChips.length > 0 ? contextChips : undefined,
        },
        {
          signal: controller.signal,
        },
      );
    }
    // 发送后清空 chips（附件同款语义：一轮一清）并通知 []
    if (contextChips.length > 0) {
      handleContextChipsChange([]);
    }
  };

  const handleStop = (): void => {
    abortRef.current?.abort();
    abortRef.current = null;
  };

  // chrome DSL 渲染层（spec: chat-chrome-dsl）：包级行为注入——
  // 空态建议点击 / artifact 卡片打开经 chat.* 内建动作桥接回这里
  // （refs 保证回调始终最新；单活动 chat 语义）
  const handleSendRef = useRef(handleSend);
  handleSendRef.current = handleSend;
  const onOpenArtifactRef = useRef(onOpenArtifact);
  onOpenArtifactRef.current = onOpenArtifact;
  const onOpenArtifactListRef = useRef(onOpenArtifactList);
  onOpenArtifactListRef.current = onOpenArtifactList;
  useEffect(() => {
    setChatChromeHandlers({
      sendSuggestion: (text) => handleSendRef.current(text),
      openArtifact: (artifact) => onOpenArtifactRef.current?.(artifact),
      openArtifactList: () => onOpenArtifactListRef.current?.(),
    });
  }, []);

  // 重新生成 / 错误重试（spec: chat-message-actions）：与发送共用
  // abortRef 生命周期——先取消当前 turn，再挂新控制器跑 regenerate。
  // 仅 transport 模式可用：onSend-only 模式下调用方完全自管 store，
  // 包内无法保证"截断 + 重跑"语义，故不出示入口。
  const handleRegenerate = (): void => {
    if (!transport) {
      return;
    }
    handleStop();
    const controller = new AbortController();
    abortRef.current = controller;
    void runRegenerateTurn(store, transport, { signal: controller.signal });
  };

  // 编辑重发（spec: chat-message-actions）：确认后截断该 user 消息及
  // 之后全部消息，再以新文本走与 Composer 相同的发送路径
  const handleEditResend = (messageId: string, text: string): void => {
    handleStop();
    store.removeMessagesFrom(messageId);
    handleSend(text);
  };

  // 重新生成入口只出现在"末条消息且为 completed assistant"的场景
  const lastMessage = messages[messages.length - 1];
  const regenerableMessageId =
    lastMessage?.role === 'assistant' && lastMessage.status === 'completed'
      ? lastMessage.id
      : undefined;

  // 空态居中组（spec: chat-empty-state，决策 D1）：messages 为空时
  // EmptyState 与 Composer 作为同一居中列的相邻子节点渲染在消息区内
  // （Composer 不钉底）；有消息后恢复消息列表 + 钉底 Composer
  const isEmpty = messages.length === 0;

  const composerNode = (
    <Composer
      onSend={handleSend}
      streaming={isStreaming}
      onStop={handleStop}
      attachments={attachments}
      onAttachmentsChange={onAttachmentsChange}
      onAttachFiles={onAttachFiles}
      onAttachmentClick={onAttachmentClick}
      toolbarStart={toolbarStart}
      toolbarEnd={toolbarEnd}
      composerFooter={composerFooter}
      hideToolbar={hideToolbar}
      onMentionTrigger={onMentionTrigger}
      onPlusMenu={onPlusMenu}
      models={modelPlacement === 'header' ? undefined : models}
      model={currentModel}
      onModelChange={handleModelChange}
      contextSources={contexts}
      contextChips={contextChips}
      onContextChipsChange={handleContextChipsChange}
      callService={callService}
    />
  );

  // Composer 承载坞：空态居中组与钉底位共用——composerBottom 槽渲染在
  // Composer 之外正下方；padding-bottom 提供钉底态与页面底部的留白
  const composerDock = (
    <div className="pactor-chat-view__composer-dock">
      {composerNode}
      {composerBottom !== undefined && composerBottom !== null ? (
        <div className="pactor-chat-view__composer-bottom">
          {composerBottom}
        </div>
      ) : null}
    </div>
  );

  return (
    <div
      className={`pactor-chat-view${isEmpty ? ' pactor-chat-view--empty' : ''}${className ? ` ${className}` : ''}`}
    >
      <div className="pactor-chat-messages" ref={containerRef}>
        {isEmpty ? (
          <div className="pactor-chat-view__empty-stack">
            <EmptyState
              greeting={greeting}
              subtitle={subtitle}
              suggestions={suggestions}
              onSuggestionClick={handleSend}
            />
            {composerDock}
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              agent={agent}
              runtime={runtime}
              scope={scope}
              showRegenerate={message.id === regenerableMessageId}
              onRegenerate={transport ? handleRegenerate : undefined}
              onRetry={transport ? handleRegenerate : undefined}
              onEditResend={(text) => handleEditResend(message.id, text)}
              messageActions={messageActions}
              callService={callService}
              onMessageAction={onMessageAction}
            />
          ))
        )}
        {!isFollowing && (
          <button
            type="button"
            className="pactor-chat-scroll-bottom"
            onClick={scrollToBottom}
          >
            <Icon name="arrow-down" size={13} />
            回到底部
          </button>
        )}
      </div>
      {!isEmpty && composerDock}
    </div>
  );
}
