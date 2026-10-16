// @vitest-environment jsdom
import './setup.js';

import { Registry, type PageDsl } from '@pactor-app/core';
import { createPageRuntime, type ActionHandler } from '@pactor-app/runtime';
import { createComponentRegistry } from '@pactor-app/ui/components';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ChatServicesProvider,
  ConversationStore,
  createManualDriver,
  registerChatComponent,
  type ChatMessage,
  type ChatServices,
} from '../src/index.js';
import { registerChatComponents } from '../src/components/index.js';

afterEach(cleanup);

/**
 * chrome DSL 渲染层（spec: chat-chrome-dsl）机制测试：
 * DSL 路径渲染与 chat.* 动作闭环、类型缺失回退、宿主同名动作不被覆盖。
 * （无 renderer 的 fallback 路径由既有测试全覆盖。）
 */

function fullRegistry(): Registry<unknown> {
  const registry = createComponentRegistry();
  registerChatComponents(registry);
  registerChatComponent(registry);
  return registry;
}

function renderChatPage(
  body: PageDsl['body'],
  options?: {
    services?: ChatServices;
    components?: Registry<unknown>;
    actions?: Registry<ActionHandler>;
  },
) {
  const driver = createManualDriver();
  const runtime = createPageRuntime(
    { dsl: '1.0', page: { id: 'chat', title: '聊天页' }, body },
    {
      components: options?.components ?? fullRegistry(),
      ...(options?.actions ? { actions: options.actions } : {}),
    },
  );
  const view = render(
    <ChatServicesProvider value={options?.services ?? { transport: driver.transport }}>
      {runtime.render()}
    </ChatServicesProvider>,
  );
  return { runtime, view, driver };
}

function userMessage(id: string, text: string): ChatMessage {
  return { id, role: 'user', status: 'completed', parts: [{ type: 'text', content: text }] };
}

function assistantMessage(id: string, text: string): ChatMessage {
  return { id, role: 'assistant', status: 'completed', parts: [{ type: 'markdown', content: text }] };
}

describe('chrome DSL 渲染层（spec: chat-chrome-dsl）', () => {
  it('空态经宿主组件 DSL 组合渲染，建议点击经 chat.sendSuggestion 接回发送路径', async () => {
    const store = new ConversationStore();
    renderChatPage(
      {
        type: 'Chat',
        props: {
          greeting: '你好',
          suggestions: [{ label: '今天天气怎么样' }],
        },
      },
      { services: { transport: createManualDriver().transport, store } },
    );

    // DSL 路径标记：chrome 容器存在，建议经 ui Suggestion 组件渲染（chips 形态）
    expect(document.querySelector('.pactor-chat-chrome')).not.toBeNull();
    expect(document.querySelector('.pactor-chat-empty__suggestions')?.getAttribute('data-slot')).toBe('suggestion');
    const suggestion = screen.getByRole('button', { name: '今天天气怎么样' });
    expect(suggestion.getAttribute('data-slot')).toBe('suggestion-item');

    fireEvent.click(suggestion);

    // 与 Composer 发送同一条路径：user 消息进入 store，空态消失
    await vi.waitFor(() => {
      const messages = store.getMessages();
      expect(messages.some((m) => m.role === 'user')).toBe(true);
    });
    const texts = store.getMessages().map((m) =>
      m.parts.map((p) => ('content' in p ? p.content : '')).join(''),
    );
    expect(texts.join('\n')).toContain('今天天气怎么样');
  });

  it('ambient registry 缺所需组件类型时回退手写实现并告警', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const chatOnly = new Registry<unknown>('ComponentRegistry');
    registerChatComponent(chatOnly);
    renderChatPage(
      {
        type: 'Chat',
        props: { greeting: '你好', suggestions: [{ label: '建议一' }] },
      },
      { components: chatOnly },
    );

    // 回退：无 chrome 容器，ui Welcome + Suggestion 组合渲染且建议可点击
    expect(document.querySelector('.pactor-chat-chrome')).toBeNull();
    expect(
      document.querySelector('.pactor-chat-empty__suggestions [data-slot=suggestion-item]'),
    ).not.toBeNull();
    expect(warn.mock.calls.some((args) => String(args[0]).includes('组件类型缺失'))).toBe(
      true,
    );
    warn.mockRestore();
  });

  it('宿主已注册同名 chat.* 动作时不被覆盖（宿主实现优先）', async () => {
    const hostSend = vi.fn(() => ({ ok: true as const }));
    const actions = new Registry<ActionHandler>('ActionRegistry');
    actions.register('chat.sendSuggestion', hostSend);
    const store = new ConversationStore();
    renderChatPage(
      {
        type: 'Chat',
        props: { greeting: '你好', suggestions: [{ label: '建议一' }] },
      },
      { services: { transport: createManualDriver().transport, store }, actions },
    );

    fireEvent.click(screen.getByRole('button', { name: '建议一' }));

    await vi.waitFor(() => {
      expect(hostSend).toHaveBeenCalledTimes(1);
    });
    // chat 内建实现被宿主屏蔽：不触发发送
    expect(store.getMessages()).toHaveLength(0);
  });

  it('操作条经 DSL 渲染，自定义动作点击经 chat.messageAction 按实例寻址派发 callService', async () => {
    const store = new ConversationStore();
    store.appendMessage(userMessage('u1', '问题'));
    store.appendMessage(assistantMessage('a1', '回答'));
    const callService = vi.fn(() => Promise.resolve({ ok: true }));
    renderChatPage(
      {
        type: 'Chat',
        props: {
          messageActions: [
            { id: 'quote', label: '引用回复', icon: 'quote', service: 'quoteMessage' },
          ],
        },
      },
      {
        services: {
          transport: createManualDriver().transport,
          store,
          callService,
        },
      },
    );

    // DSL 路径：操作条内按钮经宿主组件渲染
    const bar = document.querySelector('.pactor-chat-message__actions')!;
    expect(bar.querySelector('.pactor-chat-chrome')).not.toBeNull();
    const button = bar.querySelector('button')!;
    fireEvent.click(button);

    await vi.waitFor(() => {
      expect(callService).toHaveBeenCalledTimes(1);
    });
    expect(callService).toHaveBeenCalledWith(
      'quoteMessage',
      expect.objectContaining({ actionId: 'quote' }),
    );
  });

  it('复制动作经 DSL 路径写剪贴板并呈现已复制反馈', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    const store = new ConversationStore();
    store.appendMessage(userMessage('u1', '问题'));
    store.appendMessage(assistantMessage('a1', '回答内容'));
    renderChatPage(
      { type: 'Chat', props: { messageActions: ['copy'] } },
      { services: { transport: createManualDriver().transport, store } },
    );

    const bar = document.querySelector('.pactor-chat-message__actions')!;
    fireEvent.click(bar.querySelector('button')!);

    await vi.waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('回答内容');
    });
    // 已复制反馈：copied 状态驱动片段重建（图标切换为 check）
    await vi.waitFor(() => {
      expect(bar.querySelector('.lucide-check')).not.toBeNull();
    });
  });
});
