// 消息模型与 Store（零 React）
export {
  createChatId,
  type BuiltinMessageAction,
  type ChatAttachment,
  type ChatContextItem,
  type ChatContextSource,
  type ChatMessage,
  type ChatMessageAction,
  type ChatModelOption,
  type ChatPart,
  type ChatRole,
  type MessagePatch,
  type MessageStatus,
  type PartPatch,
  type PartRef,
  type PartStatus,
  type ToolCallStatus,
} from './model.js';
export { ConversationStore } from './store.js';

// 产出物模型与 Store（spec: chat-artifact-panel，零 React）
export {
  ArtifactStore,
  type ArtifactPatch,
  type ChatArtifact,
} from './artifact.js';

// Streaming 事件模型与 reducer（零 React）
export { applyChatEvent, type ChatEvent } from './events.js';

// 活动轨迹纯函数（零 React）
export {
  detectStreamingMode,
  pairToolTraces,
  type StreamingMode,
  type ToolTraceEntry,
} from './activity.js';
export {
  createManualDriver,
  runChatTurn,
  runRegenerateTurn,
  type ChatInput,
  type ChatTransport,
  type ChatTurnResult,
  type ManualChatDriver,
  type RunChatTurnOptions,
} from './transport.js';

// Safe Registry 与 capability 动作（零 React）
export { createSafeRegistry } from './safe-registry.js';
export {
  registerCapabilityAction,
  type CapabilityActionDeps,
  type CapabilityHandler,
  type ChatCapabilityRegistry,
  type ChatConfirm,
  type ChatConfirmRequest,
  type ChatPermissionChecker,
} from './capability-action.js';

// Chat 作用域与 RuntimeContext 组装（零 React）
export {
  buildChatScope,
  createChatRuntime,
  type ChatRuntime,
  type ChatScope,
  type CreateChatRuntimeOptions,
} from './scope.js';

// DSL 白名单守卫（零 React）
export { CHAT_DENIED_TYPE, guardChatDsl } from './dsl-guard.js';

// 流式交互 hooks（技术选型参考 DeepTutor web，独立实现）
export {
  useSmoothStreamText,
  type UseSmoothStreamTextOptions,
} from './hooks/use-smooth-stream-text.js';
export {
  useChatAutoScroll,
  type UseChatAutoScrollOptions,
  type UseChatAutoScrollResult,
} from './hooks/use-chat-auto-scroll.js';

// DSL 页面工作区工厂（spec: chat-dsl-page）
export {
  createChatWorkspace,
  type ChatWorkspaceProps,
  type ChatWorkspaceServices,
} from './chat-workspace.js';

// Chat 服务注入与一等 DSL 组件（spec: chat-dsl-component）
export {
  ChatServicesProvider,
  useChatServices,
  type ChatServices,
} from './chat-services.js';
export {
  CHAT_COMPONENT_TYPE,
  Chat,
  ChatSidebarMenu,
  registerChatComponent,
  type ChatMenuItem,
  type ChatProps,
} from './view/Chat.js';
export {
  CHAT_SHELL_COMPONENT_TYPE,
  ChatShell,
  registerChatShellComponent,
  type ChatShellProps,
} from './view/ChatShell.js';
export {
  ArtifactPanel,
  type ArtifactPanelProps,
} from './view/ArtifactPanel.js';
export { type ChatHeaderAction } from './view/WorkspaceHeader.js';

// React 视图
export {
  AppShell,
  useSidebarDrawer,
  type AppShellProps,
} from './view/AppShell.js';
export { ChatView, type ChatViewProps } from './view/ChatView.js';
export {
  DEFAULT_CHAT_GREETING,
  EmptyState,
  type ChatSuggestion,
  type EmptyStateProps,
} from './view/EmptyState.js';
export {
  ActivityTrace,
  type ActivityTraceProps,
} from './view/ActivityTrace.js';
export { MessageBubble, type MessageBubbleProps } from './view/MessageBubble.js';
export {
  collectMessageText,
  MessageActions,
  type MessageActionsProps,
} from './view/MessageActions.js';
export {
  ChatDenied,
  PartRenderer,
  type PartRendererProps,
} from './view/PartRenderer.js';
export { Composer, type ComposerProps } from './view/Composer.js';
export {
  CHAT_LAYOUT_TYPE,
  ChatLayout,
  registerChatLayout,
  type ChatLayoutProps,
  type ChatLayoutRegistry,
} from './view/ChatLayout.js';
