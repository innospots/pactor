import type { ComponentType, ReactNode } from 'react';

/**
 * ChatLayout（设计决策 D6）：chat 布局 = header（title）+ ChatView 区。
 * V1 无会话历史侧栏。颜色经 `--pactor-chat-*` 变量表达
 * （`pactor-chat/styles.css`），布局结构类样式同文件。
 */
export interface ChatLayoutProps {
  title?: ReactNode;
  children?: ReactNode;
}

export function ChatLayout({ title, children }: ChatLayoutProps) {
  return (
    <div className="pactor-chat-layout">
      <header className="pactor-chat-layout__header">{title ?? 'Chat'}</header>
      <main className="pactor-chat-layout__main">{children}</main>
    </div>
  );
}

/** 布局类型名（resolveLayout(registry, 'chat') 命中） */
export const CHAT_LAYOUT_TYPE = 'chat';

/**
 * 结构化 LayoutRegistry（兼容 pactor-ui layout 层的 LayoutRegistry =
 * Registry<LayoutComponent>）：以结构化类型声明，避免对
 * pactor-ui 产生运行时依赖。
 */
export interface ChatLayoutRegistry {
  has(name: string): boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register(name: string, component: ComponentType<any>): void;
}

/** 注册 chat 布局（已注册时不覆盖，与 createLayoutRegistry 约定一致） */
export function registerChatLayout(layoutRegistry: ChatLayoutRegistry): void {
  if (!layoutRegistry.has(CHAT_LAYOUT_TYPE)) {
    layoutRegistry.register(CHAT_LAYOUT_TYPE, ChatLayout);
  }
}
