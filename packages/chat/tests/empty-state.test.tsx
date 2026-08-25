// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  applyChatEvent,
  ChatView,
  ConversationStore,
  createManualDriver,
} from '../src/index.js';

afterEach(cleanup);

function createStore(): ConversationStore {
  return new ConversationStore();
}

describe('EmptyState（spec: chat-empty-state）', () => {
  it('空会话渲染默认问候语而非空白列表（spec: 空会话渲染问候）', () => {
    const store = createStore();
    render(<ChatView store={store} />);
    const greeting = document.querySelector('.pactor-chat-empty__greeting');
    expect(greeting).toBeTruthy();
    expect(greeting!.textContent).toBe('你好，有什么可以帮你？');
  });

  it('首条消息进入后空状态消失（spec: 有消息后隐藏）', async () => {
    const store = createStore();
    render(<ChatView store={store} />);
    expect(document.querySelector('.pactor-chat-empty')).toBeTruthy();

    applyChatEvent(store, { type: 'message.start', messageId: 'a1' });
    applyChatEvent(store, { type: 'text.delta', messageId: 'a1', delta: '你好' });
    await screen.findByText('你好');
    expect(document.querySelector('.pactor-chat-empty')).toBeNull();
  });

  it('greeting / subtitle prop 覆盖默认文案', () => {
    const store = createStore();
    render(<ChatView store={store} greeting="早上好" subtitle="今天想分析什么？" />);
    expect(screen.getByText('早上好')).toBeTruthy();
    expect(screen.getByText('今天想分析什么？')).toBeTruthy();
    expect(screen.queryByText('你好，有什么可以帮你？')).toBeNull();
  });

  it('点击建议以 prompt ?? label 触发 onSend（spec: 点击建议发送）', () => {
    const onSend = vi.fn();
    const store = createStore();
    render(
      <ChatView
        store={store}
        onSend={onSend}
        suggestions={['直接建议', { label: '带提示', prompt: '实际发送文本' }]}
      />,
    );

    fireEvent.click(screen.getByText('直接建议'));
    expect(onSend).toHaveBeenCalledWith('直接建议');
    fireEvent.click(screen.getByText('带提示'));
    expect(onSend).toHaveBeenCalledWith('实际发送文本');
  });

  it('点击建议经 transport 驱动 turn（与 Composer 发送一致）', async () => {
    const store = createStore();
    const driver = createManualDriver();
    render(
      <ChatView
        store={store}
        transport={driver.transport}
        suggestions={['帮我分析']}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '帮我分析' }));
    // user 消息立即出现，空状态消失
    await screen.findByText('帮我分析', {
      selector: '.pactor-chat-message--user *',
    });
    expect(document.querySelector('.pactor-chat-empty')).toBeNull();

    driver.push({ type: 'text.delta', messageId: 'x', delta: '分析结果' });
    await screen.findByText('分析结果');
  });

  it('suggestions 为空数组 / 未传时不渲染建议区（spec: 无建议不渲染）', () => {
    const store = createStore();
    render(<ChatView store={store} suggestions={[]} />);
    expect(document.querySelector('.pactor-chat-empty__suggestions')).toBeNull();
    expect(document.querySelector('.pactor-chat-empty__greeting')).toBeTruthy();
  });
});
