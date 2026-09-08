// @vitest-environment jsdom
import './setup.js';

import { Registry, type PageDsl } from '@pactor-app/core';
import { createPageRuntime } from '@pactor-app/runtime';
import { createComponentRegistry } from '@pactor-app/ui/components';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import {
  ChatServicesProvider,
  ChatView,
  ConversationStore,
  createManualDriver,
  registerChatComponent,
  type ChatServices,
} from '../src/index.js';

afterEach(cleanup);

/**
 * Composer 槽位（spec: chat-composer-slots / Composer footer 槽 +
 * chat-dsl-component / Composer 槽配置）：
 * composerFooter 双路径渲染、Chat 三槽 DSL 声明、服务槽与 props 槽合并。
 */

function fullRegistry(): Registry<unknown> {
  const registry = createComponentRegistry();
  registerChatComponent(registry);
  return registry;
}

function renderChatPage(
  dsl: Omit<PageDsl, 'dsl'>,
  services?: ChatServices,
) {
  const driver = createManualDriver();
  const runtime = createPageRuntime(
    { dsl: '1.0', ...dsl },
    { components: fullRegistry() },
  );
  const view = render(
    <ChatServicesProvider value={services ?? { transport: driver.transport }}>
      {runtime.render()}
    </ChatServicesProvider>,
  );
  return { runtime, view, driver };
}

describe('Composer 槽位（spec: chat-composer-slots）', () => {
  it('fallback 路径：composerFooter 渲染在工具栏下方；未提供不渲染', () => {
    const store = new ConversationStore();
    const { unmount } = render(
      <ChatView
        store={store}
        composerFooter={<span>工作空间：默认</span>}
      />,
    );
    const footer = document.querySelector('.pactor-chat-composer__footer');
    expect(footer).not.toBeNull();
    expect(footer!.textContent).toContain('工作空间：默认');
    unmount();

    render(<ChatView store={new ConversationStore()} />);
    expect(
      document.querySelector('.pactor-chat-composer__footer'),
    ).toBeNull();
  });

  it('DSL 声明三槽：toolbarStart / toolbarEnd / composerFooter 按位渲染（DSL 路径）', () => {
    renderChatPage({
      page: { id: 'chat', title: '聊天页' },
      body: {
        type: 'Chat',
        props: {
          toolbarStart: {
            type: 'Button',
            props: { text: '左槽钮', variant: 'text', size: 'small' },
          },
          toolbarEnd: {
            type: 'Button',
            props: { text: '右槽钮', variant: 'text', size: 'small' },
          },
          composerFooter: {
            type: 'Text',
            props: { text: 'footer 区' },
          },
        },
      },
    });

    const start = screen.getByRole('button', { name: '左槽钮' });
    const end = screen.getByRole('button', { name: '右槽钮' });
    const send = screen.getByRole('button', { name: '发送' });
    const footer = screen.getByText('footer 区');
    // 左槽在右槽之前；右槽在发送钮之前（toolbarEnd 语义：发送钮之前）
    expect(
      start.compareDocumentPosition(end) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      end.compareDocumentPosition(send) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    // footer 在工具栏之后（ChatInput footer 槽，带分隔线容器）
    expect(
      send.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      document.querySelector('[data-slot=chat-input] > .border-t'),
    ).not.toBeNull();
  });

  it('未提供 composerFooter 时 DSL 路径不渲染 footer 区（零渲染承诺）', () => {
    renderChatPage({
      page: { id: 'chat', title: '聊天页' },
      body: { type: 'Chat', props: {} },
    });
    expect(
      document.querySelector('[data-slot=chat-input] > .border-t'),
    ).toBeNull();
  });

  it('hideToolbar：fallback 路径工具栏行与发送钮不渲染，footer 槽保留', () => {
    render(
      <ChatView
        store={new ConversationStore()}
        onAttachFiles={() => {}}
        hideToolbar
        composerFooter={<span>footer 区</span>}
      />,
    );
    // 配置了 onAttachFiles 本会出现工具栏行；hideToolbar 整体抑制
    expect(document.querySelector('.pactor-chat-composer__toolbar')).toBeNull();
    expect(screen.queryByRole('button', { name: '发送' })).toBeNull();
    expect(
      document.querySelector('.pactor-chat-composer__footer'),
    ).not.toBeNull();
  });

  it('hideToolbar：DSL 路径工具栏行零渲染（发送钮隐藏），footer 槽保留', () => {
    renderChatPage({
      page: { id: 'chat', title: '聊天页' },
      body: {
        type: 'Chat',
        props: {
          hideToolbar: true,
          composerFooter: {
            type: 'Text',
            props: { text: 'footer 区' },
          },
        },
      },
    });
    expect(
      document.querySelector('[data-slot=chat-input] > .flex.items-center'),
    ).toBeNull();
    expect(screen.queryByRole('button', { name: '发送' })).toBeNull();
    expect(
      document.querySelector('[data-slot=chat-input] > .border-t'),
    ).not.toBeNull();
  });

  it('composerBottom：fallback 路径渲染在 Composer 之外正下方；未提供不渲染', () => {
    const store = new ConversationStore();
    store.appendMessage({
      id: 'u1',
      role: 'user',
      status: 'completed',
      parts: [{ type: 'text', content: '你好', status: 'ready' }],
    });
    const { unmount } = render(
      <ChatView
        store={store}
        composerBottom={<span>内容由 AI 生成，仅供参考</span>}
      />,
    );
    const bottom = document.querySelector('.pactor-chat-view__composer-bottom');
    expect(bottom).not.toBeNull();
    expect(bottom!.textContent).toContain('内容由 AI 生成，仅供参考');
    // 位于 Composer（fallback 容器）之后
    const composer = document.querySelector('.pactor-chat-composer')!;
    expect(
      composer.compareDocumentPosition(bottom!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    unmount();

    render(<ChatView store={new ConversationStore()} />);
    expect(
      document.querySelector('.pactor-chat-view__composer-bottom'),
    ).toBeNull();
  });

  it('composerBottom：DSL 声明渲染（钉底 / 空态两态一致），服务槽与 props 槽并存时服务槽在先', () => {
    renderChatPage(
      {
        page: { id: 'chat', title: '聊天页' },
        body: {
          type: 'Chat',
          props: {
            composerBottom: {
              type: 'Text',
              props: { text: 'props 槽' },
            },
          },
        },
      },
      {
        transport: createManualDriver().transport,
        composerBottom: <span>服务槽</span>,
      },
    );

    const bottom = document.querySelector(
      '.pactor-chat-view__composer-bottom',
    )!;
    expect(bottom).not.toBeNull();
    expect(bottom.textContent).toContain('服务槽');
    expect(bottom.textContent).toContain('props 槽');
    const service = screen.getByText('服务槽');
    const prop = screen.getByText('props 槽');
    expect(
      service.compareDocumentPosition(prop) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    // 空态（无消息）同样渲染；位于 ChatInput 容器之后
    const chatInput = document.querySelector('[data-slot=chat-input]')!;
    expect(
      chatInput.compareDocumentPosition(bottom) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('服务槽与 props 槽并存：服务槽在先', () => {
    renderChatPage(
      {
        page: { id: 'chat', title: '聊天页' },
        body: {
          type: 'Chat',
          props: {
            composerFooter: {
              type: 'Text',
              props: { text: 'props 槽' },
            },
          },
        },
      },
      {
        transport: createManualDriver().transport,
        composerFooter: <span>服务槽</span>,
      },
    );

    const footer = document.querySelector(
      '[data-slot=chat-input] > .border-t',
    )!;
    expect(footer.textContent).toContain('服务槽');
    expect(footer.textContent).toContain('props 槽');
    const service = screen.getByText('服务槽');
    const prop = screen.getByText('props 槽');
    expect(
      service.compareDocumentPosition(prop) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
