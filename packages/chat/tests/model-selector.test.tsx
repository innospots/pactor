// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ChatView,
  ConversationStore,
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
