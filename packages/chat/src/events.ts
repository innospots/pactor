import type { DslNode } from '@pactor/core';

import type { ChatArtifact } from './artifact.js';
import type { ChatMessage, ChatPart } from './model.js';
import { createChatId } from './model.js';
import type { ConversationStore } from './store.js';

/**
 * Streaming 事件模型与 reducer（设计决策 D2，设计文档第 69 节）。
 *
 * 事件对齐 SSE 协议：`message.start` / `text.delta` / `thinking.delta`
 * / `tool.start` / `tool.result` / `dsl.start` / `dsl.complete`
 * / `artifact`（产出物，spec: chat-artifact-panel）/ `message.end`
 * / `message.error`（`dsl.patch` V1 不实现）。
 */

export type ChatEvent =
  | { type: 'message.start'; messageId: string; role?: ChatMessage['role'] }
  | {
      type: 'text.delta';
      messageId: string;
      delta: string;
      partId?: string;
      /** 目标 part 类型（缺省 text；新建 part 时生效） */
      format?: 'text' | 'markdown';
    }
  | {
      type: 'thinking.delta';
      messageId: string;
      delta: string;
      partId?: string;
    }
  | {
      type: 'tool.start';
      messageId: string;
      name: string;
      title?: string;
      /** 调用参数（可选；reducer 存入 tool-call part 的 args） */
      args?: unknown;
      partId?: string;
    }
  | {
      type: 'tool.result';
      messageId: string;
      name: string;
      status: 'success' | 'failed';
      result?: unknown;
      error?: string;
      partId?: string;
    }
  | { type: 'dsl.start'; messageId: string; partId?: string }
  | {
      type: 'dsl.complete';
      messageId: string;
      schema: DslNode;
      partId?: string;
    }
  | {
      /** 产出物到达（spec: chat-artifact-panel）：一次性写入 ready 的 artifact part */
      type: 'artifact';
      messageId: string;
      artifact: ChatArtifact;
      partId?: string;
    }
  | { type: 'message.end'; messageId: string }
  | { type: 'message.error'; messageId: string; error: string };

/**
 * applyChatEvent（设计决策 D2）：纯函数 reducer，把单个流式事件
 * 落到 ConversationStore。不抛错：
 *
 * - 乱序 / 缺失宽容：delta 先于 message.start 时自动建立 assistant
 *   占位消息；目标 part 不存在时自动创建。
 * - 未知事件：忽略并 console.warn。
 */
export function applyChatEvent(store: ConversationStore, event: ChatEvent): void {
  switch (event.type) {
    case 'message.start': {
      const existing = store.getMessage(event.messageId);
      if (existing) {
        store.updateMessage(event.messageId, {
          role: event.role ?? existing.role,
          status: 'streaming',
        });
      } else {
        store.appendMessage({
          id: event.messageId,
          role: event.role ?? 'assistant',
          status: 'streaming',
          parts: [],
          createdAt: Date.now(),
        });
      }
      return;
    }

    case 'text.delta': {
      ensureMessage(store, event.messageId);
      const message = store.getMessage(event.messageId)!;
      const part = locatePart(message, event.partId, (p) =>
        event.format === 'markdown'
          ? p.type === 'markdown'
          : p.type === 'text' || p.type === 'markdown',
      );
      if (part) {
        store.updatePart(event.messageId, part.index, {
          content:
            (part.part as { content: string }).content + event.delta,
          status: 'streaming',
        });
      } else {
        store.appendPart(event.messageId, {
          id: event.partId ?? createChatId('part'),
          type: event.format === 'markdown' ? 'markdown' : 'text',
          content: event.delta,
          status: 'streaming',
        });
      }
      return;
    }

    case 'thinking.delta': {
      ensureMessage(store, event.messageId);
      const message = store.getMessage(event.messageId)!;
      const part = locatePart(message, event.partId, (p) => p.type === 'thinking');
      if (part) {
        store.updatePart(event.messageId, part.index, {
          content:
            (part.part as { content: string }).content + event.delta,
          status: 'streaming',
        });
      } else {
        store.appendPart(event.messageId, {
          id: event.partId ?? createChatId('part'),
          type: 'thinking',
          content: event.delta,
          status: 'streaming',
        });
      }
      return;
    }

    case 'tool.start': {
      ensureMessage(store, event.messageId);
      const message = store.getMessage(event.messageId)!;
      const part = locatePart(
        message,
        event.partId,
        (p) => p.type === 'tool-call' && p.name === event.name,
      );
      if (part) {
        store.updatePart(event.messageId, part.index, {
          status: 'running',
          title: event.title,
          args: event.args,
        });
      } else {
        store.appendPart(event.messageId, {
          id: event.partId ?? createChatId('part'),
          type: 'tool-call',
          name: event.name,
          title: event.title,
          args: event.args,
          status: 'running',
        });
      }
      return;
    }

    case 'tool.result': {
      ensureMessage(store, event.messageId);
      const message = store.getMessage(event.messageId)!;
      // 更新同名 tool-call 的执行状态，并追加 tool-result part
      const call = locatePart(
        message,
        event.partId,
        (p) => p.type === 'tool-call' && p.name === event.name,
      );
      if (call) {
        store.updatePart(event.messageId, call.index, {
          status: event.status,
        });
      }
      store.appendPart(event.messageId, {
        id: createChatId('part'),
        type: 'tool-result',
        name: event.name,
        status: event.status,
        result: event.result,
        error: event.error,
      });
      return;
    }

    case 'dsl.start': {
      ensureMessage(store, event.messageId);
      store.appendPart(event.messageId, {
        id: event.partId ?? createChatId('part'),
        type: 'dsl',
        status: 'pending',
      });
      return;
    }

    case 'dsl.complete': {
      ensureMessage(store, event.messageId);
      const message = store.getMessage(event.messageId)!;
      const part = locatePart(message, event.partId, (p) => p.type === 'dsl');
      if (part) {
        store.updatePart(event.messageId, part.index, {
          schema: event.schema,
          status: 'ready',
        });
      } else {
        // 无 dsl.start 直接 complete：宽容建立完整 part
        store.appendPart(event.messageId, {
          id: event.partId ?? createChatId('part'),
          type: 'dsl',
          schema: event.schema,
          status: 'ready',
        });
      }
      return;
    }

    case 'artifact': {
      ensureMessage(store, event.messageId);
      const message = store.getMessage(event.messageId)!;
      // partId 命中既有 artifact part 时原地更新；否则追加 ready part
      const part = locatePart(message, event.partId, (p) => p.type === 'artifact');
      if (part) {
        store.updatePart(event.messageId, part.index, {
          artifact: event.artifact,
          status: 'ready',
        });
      } else {
        store.appendPart(event.messageId, {
          id: event.partId ?? createChatId('part'),
          type: 'artifact',
          artifact: event.artifact,
          status: 'ready',
        });
      }
      return;
    }

    case 'message.end': {
      const message = store.getMessage(event.messageId);
      if (!message) {
        console.warn(
          `[@pactor/chat] message.end for unknown message "${event.messageId}", ignored`,
        );
        return;
      }
      // 收尾：仍在 streaming / pending 的内容 part 一并置 ready
      const parts = message.parts.map((part) =>
        'status' in part &&
        (part.status === 'streaming' || part.status === 'pending')
          ? ({ ...part, status: 'ready' } as ChatPart)
          : part,
      );
      store.updateMessage(event.messageId, { status: 'completed', parts });
      return;
    }

    case 'message.error': {
      ensureMessage(store, event.messageId);
      store.appendPart(event.messageId, {
        id: createChatId('part'),
        type: 'error',
        message: event.error,
      });
      store.setStatus(event.messageId, 'error');
      return;
    }

    default: {
      console.warn(
        `[@pactor/chat] unknown chat event, ignored:`,
        (event as { type?: string }).type ?? event,
      );
    }
  }
}

/** 消息不存在时建立 assistant 占位（乱序宽容）；pending 占位转入 streaming */
function ensureMessage(store: ConversationStore, messageId: string): void {
  const existing = store.getMessage(messageId);
  if (!existing) {
    store.appendMessage({
      id: messageId,
      role: 'assistant',
      status: 'streaming',
      parts: [],
      createdAt: Date.now(),
    });
  } else if (existing.status === 'pending') {
    store.setStatus(messageId, 'streaming');
  }
}

/**
 * 定位目标 part：partId 命中按 id；否则取最后一个满足谓词的 part。
 * 返回下标与 part 本身；未命中返回 undefined。
 */
function locatePart(
  message: ChatMessage,
  partId: string | undefined,
  match: (part: ChatPart) => boolean,
): { index: number; part: ChatPart } | undefined {
  if (partId !== undefined) {
    const index = message.parts.findIndex((part) => part.id === partId);
    return index >= 0 ? { index, part: message.parts[index]! } : undefined;
  }
  for (let index = message.parts.length - 1; index >= 0; index -= 1) {
    const part = message.parts[index]!;
    if (match(part)) {
      return { index, part };
    }
  }
  return undefined;
}
