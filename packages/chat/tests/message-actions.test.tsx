// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ChatView,
  ConversationStore,
  createManualDriver,
  type ChatMessage,
} from '../src/index.js';

afterEach(cleanup);

function createStore(): ConversationStore {
  return new ConversationStore();
}

function userMessage(id: string, text: string): ChatMessage {
  return {
    id,
    role: 'user',
    status: 'completed',
    parts: [{ type: 'text', content: text, status: 'ready' }],
  };
}

function assistantMessage(
  id: string,
  text: string,
  status: ChatMessage['status'] = 'completed',
): ChatMessage {
  return {
    id,
    role: 'assistant',
    status,
    parts: [{ type: 'markdown', content: text, status: 'ready' }],
  };
}

describe('消息操作条（spec: chat-message-actions / 消息操作条）', () => {
  it('复制：剪贴板收到文本并给出已复制反馈（spec: 复制消息）', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    const store = createStore();
    store.appendMessage(assistantMessage('a1', '**结论**：正常'));

    render(<ChatView store={store} />);
    fireEvent.click(screen.getByRole('button', { name: '复制' }));
    expect(writeText).toHaveBeenCalledWith('**结论**：正常');
    await screen.findByRole('button', { name: '已复制' });
  });

  it('末条 completed assistant 出示重新生成入口，点击后旧回复被移除且 user 数不变（spec: 重新生成末轮）', async () => {
    const store = createStore();
    store.appendMessage(userMessage('u1', '第一问'));
    store.appendMessage(assistantMessage('a1', '第一答'));
    const driver = createManualDriver();
    render(<ChatView store={store} transport={driver.transport} />);

    fireEvent.click(screen.getByRole('button', { name: '重新生成' }));

    // 旧 assistant 回复被移除，新 assistant 占位追加；user 消息数不变
    await vi.waitFor(() => {
      const messages = store.getMessages();
      expect(messages.filter((m) => m.role === 'user')).toHaveLength(1);
      expect(messages.find((m) => m.id === 'a1')).toBeUndefined();
      const assistants = messages.filter((m) => m.role === 'assistant');
      expect(assistants).toHaveLength(1);
    });

    driver.push({ type: 'text.delta', messageId: 'x', delta: '新回答' });
    driver.push({ type: 'message.end', messageId: 'x' });
    driver.complete();
    await screen.findByText('新回答');
  });

  it('非末条 assistant 不出示重新生成入口', () => {
    const store = createStore();
    store.appendMessage(userMessage('u1', '第一问'));
    store.appendMessage(assistantMessage('a1', '第一答'));
    store.appendMessage(userMessage('u2', '第二问'));
    store.appendMessage(assistantMessage('a2', '第二答'));

    render(<ChatView store={store} />);
    // 仅末条 assistant（a2）有资格；未注入 transport 时入口整体不渲染
    expect(screen.queryByRole('button', { name: '重新生成' })).toBeNull();
  });

  it('未注入 transport（onSend-only 模式）时不渲染重新生成 / 重试入口', () => {
    const store = createStore();
    store.appendMessage(userMessage('u1', '问题'));
    store.appendMessage(assistantMessage('a1', '回答'));
    store.appendMessage({
      id: 'a2',
      role: 'assistant',
      status: 'error',
      parts: [{ type: 'error', message: '上游超时' }],
    });

    render(<ChatView store={store} onSend={() => {}} />);
    expect(screen.queryByRole('button', { name: '重新生成' })).toBeNull();
    expect(screen.queryByRole('button', { name: '重试' })).toBeNull();
  });

  it('error assistant 出示重试入口，点击移除 error 消息并重跑该轮（spec: 失败后重试）', async () => {
    const store = createStore();
    store.appendMessage(userMessage('u1', '问题'));
    store.appendMessage({
      id: 'a1',
      role: 'assistant',
      status: 'error',
      parts: [{ type: 'error', message: '上游超时' }],
    });
    const driver = createManualDriver();
    render(<ChatView store={store} transport={driver.transport} />);

    fireEvent.click(screen.getByRole('button', { name: '重试' }));

    await vi.waitFor(() => {
      const messages = store.getMessages();
      expect(messages.find((m) => m.id === 'a1')).toBeUndefined();
      const assistants = messages.filter((m) => m.role === 'assistant');
      expect(assistants).toHaveLength(1);
      expect(messages.filter((m) => m.role === 'user')).toHaveLength(1);
    });

    driver.push({ type: 'text.delta', messageId: 'x', delta: '重试成功' });
    driver.push({ type: 'message.end', messageId: 'x' });
    driver.complete();
    await screen.findByText('重试成功');
  });

  it('重新生成进行中点击停止：新 assistant 消息以 cancelled 收尾（spec: abort 取消重新生成）', async () => {
    const store = createStore();
    store.appendMessage(userMessage('u1', '问题'));
    store.appendMessage(assistantMessage('a1', '旧回答'));
    const driver = createManualDriver();
    render(<ChatView store={store} transport={driver.transport} />);

    fireEvent.click(screen.getByRole('button', { name: '重新生成' }));
    driver.push({ type: 'text.delta', messageId: 'x', delta: '半截' });
    await screen.findByText('半截');

    fireEvent.click(screen.getByRole('button', { name: '停止生成' }));
    driver.complete();

    await vi.waitFor(() => {
      const assistant = store.getMessages().find((m) => m.role === 'assistant')!;
      expect(assistant.status).toBe('cancelled');
    });
  });
});

describe('用户消息编辑重发（spec: chat-message-actions / 用户消息编辑重发）', () => {
  it('编辑入口：点击后气泡替换为内联编辑框并预填原文本', () => {
    const store = createStore();
    store.appendMessage(userMessage('u1', '原始文本'));
    store.appendMessage(assistantMessage('a1', '回答'));

    render(<ChatView store={store} />);
    fireEvent.click(screen.getByRole('button', { name: '编辑' }));

    const editor = screen.getByRole('textbox', { name: '编辑消息' });
    expect((editor as HTMLTextAreaElement).value).toBe('原始文本');
  });

  it('确认编辑：该消息及之后消息被移除，新文本驱动新 turn（spec: 编辑并重发）', async () => {
    const store = createStore();
    store.appendMessage(userMessage('u1', '第一问'));
    store.appendMessage(assistantMessage('a1', '第一答'));
    store.appendMessage(userMessage('u2', '第二问'));
    store.appendMessage(assistantMessage('a2', '第二答'));
    const onSend = vi.fn();
    const driver = createManualDriver();
    render(<ChatView store={store} transport={driver.transport} onSend={onSend} />);

    // 编辑中间的 u1
    const u1Node = document.querySelector('[data-message-id="u1"]')!;
    fireEvent.click(
      u1Node.querySelector('button[aria-label="编辑"]') as HTMLButtonElement,
    );
    const editor = screen.getByRole('textbox', { name: '编辑消息' });
    fireEvent.change(editor, { target: { value: '改后的第一问' } });
    fireEvent.click(screen.getByRole('button', { name: '确认发送' }));

    // u1 及之后全部移除，新文本作为新 user 消息追加并驱动 turn
    expect(onSend).toHaveBeenCalledWith('改后的第一问');
    await vi.waitFor(() => {
      const messages = store.getMessages();
      expect(messages.find((m) => m.id === 'u1')).toBeUndefined();
      expect(messages.find((m) => m.id === 'a1')).toBeUndefined();
      expect(messages.find((m) => m.id === 'u2')).toBeUndefined();
      expect(messages.find((m) => m.id === 'a2')).toBeUndefined();
      expect(messages.filter((m) => m.role === 'user')).toHaveLength(1);
      expect(messages.some((m) => m.role === 'assistant')).toBe(true);
    });

    driver.push({ type: 'text.delta', messageId: 'x', delta: '新答复' });
    driver.push({ type: 'message.end', messageId: 'x' });
    driver.complete();
    await screen.findByText('新答复');
  });

  it('取消编辑：store 保持不变（spec: 取消编辑）', () => {
    const store = createStore();
    store.appendMessage(userMessage('u1', '原始文本'));
    store.appendMessage(assistantMessage('a1', '回答'));
    const before = store.getMessages();

    render(<ChatView store={store} />);
    fireEvent.click(screen.getByRole('button', { name: '编辑' }));
    const editor = screen.getByRole('textbox', { name: '编辑消息' });
    fireEvent.change(editor, { target: { value: '改掉的内容' } });
    fireEvent.click(screen.getByRole('button', { name: '取消' }));

    // 编辑框关闭，消息列表原样
    expect(screen.queryByRole('textbox', { name: '编辑消息' })).toBeNull();
    expect(store.getMessages()).toBe(before);
    expect(screen.getByText('原始文本')).toBeTruthy();
  });
});


describe('messageActions 声明式配置（spec: chat-message-actions / 消息操作条声明式配置）', () => {
  it('缺省回归：streaming 中不渲染操作条；cancelled 终态显示复制', () => {
    const store = createStore();
    store.appendMessage(userMessage('u1', '问题'));
    store.appendMessage(assistantMessage('a1', '生成中', 'streaming'));
    store.appendMessage(assistantMessage('a2', '被中断', 'cancelled'));

    render(<ChatView store={store} />);
    const streamingNode = document.querySelector('[data-message-id="a1"]')!;
    expect(
      streamingNode.querySelector('.pactor-chat-message__actions'),
    ).toBeNull();
    // cancelled 归入 'completed'（非流式非错误终态）：复制入口可见
    const cancelledNode = document.querySelector('[data-message-id="a2"]')!;
    expect(
      cancelledNode.querySelector('button[aria-label="复制"]'),
    ).not.toBeNull();
  });

  it('数组即真相：未列出的内建动作不出现，顺序与数组一致', () => {
    const store = createStore();
    store.appendMessage(userMessage('u1', '问题'));
    store.appendMessage(assistantMessage('a1', '回答'));
    const driver = createManualDriver();

    render(
      <ChatView
        store={store}
        transport={driver.transport}
        messageActions={[
          'copy',
          { id: 'quote', label: '引用', icon: 'quote', service: 'quoteMessage' },
        ]}
      />,
    );

    const assistantNode = document.querySelector('[data-message-id="a1"]')!;
    const labels = Array.from(
      assistantNode.querySelectorAll(
        '.pactor-chat-message__actions button',
      ),
    ).map((button) => button.getAttribute('aria-label'));
    // 严格按数组：仅复制与引用；regenerate / retry 未列出不出现
    expect(labels).toEqual(['复制', '引用']);
    const userNode = document.querySelector('[data-message-id="u1"]')!;
    // edit 未列出：user 消息不出现编辑入口
    expect(userNode.querySelector('button[aria-label="编辑"]')).toBeNull();
    expect(screen.queryByRole('button', { name: '重新生成' })).toBeNull();
  });

  it('渲染顺序与配置数组一致', () => {
    const store = createStore();
    store.appendMessage(assistantMessage('a1', '回答'));

    render(
      <ChatView
        store={store}
        messageActions={[
          { id: 'zeta', label: '乙' },
          { id: 'alpha', label: '甲' },
        ]}
      />,
    );

    const labels = Array.from(
      document.querySelectorAll('.pactor-chat-message__actions button'),
    ).map((button) => button.getAttribute('aria-label'));
    expect(labels).toEqual(['乙', '甲']);
  });

  it('内建字段覆盖：edit 改 label 并放宽 roles，点击仍执行内建编辑行为', () => {
    const store = createStore();
    store.appendMessage(userMessage('u1', '原始文本'));
    store.appendMessage(assistantMessage('a1', '回答'));

    render(
      <ChatView
        store={store}
        messageActions={[
          'copy',
          {
            id: 'edit',
            builtin: 'edit',
            label: '修改并重发',
            roles: ['user', 'assistant'],
          },
        ]}
      />,
    );

    // user 与 assistant 消息均显示该按钮，tooltip 为覆盖后的文案
    expect(
      screen.getAllByRole('button', { name: '修改并重发' }),
    ).toHaveLength(2);

    // 点击 user 消息上的按钮：仍进入内联编辑框（内建行为不变）
    const userNode = document.querySelector('[data-message-id="u1"]')!;
    fireEvent.click(
      userNode.querySelector('button[aria-label="修改并重发"]') as HTMLButtonElement,
    );
    const editor = screen.getByRole('textbox', { name: '编辑消息' });
    expect((editor as HTMLTextAreaElement).value).toBe('原始文本');
  });

  it('末条约束不可覆盖：regenerate 放宽 roles / visibleWhen 仍仅末条 assistant 出现', () => {
    const store = createStore();
    store.appendMessage(userMessage('u1', '第一问'));
    store.appendMessage(assistantMessage('a1', '第一答'));
    store.appendMessage(userMessage('u2', '第二问'));
    store.appendMessage(assistantMessage('a2', '第二答'));
    const driver = createManualDriver();

    render(
      <ChatView
        store={store}
        transport={driver.transport}
        messageActions={[
          {
            id: 'regen',
            builtin: 'regenerate',
            roles: ['user', 'assistant'],
            visibleWhen: 'always',
          },
        ]}
      />,
    );

    const buttons = screen.getAllByRole('button', { name: '重新生成' });
    expect(buttons).toHaveLength(1);
    const lastNode = document.querySelector('[data-message-id="a2"]')!;
    expect(lastNode.contains(buttons[0]!)).toBe(true);
  });

  it('自定义动作点击经 callService(service, { actionId, message }) 派发', () => {
    const store = createStore();
    store.appendMessage(assistantMessage('a1', '回答'));
    const callService = vi.fn().mockResolvedValue(undefined);

    render(
      <ChatView
        store={store}
        callService={callService}
        messageActions={[
          { id: 'quote', label: '引用', icon: 'quote', service: 'quoteMessage' },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '引用' }));
    expect(callService).toHaveBeenCalledWith('quoteMessage', {
      actionId: 'quote',
      message: expect.objectContaining({ id: 'a1', role: 'assistant' }),
    });
  });

  it('未注入 callService：console.warn 跳过派发，事件仍触发，不抛错', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const store = createStore();
    store.appendMessage(assistantMessage('a1', '回答'));
    const onMessageAction = vi.fn();

    render(
      <ChatView
        store={store}
        onMessageAction={onMessageAction}
        messageActions={[
          { id: 'quote', label: '引用', icon: 'quote', service: 'quoteMessage' },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '引用' }));
    expect(warn).toHaveBeenCalled();
    expect(onMessageAction).toHaveBeenCalledWith(
      'quote',
      expect.objectContaining({ id: 'a1' }),
    );
    warn.mockRestore();
  });

  it('onMessageAction 通知：内建动作点击同样触发（默认行为不受影响）', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    const store = createStore();
    store.appendMessage(assistantMessage('a1', '回答'));
    const onMessageAction = vi.fn();

    render(<ChatView store={store} onMessageAction={onMessageAction} />);
    fireEvent.click(screen.getByRole('button', { name: '复制' }));

    expect(onMessageAction).toHaveBeenCalledWith(
      'copy',
      expect.objectContaining({ id: 'a1' }),
    );
    // 内建默认行为照常执行
    expect(writeText).toHaveBeenCalledWith('回答');
    await screen.findByRole('button', { name: '已复制' });
  });

  it('未知图标名渲染占位图标，不抛错', () => {
    const store = createStore();
    store.appendMessage(assistantMessage('a1', '回答'));

    render(
      <ChatView
        store={store}
        messageActions={[{ id: 'x', label: '神秘动作', icon: 'no-such-icon' }]}
      />,
    );

    const button = screen.getByRole('button', { name: '神秘动作' });
    expect(button.querySelector('[data-icon-placeholder]')).not.toBeNull();
  });

  it("visibleWhen 'always'：流式中的自定义动作可见可点击", () => {
    const store = createStore();
    store.appendMessage(userMessage('u1', '问题'));
    store.appendMessage(assistantMessage('a1', '生成中', 'streaming'));
    const onMessageAction = vi.fn();

    render(
      <ChatView
        store={store}
        onMessageAction={onMessageAction}
        messageActions={[
          { id: 'live', label: '流式动作', visibleWhen: 'always' },
        ]}
      />,
    );

    const button = screen.getByRole('button', { name: '流式动作' });
    fireEvent.click(button);
    expect(onMessageAction).toHaveBeenCalledWith(
      'live',
      expect.objectContaining({ id: 'a1' }),
    );
  });
});
