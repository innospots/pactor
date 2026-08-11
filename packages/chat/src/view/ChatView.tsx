import { Registry } from 'pactor-core';
import { useMemo, useSyncExternalStore } from 'react';

import type { ChatConfirm, ChatPermissionChecker } from '../capability-action.js';
import type { ChatCapabilityRegistry } from '../capability-action.js';
import { CHAT_DENIED_TYPE } from '../dsl-guard.js';
import {
  createChatRuntime,
  type ChatRuntime,
  type ChatScope,
} from '../scope.js';
import type { ConversationStore } from '../store.js';
import { runChatTurn, type ChatTransport } from '../transport.js';
import { Composer } from './Composer.js';
import { MessageBubble } from './MessageBubble.js';
import { ChatDenied } from './PartRenderer.js';

/**
 * ChatView（设计决策 D6）：消息列表（useSyncExternalStore 订阅
 * ConversationStore）+ Composer。
 *
 * 发送语义：`onSend` 回调先行（业务可完全自管）；注入 `transport`
 * 时同时经 `runChatTurn` 驱动一轮对话（user 消息 + assistant 占位 +
 * 流式 reduce）。通常二选一。
 */
export interface ChatViewProps {
  store: ConversationStore;
  /** 注入后发送即驱动 turn；缺省时仅触发 onSend */
  transport?: ChatTransport;
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
  className?: string;
}

export function ChatView({
  store,
  transport,
  onSend,
  safeRegistry,
  capabilities,
  permission,
  confirm,
  conversationId,
  user,
  params,
  className,
}: ChatViewProps) {
  const messages = useSyncExternalStore(
    (listener) => store.subscribe(listener),
    () => store.getMessages(),
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

  const handleSend = (text: string): void => {
    onSend?.(text);
    if (transport) {
      void runChatTurn(store, transport, { text, conversationId });
    }
  };

  return (
    <div
      className={`pactor-chat-view${className ? ` ${className}` : ''}`}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}
    >
      <div
        className="pactor-chat-messages"
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            runtime={runtime}
            scope={scope}
          />
        ))}
      </div>
      <Composer onSend={handleSend} />
    </div>
  );
}
