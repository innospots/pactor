import { createContext, useContext, type ReactNode } from 'react';

import type { ChatWorkspaceServices } from './chat-workspace.js';

/**
 * Chat 的运行时服务（spec: chat-dsl-component，设计决策 D1）：
 * 与 ChatWorkspaceServices 同型——transport 必填，其余可选。
 * 表达式作用域只承载可序列化数据，函数 / 实例不进 DSL props，
 * 故服务经 React Context 注入一次，`Chat` 组件就近读取。
 */
export type ChatServices = ChatWorkspaceServices;

const ChatServicesContext = createContext<ChatServices | null>(null);

/**
 * 宿主在应用根部注入一次聊天服务；其下所有 `Chat` 组件（含 DSL 页面
 * 渲染的实例）经 context 消费。多层嵌套时就近原则生效。
 */
export function ChatServicesProvider({
  value,
  children,
}: {
  value: ChatServices;
  children?: ReactNode;
}): ReactNode {
  return (
    <ChatServicesContext.Provider value={value}>
      {children}
    </ChatServicesContext.Provider>
  );
}

/** 读取最近的 ChatServicesProvider；无 provider 返回 null（不抛错） */
export function useChatServices(): ChatServices | null {
  return useContext(ChatServicesContext);
}
