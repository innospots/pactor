// @vitest-environment jsdom
import './setup.js';

import { Registry, type PageDsl } from '@pactor-app/core';
import { createPageRuntime } from '@pactor-app/runtime';
import { createShadcnComponentRegistry } from '@pactor-app/ui/components';
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
  const registry = createShadcnComponentRegistry();
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
