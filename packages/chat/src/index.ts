// 消息模型与 Store（零 React）
export {
  createChatId,
  type ChatMessage,
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

// Streaming 事件模型与 reducer（零 React）
export { applyChatEvent, type ChatEvent } from './events.js';
export {
  createManualDriver,
  runChatTurn,
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

// React 视图
export { ChatView, type ChatViewProps } from './view/ChatView.js';
export { MessageBubble, type MessageBubbleProps } from './view/MessageBubble.js';
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
