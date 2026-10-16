// @vitest-environment jsdom
/**
 * ChatInput 组件契约（spec: shadcn-extended-components / ChatInput）：
 * 两层嵌套结构、受控值与 onChange/onSubmit 语义（Enter / Shift+Enter /
 * IME / 空白禁发 / 非受控清空）、toolbarStart / toolbarEnd / footer
 * 槽位渲染、hideSend。
 */
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { expectEventState, renderDsl } from './helpers.js';

function getTextarea(): HTMLTextAreaElement {
  return document.querySelector('[data-slot=chat-input] textarea')!;
}

describe('ChatInput（spec: shadcn-extended-components / ChatInput 聊天输入组件）', () => {
  it('注册并渲染结构：圆角容器 + 输入区 + 工具栏行（含内建发送钮），placeholder 生效', () => {
    const { container } = renderDsl({
      type: 'ChatInput',
      props: { placeholder: '今天帮你做些什么？' },
    });

    expect(container.querySelector('[data-slot=chat-input]')).not.toBeNull();
    expect(screen.getByPlaceholderText('今天帮你做些什么？')).not.toBeNull();
    expect(screen.getByRole('button', { name: '发送' })).not.toBeNull();
  });

  it('onChange 传出 string；受控 value 显示取自 props', async () => {
    const { context } = renderDsl({
      type: 'ChatInput',
      props: { value: '${state.draft}' },
      events: {
        onChange: { action: 'setState', params: { draft: '${event}' } },
      },
    });

    fireEvent.change(getTextarea(), { target: { value: '你好' } });
    await expectEventState(context, 'draft', '你好');
    // 受控闭环：setState 回写后显示新值
    await vi.waitFor(() => {
      expect(getTextarea().value).toBe('你好');
    });
  });

  it('Enter 触发 onSubmit 且非受控发送后清空；Shift+Enter 换行不发送', async () => {
    const { context } = renderDsl({
      type: 'ChatInput',
      events: {
        onSubmit: { action: 'setState', params: { sent: '${event}' } },
      },
    });

    fireEvent.change(getTextarea(), { target: { value: '第一行' } });
    fireEvent.keyDown(getTextarea(), { key: 'Enter', shiftKey: true });
    expect(context.state.get('sent')).toBeUndefined();

    fireEvent.keyDown(getTextarea(), { key: 'Enter' });
    await expectEventState(context, 'sent', '第一行');
    await vi.waitFor(() => {
      expect(getTextarea().value).toBe('');
    });
  });

  it('IME 合成进行中 Enter 不发送', () => {
    const { context } = renderDsl({
      type: 'ChatInput',
      events: {
        onSubmit: { action: 'setState', params: { sent: '${event}' } },
      },
    });

    fireEvent.change(getTextarea(), { target: { value: 'nihao' } });
    fireEvent.compositionStart(getTextarea());
    fireEvent.keyDown(getTextarea(), { key: 'Enter', isComposing: true });
    expect(context.state.get('sent')).toBeUndefined();
    fireEvent.compositionEnd(getTextarea());
    fireEvent.keyDown(getTextarea(), { key: 'Enter' });
  });

  it('空文本禁发：发送钮禁用，Enter 不触发 onSubmit', () => {
    const { context } = renderDsl({
      type: 'ChatInput',
      events: {
        onSubmit: { action: 'setState', params: { sent: '${event}' } },
      },
    });

    expect(screen.getByRole('button', { name: '发送' })).toHaveProperty('disabled', true);
    fireEvent.change(getTextarea(), { target: { value: '   ' } });
    fireEvent.keyDown(getTextarea(), { key: 'Enter' });
    expect(context.state.get('sent')).toBeUndefined();
  });

  it('点击发送钮触发 onSubmit', async () => {
    const { context } = renderDsl({
      type: 'ChatInput',
      events: {
        onSubmit: { action: 'setState', params: { sent: '${event}' } },
      },
    });

    fireEvent.change(getTextarea(), { target: { value: '按钮发送' } });
    fireEvent.click(screen.getByRole('button', { name: '发送' }));
    await expectEventState(context, 'sent', '按钮发送');
  });

  it('toolbarStart / toolbarEnd / footer 槽位按位渲染', () => {
    const { container } = renderDsl({
      type: 'ChatInput',
      props: {
        toolbarStart: { type: 'Button', props: { text: '左槽', variant: 'text' } },
        toolbarEnd: { type: 'Button', props: { text: '右槽', variant: 'text' } },
        footer: { type: 'Text', props: { text: '底部区' } },
      },
    });

    const start = screen.getByRole('button', { name: '左槽' });
    const end = screen.getByRole('button', { name: '右槽' });
    const send = screen.getByRole('button', { name: '发送' });
    // 左槽在工具栏行最左，右槽在发送钮之前
    expect(
      start.compareDocumentPosition(end) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      end.compareDocumentPosition(send) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    // footer 在工具栏之后且带分隔线容器
    const footer = screen.getByText('底部区');
    expect(
      send.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(container.querySelector('[data-slot=chat-input] > .border-t')).not.toBeNull();
  });

  it('hideSend 省略内建发送钮', () => {
    renderDsl({
      type: 'ChatInput',
      props: { hideSend: true },
    });
    expect(screen.queryByRole('button', { name: '发送' })).toBeNull();
  });

  it('hideSend 且无工具栏槽时工具栏行整体零渲染；有槽时仍渲染', () => {
    const { container } = renderDsl({
      type: 'ChatInput',
      props: { hideSend: true },
    });
    expect(
      container.querySelector('[data-slot=chat-input] > .flex.items-center'),
    ).toBeNull();

    const { container: slotted } = renderDsl({
      type: 'ChatInput',
      props: {
        hideSend: true,
        toolbarEnd: { type: 'Button', props: { text: '右槽', variant: 'text' } },
      },
    });
    expect(
      slotted.querySelector('[data-slot=chat-input] > .flex.items-center'),
    ).not.toBeNull();
  });

  it('header 槽渲染在 textarea 上方；未提供不渲染', () => {
    const { container } = renderDsl({
      type: 'ChatInput',
      props: {
        header: { type: 'Text', props: { text: '顶部区' } },
      },
    });

    const header = screen.getByText('顶部区');
    const textarea = getTextarea();
    expect(
      header.compareDocumentPosition(textarea) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    const { container: bare } = renderDsl({ type: 'ChatInput' });
    expect(bare.querySelector('[data-slot=chat-input] > .px-3.pt-3')).toBeNull();
    expect(container.querySelector('[data-slot=chat-input] > .px-3.pt-3')).not.toBeNull();
  });

  it('受控模式 onSubmit 后组件不自行清空', async () => {
    const { context } = renderDsl({
      type: 'ChatInput',
      props: { value: '${state.draft}' },
      events: {
        onChange: { action: 'setState', params: { draft: '${event}' } },
        onSubmit: { action: 'setState', params: { sent: '${event}' } },
      },
    });

    fireEvent.change(getTextarea(), { target: { value: '受控文本' } });
    await vi.waitFor(() => {
      expect(getTextarea().value).toBe('受控文本');
    });
    fireEvent.keyDown(getTextarea(), { key: 'Enter' });
    await expectEventState(context, 'sent', '受控文本');
    // 受控：显示值仍取自 props（draft 未变），组件不清空
    expect(getTextarea().value).toBe('受控文本');
  });

  it('streaming 时发送钮切换为停止钮：空文本也可点击，点击经 onStop 传出且不触发 onSubmit、不清空输入', async () => {
    const { context } = renderDsl({
      type: 'ChatInput',
      props: { streaming: true },
      events: {
        onStop: { action: 'setState', params: { stopped: true } },
        onSubmit: { action: 'setState', params: { sent: '${event}' } },
      },
    });

    // 空文本下停止钮仍可用（发送语义被抑制）
    const stopButton = screen.getByRole('button', { name: '停止生成' }) as HTMLButtonElement;
    expect(stopButton.disabled).toBe(false);
    fireEvent.click(stopButton);
    await expectEventState(context, 'stopped', true);
    expect(context.state.get('sent')).toBeUndefined();

    // 输入保留：streaming 不阻断编辑，Enter 发送语义不变
    fireEvent.change(getTextarea(), { target: { value: '继续输入' } });
    fireEvent.keyDown(getTextarea(), { key: 'Enter' });
    await expectEventState(context, 'sent', '继续输入');
  });
});
