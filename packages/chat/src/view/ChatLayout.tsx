import type { ComponentType, ReactNode } from 'react';

/**
 * ChatLayout（设计决策 D6）：chat 布局 = header（title）+ ChatView 区。
 * V1 无会话历史侧栏。约定同 pactor-layout 其他布局：
 * 语义 class + 极简内联样式，children 为 ChatView 区内容。
 */
export interface ChatLayoutProps {
  title?: ReactNode;
  children?: ReactNode;
}

export function ChatLayout({ title, children }: ChatLayoutProps) {
  return (
    <div
      className="pactor-chat-layout"
      style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
    >
      <header
        className="pactor-chat-layout__header"
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #f0f0f0',
          fontWeight: 600,
        }}
      >
        {title ?? 'Chat'}
      </header>
      <main
        className="pactor-chat-layout__main"
        style={{ flex: 1, minHeight: 0, padding: 16 }}
      >
        {children}
      </main>
    </div>
  );
}

/** 布局类型名（resolveLayout(registry, 'chat') 命中） */
export const CHAT_LAYOUT_TYPE = 'chat';

/**
 * 结构化 LayoutRegistry（兼容 pactor-layout 的 LayoutRegistry =
 * Registry<LayoutComponent>）：以结构化类型声明，避免对
 * pactor-layout 产生运行时依赖。
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
