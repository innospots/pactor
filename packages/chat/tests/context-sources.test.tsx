// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ChatView,
  ConversationStore,
  type ChatContextSource,
  type ChatInput,
  type ChatTransport,
} from '../src/index.js';

afterEach(cleanup);

function getTextarea(): HTMLTextAreaElement {
  return document.querySelector('.pactor-chat-composer textarea')!;
}

function sendText(text: string): void {
  fireEvent.change(getTextarea(), { target: { value: text } });
  fireEvent.keyDown(getTextarea(), { key: 'Enter' });
}

function createSpyTransport(): {
  transport: ChatTransport;
  send: ReturnType<typeof vi.fn>;
} {
  const send = vi.fn(
    (_input: ChatInput): AsyncIterable<never> =>
      (async function* () {
        // 空事件流：turn 立即完成
      })(),
  );
  return { transport: { send }, send };
}

const AGENTS: ChatContextSource[] = [
  {
    trigger: '@',
    label: '智能体',
    items: [
      { id: 'a1', label: '报表助手', data: { agentId: 'a1' } },
      { id: 'a2', label: '天气助手', data: { agentId: 'a2' } },
    ],
  },
];

function getChips(): string[] {
  return Array.from(
    document.querySelectorAll('.pactor-chat-context-chip__label'),
  ).map((element) => element.textContent ?? '');
}

describe('内建提及弹层（spec: chat-context-sources / 内建弹层交互与 chips 闭环）', () => {
  it('静态数据弹层：输入 @ 列出候选，按 query 大小写不敏感过滤', () => {
    const store = new ConversationStore();
    render(<ChatView store={store} contexts={AGENTS} />);

    fireEvent.change(getTextarea(), { target: { value: '@' } });
    expect(screen.getByText('报表助手')).toBeTruthy();
    expect(screen.getByText('天气助手')).toBeTruthy();

    fireEvent.change(getTextarea(), { target: { value: '@报表' } });
    expect(screen.getByText('报表助手')).toBeTruthy();
    expect(screen.queryByText('天气助手')).toBeNull();
  });

  it('删除 @ 语境时弹层关闭', () => {
    const store = new ConversationStore();
    render(<ChatView store={store} contexts={AGENTS} />);

    fireEvent.change(getTextarea(), { target: { value: '@报表' } });
    expect(screen.getByRole('listbox')).toBeTruthy();

    fireEvent.change(getTextarea(), { target: { value: '报表' } });
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('选中成 chip：Composer 上方出现 chip，onContextsChange 以含该项的数组被调用', () => {
    const store = new ConversationStore();
    const onContextsChange = vi.fn();
    render(
      <ChatView
        store={store}
        contexts={AGENTS}
        onContextsChange={onContextsChange}
      />,
    );

    fireEvent.change(getTextarea(), { target: { value: '@' } });
    fireEvent.click(screen.getByText('报表助手'));

    expect(getChips()).toEqual(['报表助手']);
    expect(onContextsChange).toHaveBeenCalledWith([
      expect.objectContaining({ id: 'a1', label: '报表助手', trigger: '@' }),
    ]);
    // 选中后弹层关闭
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('同 trigger 同 id 去重：重复选中忽略（决策 D5）', () => {
    const store = new ConversationStore();
    const onContextsChange = vi.fn();
    render(
      <ChatView
        store={store}
        contexts={AGENTS}
        onContextsChange={onContextsChange}
      />,
    );

    fireEvent.change(getTextarea(), { target: { value: '@' } });
    fireEvent.click(screen.getByText('报表助手'));
    // 再次打开并选中同一项
    fireEvent.change(getTextarea(), { target: { value: '@' } });
    fireEvent.click(screen.getByText('报表助手'));

    expect(getChips()).toEqual(['报表助手']);
    expect(onContextsChange).toHaveBeenCalledTimes(1);
  });

  it('chip 单独移除触发 onContextsChange', () => {
    const store = new ConversationStore();
    const onContextsChange = vi.fn();
    render(
      <ChatView
        store={store}
        contexts={AGENTS}
        onContextsChange={onContextsChange}
      />,
    );

    fireEvent.change(getTextarea(), { target: { value: '@' } });
    fireEvent.click(screen.getByText('报表助手'));
    fireEvent.click(screen.getByRole('button', { name: '移除上下文 报表助手' }));

    expect(getChips()).toEqual([]);
    expect(onContextsChange).toHaveBeenLastCalledWith([]);
  });

  it('无 trigger "@" 的 source 时输入 @ 不出现弹层', () => {
    const store = new ConversationStore();
    render(
      <ChatView
        store={store}
        contexts={[
          { trigger: '+', label: '上下文', items: [{ id: 'c1', label: '产品文档' }] },
        ]}
      />,
    );
    fireEvent.change(getTextarea(), { target: { value: '@abc' } });
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});

describe('内建 "+" 菜单（spec: chat-context-sources）', () => {
  const PLUS_SOURCES: ChatContextSource[] = [
    {
      trigger: '+',
      label: '上下文',
      items: [{ id: 'c1', label: '产品文档' }],
    },
  ];

  it('存在 trigger "+" 的 source 时渲染 "+" 入口，点击列出候选', () => {
    const store = new ConversationStore();
    render(<ChatView store={store} contexts={PLUS_SOURCES} />);

    fireEvent.click(screen.getByRole('button', { name: '更多功能' }));
    expect(screen.getByRole('listbox')).toBeTruthy();
    expect(screen.getByText('产品文档')).toBeTruthy();
  });

  it('选中 + 菜单候选追加为 chip（trigger 标记为 +）', () => {
    const store = new ConversationStore();
    const onContextsChange = vi.fn();
    render(
      <ChatView
        store={store}
        contexts={PLUS_SOURCES}
        onContextsChange={onContextsChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '更多功能' }));
    fireEvent.click(screen.getByText('产品文档'));

    expect(getChips()).toEqual(['产品文档']);
    expect(onContextsChange).toHaveBeenCalledWith([
      expect.objectContaining({ id: 'c1', trigger: '+' }),
    ]);
  });

  it('contexts 仅含 trigger "@" 时不渲染 "+" 按钮（spec: 无 + 配置无入口）', () => {
    const store = new ConversationStore();
    render(<ChatView store={store} contexts={AGENTS} />);
    expect(screen.queryByRole('button', { name: '更多功能' })).toBeNull();
  });
});

describe('service 引用解析（spec: chat-context-sources / contexts 声明式配置，决策 D1）', () => {
  const SERVICE_SOURCE: ChatContextSource[] = [
    { trigger: '@', label: '智能体', service: 'agents', params: { kind: 'report' } },
  ];

  it('service 源经 callService 解析，返回项渲染为候选（spec: service 引用经服务桥解析）', async () => {
    const store = new ConversationStore();
    const callService = vi.fn().mockResolvedValue([
      { id: 's1', label: '远程助手' },
    ]);
    render(
      <ChatView store={store} contexts={SERVICE_SOURCE} callService={callService} />,
    );

    fireEvent.change(getTextarea(), { target: { value: '@' } });
    expect(await screen.findByText('远程助手')).toBeTruthy();
    expect(callService).toHaveBeenCalledWith('agents', { kind: 'report' });
  });

  it('结果会话级缓存：弹层重开不重复请求', async () => {
    const store = new ConversationStore();
    const callService = vi.fn().mockResolvedValue([
      { id: 's1', label: '远程助手' },
    ]);
    render(
      <ChatView store={store} contexts={SERVICE_SOURCE} callService={callService} />,
    );

    fireEvent.change(getTextarea(), { target: { value: '@' } });
    expect(await screen.findByText('远程助手')).toBeTruthy();

    // Escape 关闭后重新打开
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
    fireEvent.change(getTextarea(), { target: { value: '@远' } });
    expect(await screen.findByText('远程助手')).toBeTruthy();

    expect(callService).toHaveBeenCalledTimes(1);
  });

  it('callService 未注入时弹层渲染内联错误提示，不抛错（spec: 服务桥缺失受控降级）', async () => {
    const store = new ConversationStore();
    render(<ChatView store={store} contexts={SERVICE_SOURCE} />);

    fireEvent.change(getTextarea(), { target: { value: '@' } });
    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('callService');
  });
});

describe('调用方回调优先（spec: chat-context-sources / 调用方回调优先）', () => {
  it('注入 onMentionTrigger 时内建提及弹层不出现（spec: 内建弹层兜底 / 提及触发）', () => {
    const store = new ConversationStore();
    const onMentionTrigger = vi.fn();
    render(
      <ChatView
        store={store}
        contexts={AGENTS}
        onMentionTrigger={onMentionTrigger}
      />,
    );

    fireEvent.change(getTextarea(), { target: { value: '@abc' } });
    expect(onMentionTrigger).toHaveBeenCalled();
    const calls = onMentionTrigger.mock.calls;
    expect(calls[calls.length - 1]![0]).toBe('abc');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('注入 onPlusMenu 时内建 + 菜单不启用', () => {
    const store = new ConversationStore();
    const onPlusMenu = vi.fn();
    render(
      <ChatView
        store={store}
        contexts={[
          { trigger: '+', label: '上下文', items: [{ id: 'c1', label: '产品文档' }] },
        ]}
        onPlusMenu={onPlusMenu}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '更多功能' }));
    expect(onPlusMenu).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});

describe('chips 进入 transport 输入（spec: chat-context-sources / chips 进入 transport 输入）', () => {
  it('发送时 chips 作为 input.contexts（含 data），不拼接进 text（spec: transport 收到上下文）', async () => {
    const store = new ConversationStore();
    const { transport, send } = createSpyTransport();
    render(<ChatView store={store} transport={transport} contexts={AGENTS} />);

    fireEvent.change(getTextarea(), { target: { value: '@' } });
    fireEvent.click(screen.getByText('报表助手'));
    sendText('帮我出个月报');

    await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(1));
    const input = send.mock.calls[0]![0] as ChatInput;
    expect(input.text).toBe('帮我出个月报');
    expect(input.contexts).toEqual([
      {
        id: 'a1',
        label: '报表助手',
        trigger: '@',
        data: { agentId: 'a1' },
      },
    ]);
  });

  it('发送完成后 chips 清空并触发 onContextsChange([])（spec: 发送后清空）', async () => {
    const store = new ConversationStore();
    const { transport, send } = createSpyTransport();
    const onContextsChange = vi.fn();
    render(
      <ChatView
        store={store}
        transport={transport}
        contexts={AGENTS}
        onContextsChange={onContextsChange}
      />,
    );

    fireEvent.change(getTextarea(), { target: { value: '@' } });
    fireEvent.click(screen.getByText('报表助手'));
    expect(getChips()).toEqual(['报表助手']);

    sendText('发送');
    await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(1));
    expect(getChips()).toEqual([]);
    expect(onContextsChange).toHaveBeenLastCalledWith([]);
  });

  it('无 chips 时 input.contexts 为 undefined', async () => {
    const store = new ConversationStore();
    const { transport, send } = createSpyTransport();
    render(<ChatView store={store} transport={transport} contexts={AGENTS} />);

    sendText('无上下文');
    await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(1));
    expect((send.mock.calls[0]![0] as ChatInput).contexts).toBeUndefined();
  });
});
