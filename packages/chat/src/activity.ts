import type { ChatMessage, ChatPart, ToolCallStatus } from './model.js';

/**
 * 活动轨迹纯函数（设计决策 D1，spec: chat-activity-trace）。
 *
 * 零 React、Node 可测：流式状态头的模式推导与 tool-call / tool-result
 * 的配对轨迹。视图层（ActivityTrace）只负责渲染这些函数的输出。
 */

/** 流式状态头的模式 */
export type StreamingMode = 'reasoning' | 'tool' | 'responding';

/**
 * 由消息 parts 推导当前流式模式：
 *
 * - 存在 waiting / running 的 tool-call → `tool`（未完结的工具调用
 *   总是优先，即使更晚有正文 streaming）；
 * - 否则取最靠后的活动（streaming）part：thinking → `reasoning`，
 *   text / markdown / dsl → `responding`（更晚的活动 part 优先）；
 * - 消息不在 streaming / pending，或无活动 part → `null`。
 */
export function detectStreamingMode(message: ChatMessage): StreamingMode | null {
  if (message.status !== 'streaming' && message.status !== 'pending') {
    return null;
  }
  for (const part of message.parts) {
    if (
      part.type === 'tool-call' &&
      (part.status === 'waiting' || part.status === 'running')
    ) {
      return 'tool';
    }
  }
  for (let index = message.parts.length - 1; index >= 0; index -= 1) {
    const part = message.parts[index]!;
    if (part.type === 'thinking' && part.status === 'streaming') {
      return 'reasoning';
    }
    if (
      (part.type === 'text' || part.type === 'markdown' || part.type === 'dsl') &&
      part.status === 'streaming'
    ) {
      return 'responding';
    }
  }
  return null;
}

/**
 * 配对后的工具轨迹条目：单行可展开渲染所需的数据。
 *
 * 事件模型无 callId（设计决策 D1 的取舍），保留原始 part 下标
 * （`callIndex` / `resultIndex`）便于将来升级 callId 配对。
 */
export interface ToolTraceEntry {
  /** 工具名（tool-call / tool-result 的 name） */
  name: string;
  /** 人类可读标题（来自 tool-call part） */
  title?: string;
  /** 调用参数（来自配对 tool-call part 的 args；供参数摘要 / 详情渲染） */
  args?: unknown;
  /**
   * 派生状态：已配对 result 时取 result 的 success / failed，
   * 否则保留 call 自身的 waiting / running。
   */
  status: ToolCallStatus;
  /** result 载荷（success 时） */
  result?: unknown;
  /** 错误信息（failed 时） */
  error?: string;
  /** tool-call part 在消息 parts 中的下标 */
  callIndex: number;
  /** 配对的 tool-result part 下标；未配对时缺省 */
  resultIndex?: number;
}

/**
 * 将 tool-call 与 tool-result 按 name + 出现顺序配对：
 * 每个 result 落到同名最早未配对的 call（顺序事件流下等价于
 * "最早未完结的同名 call"）。孤儿 result（无同名 call）忽略。
 * 返回条目按 call 出现顺序排列。
 */
export function pairToolTraces(parts: ChatPart[]): ToolTraceEntry[] {
  const entries: ToolTraceEntry[] = [];
  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index]!;
    if (part.type === 'tool-call') {
      entries.push({
        name: part.name,
        title: part.title,
        args: part.args,
        status: part.status,
        callIndex: index,
      });
    } else if (part.type === 'tool-result') {
      const entry = entries.find(
        (candidate) =>
          candidate.name === part.name && candidate.resultIndex === undefined,
      );
      if (entry) {
        entry.status = part.status;
        entry.result = part.result;
        entry.error = part.error;
        entry.resultIndex = index;
      }
    }
  }
  return entries;
}
