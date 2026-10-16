"use client";

/**
 * 页面 DSL 引用的自定义组件注册表（页面级自定义组件
 * `components={{...}}`），经 SitemapApp 的 `components` prop 全局注册。
 * ChipFilter / ChipNode 快筛组件已内置在 @pactor-app/ui，无需在此注册。
 *
 * Chat 展示组件（ChatPage / Bubble / Composer 等 18 个）归属
 * @pactor-app/chat 的 /components 子路径，不进 ui 内置注册表，
 * 在此展开注册（DSL 类型名 = 导出符号名）；样式见 app/layout.tsx 的
 * pactor-app/styles.css（聚合单入口）。
 */
import {
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
} from "@pactor-app/chat/components";
import { StatusBadge } from "./status-badge";
import { LogStatus } from "./log-status";
import { DebugChat } from "./debug-chat";
import { CardLink, StatusToggleIcon, TextLink } from "./card-links";
import { ThemeSwitcher } from "./theme-switcher";

const chatComponents: Record<string, unknown> = {
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
};

export const pactorComponents: Record<string, unknown> = {
  ...chatComponents,
  StatusBadge,
  LogStatus,
  DebugChat,
  ProviderCardLink: CardLink,
  ModelCardLink: CardLink,
  RouteCardLink: CardLink,
  TemplateCardLink: CardLink,
  TextLink,
  StatusToggleIcon,
  ThemeSwitcher,
};
