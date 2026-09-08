// @vitest-environment jsdom
import './setup.js';

import { Registry, type PageDsl } from '@pactor-app/core';
import { createPageRuntime } from '@pactor-app/runtime';
import { createComponentRegistry } from '@pactor-app/ui/components';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ChatServicesProvider,
  ConversationStore,
  createManualDriver,
  registerChatComponent,
  type ChatServices,
} from '../src/index.js';

afterEach(cleanup);

/**
 * Composer DSL 呈现路径（spec: chat-composer-on-chatinput / chat-view
 * Composer）：ChatInput 组合渲染、非受控 + 冒泡同步、
 * chat.composerSubmit 发送桥接、mention 冒泡检测、附件冒泡承接、
 * 发送/停止状态机与工具栏槽位。（fallback 路径由 composer.test.tsx
 * 等既有测试覆盖。）
 */

function fullRegistry(): Registry<unknown> {
  const registry = createComponentRegistry();
  registerChatComponent(registry);
  return registry;
}

function renderChatPage(body: PageDsl['body'], services?: ChatServices) {
  const driver = createManualDriver();
  const runtime = createPageRuntime(
    { dsl: '1.0', page: { id: 'chat', title: '聊天页' }, body },
    { components: fullRegistry() },
  );
  render(
    <ChatServicesProvider value={services ?? { transport: driver.transport }}>
      {runtime.render()}
    </ChatServicesProvider>,
  );
  return { runtime, driver };
}

function getInput(): HTMLTextAreaElement {
  return document.querySelector(
    '.pactor-chat-composer--dsl [data-slot=chat-input] textarea',
  )! as HTMLTextAreaElement;
}

describe('Composer DSL 呈现路径（spec: chat-composer-on-chatinput）', () => {
  it('经 ChatInput 组合渲染：dsl 容器 + chrome 容器 + 工具栏（hideSend，发送钮在工具栏右端）', () => {
    const store = new ConversationStore();
    renderChatPage(
      { type: 'Chat', props: {} },
      { transport: createManualDriver().transport, store },
    );

    expect(document.querySelector('.pactor-chat-composer--dsl')).not.toBeNull();
    expect(
      document.querySelector('.pactor-chat-composer--dsl .pactor-chat-chrome'),
    ).not.toBeNull();
    expect(document.querySelector('[data-slot=chat-input]')).not.toBeNull();
    // 发送钮在工具栏行内（ChatComposerToolbarEnd），行内不再有 textarea 旁行内钮
    const send = screen.getByRole('button', { name: '发送' });
    expect(send.className).toContain('pactor-chat-composer__button');
  });

  it('输入冒泡同步（发送钮禁用态）+ Enter 经 chat.composerSubmit 发送，store 收到 user 消息', async () => {
    const store = new ConversationStore();
    renderChatPage(
      { type: 'Chat', props: {} },
      { transport: createManualDriver().transport, store },
    );

    const send = screen.getByRole('button', { name: '发送' });
    expect(send).toHaveProperty('disabled', true);

    fireEvent.change(getInput(), { target: { value: '你好' } });
    await vi.waitFor(() => {
      expect(send).toHaveProperty('disabled', false);
    });

    fireEvent.keyDown(getInput(), { key: 'Enter' });
    await vi.waitFor(() => {
      const messages = store.getMessages();
      expect(messages.some((m) => m.role === 'user')).toBe(true);
    });
    const texts = store.getMessages().map((m) =>
      m.parts.map((p) => ('content' in p ? p.content : '')).join(''),
    );
    expect(texts.join('\n')).toContain('你好');
  });

  it('@ 提及经冒泡检测打开内建弹层（callService 解析候选）', async () => {
    const store = new ConversationStore();
    const callService = vi.fn(() =>
      Promise.resolve([{ id: 'a1', label: '小助手', data: {} }]),
    );
    renderChatPage(
      {
        type: 'Chat',
        props: {
          contexts: [{ trigger: '@', label: '智能体', service: 'agents' }],
        },
      },
      { transport: createManualDriver().transport, store, callService },
    );

    fireEvent.change(getInput(), { target: { value: '@' } });
    await screen.findByRole('listbox');
    await screen.findByText('小助手');
  });

  it('粘贴文件经冒泡承接给 onAttachFiles', () => {
    const store = new ConversationStore();
    const onAttachFiles = vi.fn(() => Promise.resolve([]));
    renderChatPage(
      { type: 'Chat', props: {} },
      { transport: createManualDriver().transport, store, onAttachFiles },
    );

    const file = new File(['x'], 'a.png', { type: 'image/png' });
    fireEvent.paste(getInput(), { clipboardData: { files: [file] } });
    expect(onAttachFiles).toHaveBeenCalledTimes(1);
  });

  it('流式中工具栏右端按钮切换为停止（同一状态机语义）', async () => {
    const store = new ConversationStore();
    const { driver } = renderChatPage(
      { type: 'Chat', props: {} },
      { transport: undefined, store } as never,
    );
    void driver;
    // 直接注入一条 streaming assistant 消息
    store.appendMessage({
      id: 'u1',
      role: 'user',
      status: 'completed',
      parts: [{ type: 'text', content: '问' }],
    });
    store.appendMessage({
      id: 'a1',
      role: 'assistant',
      status: 'streaming',
      parts: [],
    });

    await screen.findByRole('button', { name: '停止生成' });
  });

  it('模型选择渲染在发送钮之前（toolbarEnd 槽内容保持在其前）', () => {
    const store = new ConversationStore();
    renderChatPage(
      {
        type: 'Chat',
        props: { models: [{ value: 'demo', label: 'demo-mock' }] },
      },
      { transport: createManualDriver().transport, store },
    );

    // DSL 路径经 ui Select 承载（spec: chat-on-ui-components）
    const select = document.querySelector(
      '[data-slot=chat-input] .pactor-chat-model-select',
    )!;
    expect(select).not.toBeNull();
    const send = screen.getByRole('button', { name: '发送' });
    expect(
      select.compareDocumentPosition(send) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
