// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  Chat,
  ChatServicesProvider,
  ChatView,
  ConversationStore,
  createChatWorkspace,
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

/** spy transport：send 记录入参并立即结束事件流 */
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

const MODELS = [
  { value: 'demo', label: 'demo-mock' },
  { value: 'pro', label: 'pro-max' },
];

describe('内建模型 chip（spec: chat-model-selector / 模型列表配置与内建 chip）', () => {
  it('配置 models 渲染 chip，显示当前模型 label（spec: 配置模型渲染 chip）', () => {
    const store = new ConversationStore();
    render(<ChatView store={store} models={MODELS} />);
    const chip = screen.getByRole('button', { name: '选择模型' });
    expect(chip.textContent).toContain('demo-mock');
  });

  it('models 缺省 / 空数组时不渲染 chip（spec: 未配置不渲染）', () => {
    const store = new ConversationStore();
    const { rerender } = render(<ChatView store={store} />);
    expect(screen.queryByRole('button', { name: '选择模型' })).toBeNull();

    rerender(<ChatView store={store} models={[]} />);
    expect(screen.queryByRole('button', { name: '选择模型' })).toBeNull();
  });

  it('chip 渲染在 toolbarEnd 槽内容之前（spec: 两者共存，chip 在前）', () => {
    const store = new ConversationStore();
    render(
      <ChatView
        store={store}
        models={MODELS}
        toolbarEnd={<span data-testid="end-slot">末尾槽</span>}
      />,
    );
    const chip = screen.getByRole('button', { name: '选择模型' });
    const endSlot = screen.getByTestId('end-slot');
    expect(
      chip.compareDocumentPosition(endSlot) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('点击 chip 打开弹层列出全部模型，选中项带选中标记', () => {
    const store = new ConversationStore();
    render(<ChatView store={store} models={MODELS} />);
    fireEvent.click(screen.getByRole('button', { name: '选择模型' }));

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(2);
    expect(options[0]!.getAttribute('aria-selected')).toBe('true');
    expect(options[1]!.getAttribute('aria-selected')).toBe('false');
    expect(
      options[0]!.querySelector('.pactor-chat-popover__item-check'),
    ).toBeTruthy();
    expect(
      options[1]!.querySelector('.pactor-chat-popover__item-check'),
    ).toBeNull();
  });
});

describe('受控与非受控选中态（spec: chat-model-selector，决策 D5）', () => {
  it('非受控：仅 models 时缺省 models[0]，弹层选择后 chip 自持更新', () => {
    const store = new ConversationStore();
    render(<ChatView store={store} models={MODELS} />);
    expect(
      screen.getByRole('button', { name: '选择模型' }).textContent,
    ).toContain('demo-mock');

    fireEvent.click(screen.getByRole('button', { name: '选择模型' }));
    fireEvent.click(screen.getByText('pro-max'));
    expect(
      screen.getByRole('button', { name: '选择模型' }).textContent,
    ).toContain('pro-max');
  });

  it('受控：model + onModelChange 以 props 为准，选择仅触发回调', () => {
    const store = new ConversationStore();
    const onModelChange = vi.fn();
    const { rerender } = render(
      <ChatView
        store={store}
        models={MODELS}
        model="demo"
        onModelChange={onModelChange}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '选择模型' }));
    fireEvent.click(screen.getByText('pro-max'));
    expect(onModelChange).toHaveBeenCalledWith('pro');
    // 受控：props 未变，chip 仍显示旧值
    expect(
      screen.getByRole('button', { name: '选择模型' }).textContent,
    ).toContain('demo-mock');

    // 宿主闭环更新 props 后 chip 跟随
    rerender(
      <ChatView
        store={store}
        models={MODELS}
        model="pro"
        onModelChange={onModelChange}
      />,
    );
    expect(
      screen.getByRole('button', { name: '选择模型' }).textContent,
    ).toContain('pro-max');
  });
});

describe('选中模型进入 transport 输入（spec: chat-model-selector / 选中模型进入 transport 输入）', () => {
  it('发送时当前模型 value 作为 input.model 传入（spec: transport 收到模型）', async () => {
    const store = new ConversationStore();
    const { transport, send } = createSpyTransport();
    render(<ChatView store={store} transport={transport} models={MODELS} />);

    // 切换为 pro 后发送
    fireEvent.click(screen.getByRole('button', { name: '选择模型' }));
    fireEvent.click(screen.getByText('pro-max'));
    sendText('分析一下');

    await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(1));
    const input = send.mock.calls[0]![0] as ChatInput;
    expect(input.model).toBe('pro');
    expect(input.text).toBe('分析一下');
  });

  it('未配置 models 时 input.model 为 undefined', async () => {
    const store = new ConversationStore();
    const { transport, send } = createSpyTransport();
    render(<ChatView store={store} transport={transport} />);

    sendText('无模型');
    await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(1));
    expect((send.mock.calls[0]![0] as ChatInput).model).toBeUndefined();
  });
});

describe('模型选择位置配置 modelPlacement（spec: chat-model-selector / 模型选择位置配置，决策 D2）', () => {
  it('header 位：chip 渲染在工作区头部左端（title 之前），Composer 无 chip', () => {
    const { transport } = createSpyTransport();
    render(
      <ChatServicesProvider value={{ transport }}>
        <Chat title="分析台" models={MODELS} modelPlacement="header" />
      </ChatServicesProvider>,
    );
    const header = document.querySelector('.pactor-chat-workspace__header')!;
    expect(header).toBeTruthy();
    const chip = header.querySelector('.pactor-chat-model-chip')!;
    expect(chip).toBeTruthy();
    // chip 在 title 之前（左端组首子节点）
    const leftGroup = header.querySelector(
      '.pactor-chat-workspace__header-left',
    )!;
    expect(leftGroup.firstElementChild).toBe(chip);
    const title = header.querySelector('.pactor-chat-workspace__title')!;
    expect(
      chip.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    // Composer 工具栏不再渲染模型 chip（不重复）
    expect(
      document.querySelector('.pactor-chat-composer .pactor-chat-model-chip'),
    ).toBeNull();
  });

  it('仅 models + header 位也渲染极简头部（spec: header 极简形态）', () => {
    const { transport } = createSpyTransport();
    const ChatWorkspace = createChatWorkspace({ transport });
    render(<ChatWorkspace models={MODELS} modelPlacement="header" />);
    const header = document.querySelector('.pactor-chat-workspace__header')!;
    // 未配置 title/headerExtra/headerActions，头部仍渲染且仅有模型 chip
    expect(header).toBeTruthy();
    expect(header.querySelector('.pactor-chat-model-chip')).toBeTruthy();
    expect(header.querySelector('.pactor-chat-workspace__header-actions')).toBeNull();
    expect(
      document.querySelector('.pactor-chat-composer .pactor-chat-model-chip'),
    ).toBeNull();
  });

  it('缺省 composer 位不变：chip 仍渲染在 Composer 工具栏（spec: 缺省位置不变）', () => {
    const { transport } = createSpyTransport();
    render(
      <ChatServicesProvider value={{ transport }}>
        <Chat title="分析台" models={MODELS} />
      </ChatServicesProvider>,
    );
    expect(
      document.querySelector('.pactor-chat-composer .pactor-chat-model-chip'),
    ).toBeTruthy();
    expect(
      document.querySelector('.pactor-chat-workspace__header .pactor-chat-model-chip'),
    ).toBeNull();
    expect(
      document.querySelector('.pactor-chat-workspace__header-left'),
    ).toBeNull();
  });

  it('非受控：header 位切换模型后 chip 自持更新（组合层状态两位置共享）', () => {
    const { transport } = createSpyTransport();
    render(
      <ChatServicesProvider value={{ transport }}>
        <Chat models={MODELS} modelPlacement="header" />
      </ChatServicesProvider>,
    );
    const chip = screen.getByRole('button', { name: '选择模型' });
    expect(chip.textContent).toContain('demo-mock');

    fireEvent.click(chip);
    fireEvent.click(screen.getByText('pro-max'));
    expect(
      screen.getByRole('button', { name: '选择模型' }).textContent,
    ).toContain('pro-max');
  });

  it('受控：header 位切换触发 onModelChange，后续发送携带新 model（spec: 位置不影响选中语义）', async () => {
    const { transport, send } = createSpyTransport();
    const onModelChange = vi.fn();
    const { rerender } = render(
      <ChatServicesProvider value={{ transport }}>
        <Chat
          models={MODELS}
          model="demo"
          onModelChange={onModelChange}
          modelPlacement="header"
        />
      </ChatServicesProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: '选择模型' }));
    fireEvent.click(screen.getByText('pro-max'));
    expect(onModelChange).toHaveBeenCalledWith('pro');

    // 宿主闭环更新 props 后发送，transport 输入携带新 model
    rerender(
      <ChatServicesProvider value={{ transport }}>
        <Chat
          models={MODELS}
          model="pro"
          onModelChange={onModelChange}
          modelPlacement="header"
        />
      </ChatServicesProvider>,
    );
    sendText('分析一下');
    await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(1));
    const input = send.mock.calls[0]![0] as ChatInput;
    expect(input.model).toBe('pro');
  });
});
