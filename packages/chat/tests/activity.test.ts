import { describe, expect, it } from 'vitest';

import type { ChatMessage, ChatPart } from '../src/index.js';
import { detectStreamingMode, pairToolTraces } from '../src/index.js';

function streamingMessage(parts: ChatPart[]): ChatMessage {
  return { id: 'm1', role: 'assistant', status: 'streaming', parts };
}

describe('detectStreamingMode（spec: chat-activity-trace / 流式状态头）', () => {
  it('thinking part streaming → reasoning', () => {
    const message = streamingMessage([
      { type: 'thinking', content: '…', status: 'streaming' },
    ]);
    expect(detectStreamingMode(message)).toBe('reasoning');
  });

  it('running / waiting 的 tool-call → tool', () => {
    expect(
      detectStreamingMode(
        streamingMessage([{ type: 'tool-call', name: 'search', status: 'running' }]),
      ),
    ).toBe('tool');
    expect(
      detectStreamingMode(
        streamingMessage([{ type: 'tool-call', name: 'search', status: 'waiting' }]),
      ),
    ).toBe('tool');
  });

  it('text / markdown / dsl part streaming → responding', () => {
    expect(
      detectStreamingMode(
        streamingMessage([{ type: 'text', content: 'a', status: 'streaming' }]),
      ),
    ).toBe('responding');
    expect(
      detectStreamingMode(
        streamingMessage([{ type: 'markdown', content: '# a', status: 'streaming' }]),
      ),
    ).toBe('responding');
    expect(
      detectStreamingMode(streamingMessage([{ type: 'dsl', status: 'streaming' }])),
    ).toBe('responding');
  });

  it('先 thinking.delta 再 tool.start：reasoning → tool（spec: 模式推导）', () => {
    const parts: ChatPart[] = [
      { type: 'thinking', content: '…', status: 'streaming' },
    ];
    expect(detectStreamingMode(streamingMessage(parts))).toBe('reasoning');
    parts.push({ type: 'tool-call', name: 'search', status: 'running' });
    expect(detectStreamingMode(streamingMessage(parts))).toBe('tool');
  });

  it('优先序：未完结 tool-call 总是 tool，即使更晚有 text streaming', () => {
    const message = streamingMessage([
      { type: 'tool-call', name: 'search', status: 'running' },
      { type: 'text', content: '中间输出', status: 'streaming' },
    ]);
    expect(detectStreamingMode(message)).toBe('tool');
  });

  it('优先序：无活动 tool 时更晚的活动 part 生效（thinking 后 text streaming → responding）', () => {
    const message = streamingMessage([
      { type: 'thinking', content: '…', status: 'streaming' },
      { type: 'text', content: '正文', status: 'streaming' },
    ]);
    expect(detectStreamingMode(message)).toBe('responding');
  });

  it('优先序：text 之后 thinking 仍 streaming → reasoning（更晚的活动 part 生效）', () => {
    const message = streamingMessage([
      { type: 'text', content: '前文', status: 'ready' },
      { type: 'thinking', content: '…', status: 'streaming' },
    ]);
    expect(detectStreamingMode(message)).toBe('reasoning');
  });

  it('已完结的 tool-call 不算活动：success 后 thinking streaming → reasoning', () => {
    const message = streamingMessage([
      { type: 'tool-call', name: 'search', status: 'success' },
      { type: 'tool-result', name: 'search', status: 'success', result: {} },
      { type: 'thinking', content: '…', status: 'streaming' },
    ]);
    expect(detectStreamingMode(message)).toBe('reasoning');
  });

  it('消息非 streaming / pending → null（spec: 结束定格）', () => {
    const parts: ChatPart[] = [{ type: 'text', content: '完', status: 'ready' }];
    for (const status of ['completed', 'error', 'cancelled'] as const) {
      expect(
        detectStreamingMode({ id: 'm1', role: 'assistant', status, parts }),
      ).toBeNull();
    }
  });

  it('无活动 part（pending 占位 / 全部 ready）→ null', () => {
    expect(
      detectStreamingMode({ id: 'm1', role: 'assistant', status: 'pending', parts: [] }),
    ).toBeNull();
    expect(
      detectStreamingMode(
        streamingMessage([{ type: 'text', content: '停', status: 'ready' }]),
      ),
    ).toBeNull();
  });
});

describe('pairToolTraces（spec: chat-activity-trace / 配对工具轨迹）', () => {
  it('call 与 result 配对为一条轨迹条目（spec: call 与 result 配对为一行）', () => {
    const parts: ChatPart[] = [
      { type: 'tool-call', name: 'search', title: '搜索', status: 'success' },
      { type: 'tool-result', name: 'search', status: 'success', result: { hits: 3 } },
    ];
    const entries = pairToolTraces(parts);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      name: 'search',
      title: '搜索',
      status: 'success',
      result: { hits: 3 },
      callIndex: 0,
      resultIndex: 1,
    });
  });

  it('轨迹条目携带配对 tool-call 的 args（spec: 轨迹条目携带调用参数）', () => {
    const parts: ChatPart[] = [
      {
        type: 'tool-call',
        name: 'search',
        title: '搜索',
        status: 'success',
        args: { query: 'pactor', limit: 5 },
      },
      { type: 'tool-result', name: 'search', status: 'success', result: { hits: 3 } },
    ];
    const entries = pairToolTraces(parts);
    expect(entries[0]?.args).toEqual({ query: 'pactor', limit: 5 });
  });

  it('tool-call 无 args 时条目 args 缺省', () => {
    const parts: ChatPart[] = [
      { type: 'tool-call', name: 'search', status: 'running' },
    ];
    const entries = pairToolTraces(parts);
    expect(entries[0]?.args).toBeUndefined();
  });

  it('failed 结果 → failed，携带 error', () => {
    const parts: ChatPart[] = [
      { type: 'tool-call', name: 'search', status: 'failed' },
      { type: 'tool-result', name: 'search', status: 'failed', error: '超时' },
    ];
    const entries = pairToolTraces(parts);
    expect(entries[0]).toMatchObject({ status: 'failed', error: '超时' });
  });

  it('同名多 call 按出现顺序配对：result 落到最早未完结的同名 call', () => {
    const parts: ChatPart[] = [
      { type: 'tool-call', name: 'search', status: 'success' },
      { type: 'tool-call', name: 'search', status: 'running' },
      { type: 'tool-result', name: 'search', status: 'success', result: 'r1' },
    ];
    const entries = pairToolTraces(parts);
    expect(entries).toHaveLength(2);
    expect(entries[0]).toMatchObject({ status: 'success', result: 'r1', callIndex: 0, resultIndex: 2 });
    expect(entries[1]).toMatchObject({ status: 'running', callIndex: 1 });
    expect(entries[1]?.resultIndex).toBeUndefined();
  });

  it('未完结 call 兜底：保留 call 自身 waiting/running 状态，无 resultIndex', () => {
    const parts: ChatPart[] = [
      { type: 'tool-call', name: 'search', status: 'running' },
      { type: 'text', content: '等待中', status: 'streaming' },
    ];
    const entries = pairToolTraces(parts);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ name: 'search', status: 'running', callIndex: 0 });
    expect(entries[0]?.resultIndex).toBeUndefined();
    expect(entries[0]?.result).toBeUndefined();
  });

  it('不同名 result 不错配；无 call 的孤儿 result 被忽略', () => {
    const parts: ChatPart[] = [
      { type: 'tool-result', name: 'orphan', status: 'success', result: 1 },
      { type: 'tool-call', name: 'search', status: 'running' },
      { type: 'tool-result', name: 'other', status: 'success', result: 2 },
    ];
    const entries = pairToolTraces(parts);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ name: 'search', status: 'running' });
    expect(entries[0]?.resultIndex).toBeUndefined();
  });

  it('非 tool part 被忽略，多个工具调用按序排列', () => {
    const parts: ChatPart[] = [
      { type: 'thinking', content: '…', status: 'ready' },
      { type: 'tool-call', name: 'a', status: 'success' },
      { type: 'tool-result', name: 'a', status: 'success', result: 1 },
      { type: 'text', content: '间隔', status: 'ready' },
      { type: 'tool-call', name: 'b', title: '第二个', status: 'waiting' },
    ];
    const entries = pairToolTraces(parts);
    expect(entries.map((e) => e.name)).toEqual(['a', 'b']);
    expect(entries[0]).toMatchObject({ callIndex: 1, resultIndex: 2, status: 'success' });
    expect(entries[1]).toMatchObject({ callIndex: 4, status: 'waiting', title: '第二个' });
  });
});
