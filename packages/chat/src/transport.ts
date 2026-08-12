import { applyChatEvent, type ChatEvent } from './events.js';
import { createChatId } from './model.js';
import type { ConversationStore } from './store.js';

/**
 * ChatTransport 与 turn 驱动（设计决策 D2）。
 *
 * 真实 SSE / WebSocket 客户端不在 V1 范围：业务按服务端协议自行实现
 * `ChatTransport`（或后续补 `createSseTransport`）；测试与手动驱动
 * 场景使用 `createManualDriver()`。
 */

/** 一轮对话的输入 */
export interface ChatInput {
  text: string;
  conversationId?: string;
}

/** Chat 传输层：发送输入，返回流式事件 */
export interface ChatTransport {
  send(input: ChatInput): AsyncIterable<ChatEvent>;
}

/** runChatTurn 的可选定制（id 生成等，测试可注入确定性 id） */
export interface RunChatTurnOptions {
  userMessageId?: string;
  assistantMessageId?: string;
  /** 取消信号：abort 时停止消费事件流，assistant 消息以 cancelled 收尾 */
  signal?: AbortSignal;
}

/** runChatTurn 结果：本 turn 建立的两条消息 id */
export interface ChatTurnResult {
  userMessageId: string;
  assistantMessageId: string;
}

/**
 * 执行一轮对话：先 append user 消息（completed）与 assistant 占位
 * （pending），再 for-await transport 事件流逐事件 reduce。
 *
 * transport 流中的事件统一归一到 assistant 占位消息（一个 turn 的
 * 事件流即该回复的事件流）；transport 抛错时收敛为 message.error，
 * 不向上抛出。
 */
export async function runChatTurn(
  store: ConversationStore,
  transport: ChatTransport,
  input: ChatInput,
  options: RunChatTurnOptions = {},
): Promise<ChatTurnResult> {
  const userMessageId = options.userMessageId ?? createChatId('msg');
  const assistantMessageId = options.assistantMessageId ?? createChatId('msg');

  store.appendMessage({
    id: userMessageId,
    role: 'user',
    status: 'completed',
    parts: [
      { id: createChatId('part'), type: 'text', content: input.text, status: 'ready' },
    ],
    createdAt: Date.now(),
  });
  store.appendMessage({
    id: assistantMessageId,
    role: 'assistant',
    status: 'pending',
    parts: [],
    createdAt: Date.now(),
  });

  try {
    for await (const event of transport.send(input)) {
      if (options.signal?.aborted) {
        store.updateMessage(assistantMessageId, { status: 'cancelled' });
        return { userMessageId, assistantMessageId };
      }
      applyChatEvent(store, { ...event, messageId: assistantMessageId });
    }
    // abort 与流自然结束同时发生：cancelled 优先，不再补 message.end
    if (options.signal?.aborted) {
      store.updateMessage(assistantMessageId, { status: 'cancelled' });
      return { userMessageId, assistantMessageId };
    }
    // 流正常结束但未收到 message.end / message.error：兜底收尾
    const message = store.getMessage(assistantMessageId);
    if (message && (message.status === 'pending' || message.status === 'streaming')) {
      applyChatEvent(store, { type: 'message.end', messageId: assistantMessageId });
    }
  } catch (cause) {
    applyChatEvent(store, {
      type: 'message.error',
      messageId: assistantMessageId,
      error: cause instanceof Error ? cause.message : String(cause),
    });
  }

  return { userMessageId, assistantMessageId };
}

/** 手动 driver：代码控制推送事件的 ChatTransport 实现 */
export interface ManualChatDriver {
  transport: ChatTransport;
  /** 推送一个事件（在 send 之前推送的事件会排队，send 后依次产出） */
  push(event: ChatEvent): void;
  /** 结束事件流（send 的 for-await 正常退出） */
  complete(): void;
  /** 以错误终止事件流（runChatTurn 收敛为 message.error） */
  fail(cause: unknown): void;
}

/**
 * 创建手动 driver（测试与业务手动驱动共用）：
 * `push` / `complete` / `fail` 控制事件流，`transport.send` 产出。
 * 一个 driver 对应一次 send；send 之后不可复用。
 */
export function createManualDriver(): ManualChatDriver {
  const queue: ChatEvent[] = [];
  let waiting: (() => void) | null = null;
  let done = false;
  let failure: unknown;
  let started = false;

  const notify = (): void => {
    if (waiting) {
      const resolve = waiting;
      waiting = null;
      resolve();
    }
  };

  return {
    transport: {
      async *send(): AsyncIterable<ChatEvent> {
        if (started) {
          throw new Error('[pactor-chat] manual driver transport can only be sent once');
        }
        started = true;
        for (;;) {
          while (queue.length > 0) {
            yield queue.shift()!;
          }
          if (failure !== undefined) {
            throw failure;
          }
          if (done) {
            return;
          }
          await new Promise<void>((resolve) => {
            waiting = resolve;
          });
        }
      },
    },
    push(event: ChatEvent): void {
      queue.push(event);
      notify();
    },
    complete(): void {
      done = true;
      notify();
    },
    fail(cause: unknown): void {
      failure = cause;
      notify();
    },
  };
}
