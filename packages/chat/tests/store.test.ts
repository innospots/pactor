import { describe, expect, it, vi } from 'vitest';

import type { ChatMessage } from '../src/index.js';
import { ConversationStore } from '../src/index.js';

/** spec: chat-message-model / 类型完备（编译期锁定各 part variant 与状态机） */
const FULL_MESSAGE: ChatMessage = {
  id: 'm1',
  role: 'assistant',
  status: 'streaming',
  createdAt: 1,
  parts: [
    { type: 'text', content: 'hi', status: 'ready' },
    { type: 'markdown', content: '# t', status: 'streaming' },
    { type: 'dsl', schema: { type: 'Statistic' }, status: 'pending' },
    { type: 'thinking', content: '…', status: 'ready' },
    { type: 'tool-call', name: 'search', title: '搜索', status: 'running' },
    { type: 'tool-result', name: 'search', status: 'failed', error: 'x' },
    { type: 'error', message: 'boom' },
    { type: 'status', text: '正在输入' },
  ],
};

describe('ConversationStore', () => {
  it('类型完备：各 part variant 与消息状态可构造', () => {
    const statuses: ChatMessage['status'][] = [
      'pending',
      'streaming',
      'completed',
      'error',
      'cancelled',
    ];
    expect(statuses).toHaveLength(5);
    expect(FULL_MESSAGE.parts).toHaveLength(8);
  });

  it('追加与更新：appendMessage → updateMessage → appendPart，数组引用变化（spec: 追加与更新）', () => {
    const store = new ConversationStore();
    store.appendMessage({ id: 'm1', role: 'user', status: 'pending', parts: [] });
    const ref1 = store.getMessages();

    store.updateMessage('m1', { status: 'completed' });
    const ref2 = store.getMessages();
    expect(ref2).not.toBe(ref1);
    expect(store.getMessage('m1')?.status).toBe('completed');

    store.appendPart('m1', { type: 'text', content: '你好', status: 'ready' });
    const ref3 = store.getMessages();
    expect(ref3).not.toBe(ref2);
    expect(store.getMessage('m1')?.parts).toHaveLength(1);
    // 未被修改的消息对象保持引用稳定
    store.appendMessage({ id: 'm2', role: 'assistant', status: 'pending', parts: [] });
    expect(store.getMessage('m1')).toBe(ref3[0]);
  });

  it('updatePart 按下标与按 id 均可定位', () => {
    const store = new ConversationStore();
    store.appendMessage({
      id: 'm1',
      role: 'assistant',
      status: 'streaming',
      parts: [{ id: 'p1', type: 'text', content: 'a', status: 'streaming' }],
    });
    store.updatePart('m1', 0, { content: 'ab' });
    expect(store.getMessage('m1')?.parts[0]).toMatchObject({ content: 'ab' });
    store.updatePart('m1', 'p1', { status: 'ready' });
    expect(store.getMessage('m1')?.parts[0]).toMatchObject({ status: 'ready' });
  });

  it('订阅通知：变更均通知，退订后不再通知（spec: 订阅通知）', () => {
    const store = new ConversationStore();
    const listener = vi.fn();
    const off = store.subscribe(listener);

    store.appendMessage({ id: 'm1', role: 'user', status: 'completed', parts: [] });
    store.setStatus('m1', 'completed');
    expect(listener).toHaveBeenCalledTimes(2);

    off();
    store.clear();
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('未知 messageId 的更新宽容：告警不抛错', () => {
    const store = new ConversationStore();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    store.updateMessage('missing', { status: 'error' });
    store.appendPart('missing', { type: 'text', content: 'x' });
    expect(warn).toHaveBeenCalled();
    expect(store.getMessages()).toHaveLength(0);
    warn.mockRestore();
  });

  it('clear 清空会话', () => {
    const store = new ConversationStore();
    store.appendMessage({ id: 'm1', role: 'user', status: 'completed', parts: [] });
    store.clear();
    expect(store.getMessages()).toHaveLength(0);
  });

  it('附件引用：含 attachments 的 user 消息可构造（spec: 附件引用）', () => {
    const message: ChatMessage = {
      id: 'm1',
      role: 'user',
      status: 'completed',
      parts: [{ type: 'text', content: '看下这个文件' }],
      attachments: [
        { id: 'a1', name: '报表.pdf', mimeType: 'application/pdf', size: 1024 },
        { id: 'a2', name: '截图.png', mimeType: 'image/png', url: 'https://example.com/x.png' },
      ],
    };
    expect(message.attachments).toHaveLength(2);
    expect(message.attachments?.[0]).toMatchObject({ name: '报表.pdf', mimeType: 'application/pdf' });
  });

  it('removeMessagesFrom：移除该消息及其后全部消息，之前的消息不变（spec: 截断消息）', () => {
    const store = new ConversationStore();
    for (const id of ['m1', 'm2', 'm3', 'm4']) {
      store.appendMessage({ id, role: 'user', status: 'completed', parts: [] });
    }
    const before = store.getMessages();

    store.removeMessagesFrom('m2');
    const after = store.getMessages();
    expect(after).not.toBe(before);
    expect(after.map((m) => m.id)).toEqual(['m1']);
    // 未被移除的消息对象保持引用稳定
    expect(after[0]).toBe(before[0]);
  });

  it('removeMessagesFrom：不可变——旧数组引用内容不变', () => {
    const store = new ConversationStore();
    for (const id of ['m1', 'm2']) {
      store.appendMessage({ id, role: 'user', status: 'completed', parts: [] });
    }
    const before = store.getMessages();
    store.removeMessagesFrom('m1');
    expect(before.map((m) => m.id)).toEqual(['m1', 'm2']);
    expect(store.getMessages()).toHaveLength(0);
  });

  it('removeMessagesFrom：未知 id 告警并忽略，数组引用不变', () => {
    const store = new ConversationStore();
    store.appendMessage({ id: 'm1', role: 'user', status: 'completed', parts: [] });
    const before = store.getMessages();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    store.removeMessagesFrom('missing');
    expect(warn).toHaveBeenCalled();
    expect(store.getMessages()).toBe(before);
    warn.mockRestore();
  });

  it('removeMessagesFrom：通知订阅者', () => {
    const store = new ConversationStore();
    store.appendMessage({ id: 'm1', role: 'user', status: 'completed', parts: [] });
    store.appendMessage({ id: 'm2', role: 'assistant', status: 'completed', parts: [] });
    const listener = vi.fn();
    store.subscribe(listener);

    store.removeMessagesFrom('m2');
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
