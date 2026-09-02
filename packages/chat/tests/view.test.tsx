// @vitest-environment jsdom
import './setup.js';

import { Registry } from '@pactor/core';
import { createShadcnComponentRegistry } from '@pactor/ui/components';
import { createShadcnLayoutRegistry, resolveLayout } from '@pactor/ui/layout';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  applyChatEvent,
  ChatView,
  Composer,
  ConversationStore,
  createManualDriver,
  createSafeRegistry,
  registerChatLayout,
} from '../src/index.js';

afterEach(cleanup);

function createStore(): ConversationStore {
  return new ConversationStore();
}

describe('ChatView（spec: chat-view / 消息列表渲染）', () => {
  it('渲染对话：user 与 assistant markdown 均出现，markdown 渲染为元素（spec: 渲染对话）', () => {
    const store = createStore();
    store.appendMessage({
      id: 'u1',
      role: 'user',
      status: 'completed',
      parts: [{ type: 'text', content: '看下数据', status: 'ready' }],
    });
    store.appendMessage({
      id: 'a1',
      role: 'assistant',
      status: 'completed',
      parts: [{ type: 'markdown', content: '## 分析结果\n\n一切正常', status: 'ready' }],
    });

    render(<ChatView store={store} />);
    expect(screen.getByText('看下数据')).toBeTruthy();
    // markdown 渲染为 h2 元素而非源码文本
    expect(screen.getByRole('heading', { level: 2, name: '分析结果' })).toBeTruthy();
    // role 区分：语义 class 与数据属性
    expect(document.querySelector('.pactor-chat-message--user')).toBeTruthy();
    expect(document.querySelector('.pactor-chat-message--assistant')).toBeTruthy();
  });

  it('流式更新：reducer 推入 text.delta 后内容实时追加（spec: 流式更新）', async () => {
    const store = createStore();
    applyChatEvent(store, { type: 'message.start', messageId: 'a1' });
    render(<ChatView store={store} />);

    applyChatEvent(store, { type: 'text.delta', messageId: 'a1', delta: '根据当前' });
    await screen.findByText('根据当前');
    applyChatEvent(store, { type: 'text.delta', messageId: 'a1', delta: '数据' });
    await screen.findByText('根据当前数据');
  });

  it('端到端：driver 推事件 → ChatView 流式渲染 → completed', async () => {
    const store = createStore();
    const driver = createManualDriver();
    render(<ChatView store={store} transport={driver.transport} />);

    fireEvent.change(document.querySelector('.pactor-chat-composer textarea')!, {
      target: { value: '帮我分析' },
    });
    fireEvent.keyDown(document.querySelector('.pactor-chat-composer textarea')!, {
      key: 'Enter',
    });

    // user 消息立即出现
    await screen.findByText('帮我分析');

    driver.push({ type: 'text.delta', messageId: 'x', delta: '分析' });
    await screen.findByText('分析');
    driver.push({ type: 'text.delta', messageId: 'x', delta: '完成' });
    await screen.findByText('分析完成');
    driver.push({ type: 'message.end', messageId: 'x' });
    driver.complete();

    await vi.waitFor(() => {
      const assistant = store.getMessages().find((m) => m.role === 'assistant')!;
      expect(assistant.status).toBe('completed');
    });
  });
});

describe('PartRenderer（spec: chat-view / PartRenderer）', () => {
  function createChatSafeRegistry(): Registry<unknown> {
    return createSafeRegistry(createShadcnComponentRegistry(), ['Statistic', 'Card']);
  }

  it('dsl part 渲染白名单组件（Statistic），作用域可访问 message.id（spec: dsl part 渲染白名单组件 + DSL 访问 message.id）', async () => {
    const store = createStore();
    store.appendMessage({
      id: 'msg-42',
      role: 'assistant',
      status: 'completed',
      parts: [
        {
          type: 'dsl',
          status: 'ready',
          schema: {
            type: 'Statistic',
            props: { title: '消息 ${message.id}', value: 42 },
          },
        },
      ],
    });

    render(<ChatView store={store} safeRegistry={createChatSafeRegistry()} />);
    await screen.findByText('消息 msg-42');
    expect(screen.getByText('42')).toBeTruthy();
  });

  it('dsl part 非白名单组件渲染受控"不允许"占位（spec: Chat DSL 拦截）', async () => {
    const store = createStore();
    store.appendMessage({
      id: 'a1',
      role: 'assistant',
      status: 'completed',
      parts: [
        {
          type: 'dsl',
          status: 'ready',
          schema: { type: 'Button', props: { text: '越权按钮' } },
        },
      ],
    });

    render(<ChatView store={store} safeRegistry={createChatSafeRegistry()} />);
    await screen.findByText(/该组件不允许在 Chat 中使用/);
    expect(screen.queryByText('越权按钮')).toBeNull();
    expect(document.querySelector('[data-pactor-chat-denied="Button"]')).toBeTruthy();
  });

  it('dsl part 嵌套白名单外节点同样替换为占位', async () => {
    const store = createStore();
    store.appendMessage({
      id: 'a1',
      role: 'assistant',
      status: 'completed',
      parts: [
        {
          type: 'dsl',
          status: 'ready',
          schema: {
            type: 'Card',
            props: { title: '卡片' },
            children: [{ type: 'Input', props: {} }],
          },
        },
      ],
    });

    render(<ChatView store={store} safeRegistry={createChatSafeRegistry()} />);
    await screen.findByText(/该组件不允许在 Chat 中使用：Input/);
  });

  it('tool 轨迹条目：tool-call running 渲染为活动轨迹单行条目，点击可展开（spec: tool 轨迹条目）', async () => {
    const store = createStore();
    store.appendMessage({
      id: 'a1',
      role: 'assistant',
      status: 'streaming',
      parts: [
        { type: 'tool-call', name: 'search', title: '搜索数据', status: 'running' },
      ],
    });

    render(<ChatView store={store} />);
    // 活动轨迹中的单行条目（流式期间默认展开）：名称 + running 状态
    const entry = document.querySelector('.pactor-chat-trace__entry')!;
    expect(entry).toBeTruthy();
    expect(entry.getAttribute('data-status')).toBe('running');
    expect(screen.getByText('搜索数据')).toBeTruthy();
    // MUST NOT 再渲染为独立状态卡
    expect(document.querySelector('.pactor-chat-collapse')).toBeNull();
    // 点击条目展开详情
    fireEvent.click(screen.getByText('搜索数据'));
    expect(entry.getAttribute('data-open')).toBe('true');
    expect(document.querySelector('.pactor-chat-trace__entry-body')).toBeTruthy();
  });

  it('thinking 默认折叠，与正文分离（spec: thinking 折叠）', async () => {
    const store = createStore();
    store.appendMessage({
      id: 'a1',
      role: 'assistant',
      status: 'completed',
      parts: [
        { type: 'thinking', content: '深层推理内容', status: 'ready' },
        { type: 'text', content: '正文回答', status: 'ready' },
      ],
    });

    render(<ChatView store={store} />);
    await screen.findByText('正文回答');
    // 折叠面板标题可见，但 thinking 内容默认不展开（不在文档中）
    expect(screen.getByText('思考过程')).toBeTruthy();
    expect(screen.queryByText('深层推理内容')).toBeNull();
  });

  it('error 与 status part：错误提示与弱提示', async () => {
    const store = createStore();
    store.appendMessage({
      id: 'a1',
      role: 'assistant',
      status: 'error',
      parts: [
        { type: 'status', text: '正在重试' },
        { type: 'error', message: '上游超时' },
      ],
    });

    render(<ChatView store={store} />);
    await screen.findByText('上游超时');
    expect(screen.getByText('正在重试')).toBeTruthy();
  });
});

describe('Composer（spec: chat-view / Composer）', () => {
  it('发送消息：Enter 调用 onSend 并清空输入框（spec: 发送消息）', () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} />);
    const textarea = document.querySelector('.pactor-chat-composer textarea')!;

    fireEvent.change(textarea, { target: { value: '  你好  ' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(onSend).toHaveBeenCalledWith('你好');
    expect((textarea as HTMLTextAreaElement).value).toBe('');
  });

  it('Shift+Enter 换行不发送', () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} />);
    const textarea = document.querySelector('.pactor-chat-composer textarea')!;

    fireEvent.change(textarea, { target: { value: '第一行' } });
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
    expect(onSend).not.toHaveBeenCalled();
  });

  it('空文本不发送（spec: 空文本不发送）', () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} />);
    const textarea = document.querySelector('.pactor-chat-composer textarea')!;

    fireEvent.change(textarea, { target: { value: '   ' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(onSend).not.toHaveBeenCalled();
  });

  it('流式中显示停止按钮，点击触发 onStop（spec: 流式中停止）', () => {
    const onStop = vi.fn();
    render(<Composer streaming onStop={onStop} />);
    expect(screen.queryByRole('button', { name: '发送' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '停止生成' }));
    expect(onStop).toHaveBeenCalled();
  });
});

describe('ChatView 流式停止与操作条（spec: chat-view）', () => {
  it('流式中点击停止按钮：turn 取消，assistant 消息以 cancelled 收尾（spec: 流式中停止）', async () => {
    const store = createStore();
    const driver = createManualDriver();
    render(<ChatView store={store} transport={driver.transport} />);

    fireEvent.change(document.querySelector('.pactor-chat-composer textarea')!, {
      target: { value: '开始' },
    });
    fireEvent.keyDown(document.querySelector('.pactor-chat-composer textarea')!, {
      key: 'Enter',
    });
    driver.push({ type: 'text.delta', messageId: 'x', delta: '半截' });
    await screen.findByText('半截');

    fireEvent.click(await screen.findByRole('button', { name: '停止生成' }));
    driver.complete();

    await vi.waitFor(() => {
      const assistant = store.getMessages().find((m) => m.role === 'assistant')!;
      expect(assistant.status).toBe('cancelled');
    });
  });

  it('hover 操作条：复制 assistant 消息文本（spec: 复制消息）', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    const store = createStore();
    store.appendMessage({
      id: 'a1',
      role: 'assistant',
      status: 'completed',
      parts: [{ type: 'markdown', content: '**结论**：一切正常', status: 'ready' }],
    });

    render(<ChatView store={store} />);
    fireEvent.click(screen.getByRole('button', { name: '复制' }));
    expect(writeText).toHaveBeenCalledWith('**结论**：一切正常');
    await screen.findByRole('button', { name: '已复制' });
  });
});

describe('ChatView 透传 Composer 扩展 props（spec: chat-composer-extensions）', () => {
  it('attachments + onAttachmentsChange 透传到内建 Composer：渲染附件卡片', () => {
    const store = createStore();
    render(
      <ChatView
        store={store}
        attachments={[
          {
            id: 'att-1',
            name: 'report.pdf',
            mimeType: 'application/pdf',
            size: 1536,
          },
        ]}
        onAttachmentsChange={() => {}}
      />,
    );
    expect(screen.getByText('report.pdf')).toBeTruthy();
    expect(screen.getByText('1.5 KB')).toBeTruthy();
    expect(document.querySelector('[data-attachment-id="att-1"]')).toBeTruthy();
  });

  it('toolbarEnd 内容渲染在内建 Composer 工具栏区', () => {
    const store = createStore();
    render(
      <ChatView
        store={store}
        toolbarEnd={<span data-testid="chat-view-chip">模型 chip</span>}
      />,
    );
    const toolbar = document.querySelector('.pactor-chat-composer__toolbar')!;
    expect(toolbar).toBeTruthy();
    expect(screen.getByTestId('chat-view-chip')).toBeTruthy();
  });

  it('未传 onPlusMenu：内建 Composer 不渲染 "+" 按钮；传入后渲染', () => {
    const store = createStore();
    const { rerender } = render(<ChatView store={store} />);
    expect(screen.queryByRole('button', { name: '更多功能' })).toBeNull();

    rerender(<ChatView store={store} onPlusMenu={() => {}} />);
    expect(screen.getByRole('button', { name: '更多功能' })).toBeTruthy();
  });
});

describe('registerChatLayout（spec: chat-view / chat 布局注册）', () => {
  it('注册并解析：resolveLayout 命中 chat 布局（spec: 注册并解析）', () => {
    const registry = createShadcnLayoutRegistry();
    expect(() => resolveLayout(registry, 'chat')).not.toThrow();
    registerChatLayout(registry);
    const layout = resolveLayout(registry, 'chat');
    expect(layout).toBeTruthy();
    // 重复注册不覆盖、不抛错
    expect(() => registerChatLayout(registry)).not.toThrow();
  });

  it('chat 布局渲染 header 标题区 + ChatView 区', () => {
    const registry = createShadcnLayoutRegistry();
    registerChatLayout(registry);
    const Layout = resolveLayout(registry, 'chat');
    const store = createStore();
    store.appendMessage({
      id: 'u1',
      role: 'user',
      status: 'completed',
      parts: [{ type: 'text', content: '在布局里', status: 'ready' }],
    });

    render(
      <Layout title="风控助手">
        <ChatView store={store} />
      </Layout>,
    );
    expect(screen.getByText('风控助手')).toBeTruthy();
    expect(screen.getByText('在布局里')).toBeTruthy();
    expect(document.querySelector('.pactor-chat-layout')).toBeTruthy();
  });
});
