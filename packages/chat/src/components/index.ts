import type { Registry } from '@pactor-app/core';

import { AgentStatus } from './AgentStatus/index.js';
import { ArtifactPanel } from './ArtifactPanel/index.js';
import { Attachment } from './Attachment/index.js';
import { Bubble } from './Bubble/index.js';
import { ChatMessage } from './ChatMessage/index.js';
import { ChatPage } from './ChatPage/index.js';
import { Citation } from './Citation/index.js';
import { Composer } from './Composer/index.js';
import { ConversationList } from './ConversationList/index.js';
import { MessageList } from './MessageList/index.js';
import { Prompt } from './Prompt/index.js';
import { Sender } from './Sender/index.js';
import { StepsPanel } from './StepsPanel/index.js';
import { StreamingText } from './StreamingText/index.js';
import { Suggestion } from './Suggestion/index.js';
import { Thinking } from './Thinking/index.js';
import { ToolCall } from './ToolCall/index.js';
import { Welcome } from './Welcome/index.js';
import { WorkspaceSwitcher } from './WorkspaceSwitcher/index.js';

/**
 * Chat 展示组件族（19 个，spec: chat-ui-components）：自 @pactor-app/ui
 * 迁入（props 契约与视觉一致），经 `@pactor-app/chat/components` 子路径
 * 导出；DSL 类型注册经 registerChatComponents（同名不覆盖，与
 * registerChatComponent 的 Chat / ChatShell 类型并存互不影响）。
 */
export { AgentStatus } from './AgentStatus/index.js';
export type { AgentStatusProps, AgentStatusType } from './AgentStatus/index.js';
export { ArtifactPanel } from './ArtifactPanel/index.js';
export type {
  ArtifactPanelProps,
  ArtifactViewer,
  ArtifactViewers,
} from './ArtifactPanel/index.js';
export { buildArtifactTree } from './ArtifactPanel/artifact.js';
export type {
  ArtifactTreeNode,
  ChatPageArtifact,
} from './ArtifactPanel/artifact.js';
export {
  buildArtifactBlob,
  downloadArtifact,
  resolveArtifactFilename,
  saveBlob,
} from './ArtifactPanel/download.js';
export { Attachment } from './Attachment/index.js';
export type { AttachmentItemData, AttachmentProps } from './Attachment/index.js';
export { Bubble } from './Bubble/index.js';
export type { BubbleProps, BubbleVariant } from './Bubble/index.js';
export { ChatMessage } from './ChatMessage/index.js';
export type {
  ChatMessageActionItem,
  ChatMessageAgent,
  ChatMessagePart,
  ChatMessageProps,
  ChatMessageStatus,
} from './ChatMessage/index.js';
export { ChatPage } from './ChatPage/index.js';
export type {
  ChatPageBrand,
  ChatPageMenuItem,
  ChatPageProps,
  ConversationRailItem,
} from './ChatPage/index.js';
export { Citation } from './Citation/index.js';
export type { CitationItem, CitationProps } from './Citation/index.js';
export { Composer } from './Composer/index.js';
export type {
  ComposerContextItem,
  ComposerContextSource,
  ComposerModelOption,
  ComposerProps,
} from './Composer/index.js';
export { ConversationList } from './ConversationList/index.js';
export type {
  ConversationItemData,
  ConversationListProps,
} from './ConversationList/index.js';
export { MessageList } from './MessageList/index.js';
export type { MessageListItem, MessageListProps } from './MessageList/index.js';
export { Prompt } from './Prompt/index.js';
export type { PromptProps } from './Prompt/index.js';
export { Sender } from './Sender/index.js';
export type { SenderProps } from './Sender/index.js';
export { StepsPanel } from './StepsPanel/index.js';
export type { StepsPanelItemData, StepsPanelProps } from './StepsPanel/index.js';
export { StreamingText } from './StreamingText/index.js';
export type { StreamingTextProps } from './StreamingText/index.js';
export { Suggestion } from './Suggestion/index.js';
export type { SuggestionItem, SuggestionProps } from './Suggestion/index.js';
export { Thinking } from './Thinking/index.js';
export type { ThinkingProps, ThinkingStatus } from './Thinking/index.js';
export { ToolCall } from './ToolCall/index.js';
export type { ToolCallProps, ToolCallStatus } from './ToolCall/index.js';
export { Welcome } from './Welcome/index.js';
export type { WelcomePromptItem, WelcomeProps } from './Welcome/index.js';
export { WorkspaceSwitcher } from './WorkspaceSwitcher/index.js';
export type {
  WorkspaceOption,
  WorkspaceSwitcherProps,
} from './WorkspaceSwitcher/index.js';

/**
 * 注册 chat 展示组件族的 19 个 DSL 类型名（与迁移前 ui
 * builtinComponents 的注册集合一致）；已存在同名类型时不覆盖。
 */
export function registerChatComponents(registry: Registry<unknown>): void {
  const components = {
    AgentStatus,
    ArtifactPanel,
    Attachment,
    Bubble,
    ChatMessage,
    ChatPage,
    Citation,
    Composer,
    ConversationList,
    MessageList,
    Prompt,
    Sender,
    StepsPanel,
    StreamingText,
    Suggestion,
    Thinking,
    ToolCall,
    Welcome,
    WorkspaceSwitcher,
  } as const;
  for (const [type, component] of Object.entries(components)) {
    if (!registry.has(type)) {
      registry.register(type, component);
    }
  }
}
