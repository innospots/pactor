import type {
  ChatMessage,
  ChatPart,
  MessagePatch,
  MessageStatus,
  PartPatch,
  PartRef,
} from './model.js';

/**
 * ConversationStore（设计决策 D1）：消息列表的可变容器，零 React。
 *
 * 全部更新不可变：每次变更产生新的 messages 数组引用（被修改的
 * 消息 / part 同样为新对象），`getMessages()` 引用仅在变化时改变，
 * 兼容 React `useSyncExternalStore` 的 snapshot 语义。
 *
 * 对未知 messageId 的更新宽容：console.warn 并忽略，不抛错。
 */
export class ConversationStore {
  private messages: ChatMessage[] = [];
  private readonly listeners = new Set<() => void>();

  /** 当前消息数组（只读快照；引用在不变时保持稳定） */
  getMessages(): ChatMessage[] {
    return this.messages;
  }

  getMessage(id: string): ChatMessage | undefined {
    return this.messages.find((message) => message.id === id);
  }

  /** 追加消息（id 重复时告警并忽略） */
  appendMessage(message: ChatMessage): void {
    if (this.getMessage(message.id)) {
      console.warn(
        `[@pactor/chat] duplicate message id "${message.id}", ignored`,
      );
      return;
    }
    this.commit([...this.messages, message]);
  }

  /** 更新消息级字段（status / role / parts 等，id 不可改） */
  updateMessage(id: string, patch: MessagePatch): void {
    const index = this.messages.findIndex((message) => message.id === id);
    if (index < 0) {
      console.warn(`[@pactor/chat] message not found: "${id}"`);
      return;
    }
    const next = [...this.messages];
    next[index] = { ...next[index]!, ...patch, id };
    this.commit(next);
  }

  /** 追加 part 到目标消息 */
  appendPart(messageId: string, part: ChatPart): void {
    this.mutateMessage(messageId, (message) => ({
      ...message,
      parts: [...message.parts, part],
    }));
  }

  /**
   * 更新目标 part：partRef 为数组下标或 part id。
   * 未命中时告警并忽略（宽容约定同 updateMessage）。
   */
  updatePart(messageId: string, partRef: PartRef, patch: PartPatch): void {
    this.mutateMessage(messageId, (message) => {
      const index =
        typeof partRef === 'number'
          ? partRef
          : message.parts.findIndex((part) => part.id === partRef);
      if (index < 0 || index >= message.parts.length) {
        console.warn(
          `[@pactor/chat] part not found: message "${messageId}", ref "${String(partRef)}"`,
        );
        return message;
      }
      const parts = [...message.parts];
      parts[index] = { ...parts[index]!, ...patch } as ChatPart;
      return { ...message, parts };
    });
  }

  /** 设置消息状态 */
  setStatus(id: string, status: MessageStatus): void {
    this.updateMessage(id, { status });
  }

  /**
   * 不可变地移除目标消息及其后全部消息（编辑重发 / 重新生成的截断基础）。
   * 未知 id 时告警并忽略。
   */
  removeMessagesFrom(messageId: string): void {
    const index = this.messages.findIndex((message) => message.id === messageId);
    if (index < 0) {
      console.warn(`[@pactor/chat] message not found: "${messageId}"`);
      return;
    }
    this.commit(this.messages.slice(0, index));
  }

  /** 清空会话 */
  clear(): void {
    if (this.messages.length === 0) {
      return;
    }
    this.commit([]);
  }

  /** 订阅变更；返回退订函数 */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /** 以 mutator 更新单条消息（找不到时告警并忽略） */
  private mutateMessage(
    id: string,
    mutate: (message: ChatMessage) => ChatMessage,
  ): void {
    const index = this.messages.findIndex((message) => message.id === id);
    if (index < 0) {
      console.warn(`[@pactor/chat] message not found: "${id}"`);
      return;
    }
    const nextMessage = mutate(this.messages[index]!);
    if (nextMessage === this.messages[index]) {
      return;
    }
    const next = [...this.messages];
    next[index] = nextMessage;
    this.commit(next);
  }

  private commit(next: ChatMessage[]): void {
    this.messages = next;
    for (const listener of this.listeners) {
      listener();
    }
  }
}
