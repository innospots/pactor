import type { DslNode } from 'pactor-core';
import { describe, expect, it, vi } from 'vitest';

import type { ChatEvent } from '../src/index.js';
import { applyChatEvent, ConversationStore } from '../src/index.js';

const DSL_SCHEMA: DslNode = {
  type: 'Statistic',
  props: { title: '总数', value: 42 },
};

describe('applyChatEvent（spec: chat-streaming）', () => {
  it('事件类型构造：text.delta 与 dsl.complete（编译期锁定）', () => {
    const events: ChatEvent[] = [
      { type: 'message.start', messageId: 'm1' },
      { type: 'text.delta', messageId: 'm1', delta: '根据当前' },
      { type: 'thinking.delta', messageId: 'm1', delta: '嗯' },
      { type: 'tool.start', messageId: 'm1', name: 'search' },
      { type: 'tool.result', messageId: 'm1', name: 'search', status: 'success' },
      { type: 'dsl.start', messageId: 'm1' },
      { type: 'dsl.complete', messageId: 'm1', schema: DSL_SCHEMA },
      { type: 'message.end', messageId: 'm1' },
      { type: 'message.error', messageId: 'm1', error: 'x' },
    ];
    expect(events).toHaveLength(9);
  });

  it('流式文本追加：两个 delta 拼接，message.end 后 completed 且 part ready（spec: 流式文本追加）', () => {
    const store = new ConversationStore();
    applyChatEvent(store, { type: 'message.start', messageId: 'm1' });
    applyChatEvent(store, { type: 'text.delta', messageId: 'm1', delta: '根据当前' });
    applyChatEvent(store, { type: 'text.delta', messageId: 'm1', delta: '数据' });

    let message = store.getMessage('m1')!;
    expect(message.status).toBe('streaming');
    expect(message.parts[0]).toMatchObject({
      type: 'text',
      content: '根据当前数据',
      status: 'streaming',
    });

    applyChatEvent(store, { type: 'message.end', messageId: 'm1' });
    message = store.getMessage('m1')!;
    expect(message.status).toBe('completed');
    expect(message.parts[0]).toMatchObject({ status: 'ready' });
  });

  it('dsl.start 建立占位，dsl.complete 写入 schema 并置 ready（spec: dsl.complete）', () => {
    const store = new ConversationStore();
    applyChatEvent(store, { type: 'message.start', messageId: 'm1' });
    applyChatEvent(store, { type: 'dsl.start', messageId: 'm1' });
    expect(store.getMessage('m1')?.parts[0]).toMatchObject({
      type: 'dsl',
      status: 'pending',
    });
    expect(
      (store.getMessage('m1')?.parts[0] as { schema?: unknown }).schema,
    ).toBeUndefined();

    applyChatEvent(store, { type: 'dsl.complete', messageId: 'm1', schema: DSL_SCHEMA });
    expect(store.getMessage('m1')?.parts[0]).toMatchObject({
      type: 'dsl',
      status: 'ready',
      schema: DSL_SCHEMA,
    });
  });

  it('乱序宽容：未收到 message.start 直接 text.delta，自动建占位不抛错（spec: 乱序宽容）', () => {
    const store = new ConversationStore();
    expect(() =>
      applyChatEvent(store, { type: 'text.delta', messageId: 'm9', delta: 'hi' }),
    ).not.toThrow();
    const message = store.getMessage('m9')!;
    expect(message.role).toBe('assistant');
    expect(message.status).toBe('streaming');
    expect(message.parts[0]).toMatchObject({ type: 'text', content: 'hi' });
  });

  it('未知事件忽略并告警，不抛错', () => {
    const store = new ConversationStore();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() =>
      applyChatEvent(store, { type: 'dsl.patch', messageId: 'm1' } as unknown as ChatEvent),
    ).not.toThrow();
    expect(warn).toHaveBeenCalled();
    expect(store.getMessages()).toHaveLength(0);
    warn.mockRestore();
  });

  it('thinking.delta 建立并追加 thinking part（与正文分离）', () => {
    const store = new ConversationStore();
    applyChatEvent(store, { type: 'thinking.delta', messageId: 'm1', delta: '先想' });
    applyChatEvent(store, { type: 'thinking.delta', messageId: 'm1', delta: '再想' });
    applyChatEvent(store, { type: 'text.delta', messageId: 'm1', delta: '正文' });
    const parts = store.getMessage('m1')!.parts;
    expect(parts[0]).toMatchObject({ type: 'thinking', content: '先想再想' });
    expect(parts[1]).toMatchObject({ type: 'text', content: '正文' });
  });

  it('tool.start / tool.result 建立并更新 tool part 状态', () => {
    const store = new ConversationStore();
    applyChatEvent(store, { type: 'tool.start', messageId: 'm1', name: 'search', title: '搜索' });
    expect(store.getMessage('m1')?.parts[0]).toMatchObject({
      type: 'tool-call',
      name: 'search',
      status: 'running',
    });

    applyChatEvent(store, {
      type: 'tool.result',
      messageId: 'm1',
      name: 'search',
      status: 'success',
      result: { count: 3 },
    });
    const parts = store.getMessage('m1')!.parts;
    expect(parts[0]).toMatchObject({ type: 'tool-call', status: 'success' });
    expect(parts[1]).toMatchObject({
      type: 'tool-result',
      name: 'search',
      status: 'success',
      result: { count: 3 },
    });
  });

  it('tool.start 携带 args：新建 part 时存入 tool-call（spec: tool.start 携带调用参数）', () => {
    const store = new ConversationStore();
    applyChatEvent(store, {
      type: 'tool.start',
      messageId: 'm1',
      name: 'search',
      title: '搜索',
      args: { query: 'pactor', limit: 5 },
    });
    expect(store.getMessage('m1')?.parts[0]).toMatchObject({
      type: 'tool-call',
      name: 'search',
      status: 'running',
      args: { query: 'pactor', limit: 5 },
    });
  });

  it('tool.start 携带 args：part 已存在时同样写入 args', () => {
    const store = new ConversationStore();
    applyChatEvent(store, { type: 'tool.start', messageId: 'm1', name: 'search' });
    expect(
      (store.getMessage('m1')?.parts[0] as { args?: unknown }).args,
    ).toBeUndefined();

    applyChatEvent(store, {
      type: 'tool.start',
      messageId: 'm1',
      name: 'search',
      args: { query: 'pactor' },
    });
    const parts = store.getMessage('m1')!.parts;
    expect(parts).toHaveLength(1);
    expect(parts[0]).toMatchObject({ args: { query: 'pactor' } });
  });

  it('tool.start 未携带 args：行为不变，args 缺省', () => {
    const store = new ConversationStore();
    applyChatEvent(store, { type: 'tool.start', messageId: 'm1', name: 'search' });
    const part = store.getMessage('m1')!.parts[0]!;
    expect(part).toMatchObject({ type: 'tool-call', name: 'search', status: 'running' });
    expect((part as { args?: unknown }).args).toBeUndefined();
  });

  it('markdown delta：format=markdown 时建立 markdown part', () => {
    const store = new ConversationStore();
    applyChatEvent(store, {
      type: 'text.delta',
      messageId: 'm1',
      delta: '# 标题',
      format: 'markdown',
    });
    expect(store.getMessage('m1')?.parts[0]).toMatchObject({
      type: 'markdown',
      content: '# 标题',
    });
  });

  it('message.error 置 error 状态并附 error part', () => {
    const store = new ConversationStore();
    applyChatEvent(store, { type: 'message.start', messageId: 'm1' });
    applyChatEvent(store, { type: 'message.error', messageId: 'm1', error: '上游超时' });
    const message = store.getMessage('m1')!;
    expect(message.status).toBe('error');
    expect(message.parts[message.parts.length - 1]).toMatchObject({ type: 'error', message: '上游超时' });
  });
});
