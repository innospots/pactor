import type { DslNode } from 'pactor-core';

/**
 * 消息模型（设计决策 D1，设计文档第 58/59/70 节）：
 * AI Message Rendering Protocol 的数据层——消息 + Part 联合类型 +
 * 状态机。零 React，可纯 Node 测试。
 */

/** 消息角色 */
export type ChatRole = 'user' | 'assistant' | 'system';

/** 消息状态机 */
export type MessageStatus =
  | 'pending'
  | 'streaming'
  | 'completed'
  | 'error'
  | 'cancelled';

/** Part 状态机（tool-call / tool-result / error / status 使用各自的状态字段） */
export type PartStatus = 'pending' | 'streaming' | 'ready' | 'error';

/** tool-call part 的执行状态 */
export type ToolCallStatus = 'waiting' | 'running' | 'success' | 'failed';

/**
 * Part 联合类型：一条消息由有序 Part 数组组成，
 * thinking 与正文分离（设计文档第 72 节）。
 *
 * 各 variant 的 `id` 可选：streaming 事件携带 partId 时按 id 定位，
 * 缺省时 reducer 按"最后一个同类 part"定位。
 */
export type ChatPart =
  | { id?: string; type: 'text'; content: string; status?: PartStatus }
  | { id?: string; type: 'markdown'; content: string; status?: PartStatus }
  | {
      id?: string;
      type: 'dsl';
      /** dsl.complete 事件写入；dsl.start 占位阶段缺省（渲染为占位） */
      schema?: DslNode;
      status?: PartStatus;
    }
  | { id?: string; type: 'thinking'; content: string; status?: PartStatus }
  | {
      id?: string;
      type: 'tool-call';
      name: string;
      title?: string;
      /** 调用参数（tool.start 事件携带；供活动轨迹参数摘要 / 详情渲染） */
      args?: unknown;
      status: ToolCallStatus;
    }
  | {
      id?: string;
      type: 'tool-result';
      name: string;
      status: 'success' | 'failed';
      result?: unknown;
      error?: string;
    }
  | { id?: string; type: 'error'; message: string }
  | { id?: string; type: 'status'; text: string };

/** 消息附件引用（上传与存储由调用方负责，包内只持有引用） */
export interface ChatAttachment {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  url?: string;
}

/** Chat 消息 */
export interface ChatMessage {
  id: string;
  role: ChatRole;
  status: MessageStatus;
  parts: ChatPart[];
  createdAt?: number;
  attachments?: ChatAttachment[];
}

/** updatePart 的定位参数：数组下标或 part id */
export type PartRef = number | string;

/** updateMessage 的补丁：id 不可改 */
export type MessagePatch = Partial<Omit<ChatMessage, 'id'>>;

/** updatePart 的补丁（宽类型：按目标 part variant 取子集） */
export type PartPatch = Partial<{
  content: string;
  schema: DslNode;
  status: string;
  name: string;
  title: string;
  args: unknown;
  result: unknown;
  error: string;
  message: string;
  text: string;
}>;

let idCounter = 0;

/** 生成 Chat 侧消息 / part id（单调后缀保证同毫秒唯一） */
export function createChatId(prefix: string = 'chat'): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}
