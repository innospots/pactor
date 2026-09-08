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
 * chrome 迁移批次 2（spec: chat-on-ui-components）DSL 路径测试：
 * 侧栏菜单（ui Menu）、模型选择（ui Select）、header 操作组、
 * 产出物面板标题栏。（fallback 路径由既有测试覆盖。）
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

describe('chat-on-ui-components（spec: chat-on-ui-components）', () => {
  it('侧栏菜单经 ui Menu 渲染：badge / dot / group 展示，选择经 chat.menuSelect 闭环', async () => {
    const store = new ConversationStore();
    const { runtime } = renderChatPage(
      {
        page: { id: 'chat', title: '聊天页' },
        state: { selected: '' },
        body: {
          type: 'Chat',
          props: {
            menu: [
              { key: 'chat', label: '对话', icon: 'chat' },
              { key: 's1', label: '会话一', group: '最近', badge: 2, dot: true },
            ],
            activeMenuKey: 'chat',
          },
          events: {
            onMenuSelect: [
              { action: 'setState', params: { selected: '${event.key}' } },
            ],
          },
        },
      },
      { transport: createManualDriver().transport, store },
    );

    // ui Menu 渲染（DSL 路径）与展示字段
    expect(document.querySelector('[data-slot=menu]')).not.toBeNull();
    expect(screen.getByText('2')).toBeDefined();
    expect(screen.getByText('最近')).toBeDefined();
    expect(
      document.querySelector('[data-slot=menu-item-dot]'),
    ).not.toBeNull();
    // 高亮受控
    expect(
      document
        .querySelector('[data-key=chat] [data-slot=menu-item]')
        ?.getAttribute('aria-current'),
    ).toBe('page');

    // 选择闭环：chat.menuSelect → onMenuSelect 传播 → DSL setState
    fireEvent.click(screen.getByText('会话一'));
    await vi.waitFor(() => {
      expect(runtime.context.state.get('selected')).toBe('s1');
    });
  });

  it('模型选择经 ui Select 承载，显示当前模型 label', () => {
    const store = new ConversationStore();
    renderChatPage(
      {
        page: { id: 'chat', title: '聊天页' },
        body: {
          type: 'Chat',
          props: {
            models: [
              { value: 'demo', label: 'demo-mock' },
              { value: 'pro', label: 'pro-max' },
            ],
            model: 'pro',
          },
        },
      },
      { transport: createManualDriver().transport, store },
    );

    const select = document.querySelector('.pactor-chat-model-select')!;
    expect(select).not.toBeNull();
    // 受控规则 D5：静态 model prop 之外缺省解析为首个候选
    expect(select.textContent).toContain('demo-mock');
  });

  it('header 操作组经 ui 组件渲染，清空经 chat.headerAction 触发默认行为与并行事件', async () => {
    const store = new ConversationStore();
    store.appendMessage({
      id: 'u1',
      role: 'user',
      status: 'completed',
      parts: [{ type: 'text', content: '问' }],
    });
    const { view } = renderChatPage(
      {
        page: { id: 'chat', title: '聊天页' },
        state: { cleared: '' },
        body: {
          type: 'Chat',
          props: { title: '会话', headerActions: ['clear'] },
          events: {
            onClear: [{ action: 'setState', params: { cleared: 'yes' } }],
          },
        },
      },
      { transport: createManualDriver().transport, store },
    );

    // DSL 路径：操作组经 Tooltip/Button/Icon 渲染（无 title 属性，按容器定位）
    const actions = view.container.querySelector(
      '.pactor-chat-workspace__header-actions .pactor-chat-chrome',
    );
    expect(actions).not.toBeNull();
    const clearButton = actions!.querySelector('button')!;
    fireEvent.click(clearButton);

    await vi.waitFor(() => {
      expect(store.getMessages()).toHaveLength(0);
    });
  });

  it('产出物面板标题栏经 ui 组件渲染，关闭经 chat.panelClose 接回', async () => {
    const store = new ConversationStore();
    const { view } = renderChatPage(
      {
        page: { id: 'chat', title: '聊天页' },
        state: {
          panelOpen: true,
          artifact: { id: 'a1', kind: 'markdown', title: '月报', content: '# 月报' },
        },
        body: {
          type: 'Chat',
          props: {
            artifact: '${state.artifact}',
            panelOpen: '${state.panelOpen}',
          },
          events: {
            onPanelClose: [
              { action: 'setState', params: { panelOpen: false } },
            ],
          },
        },
      },
      { transport: createManualDriver().transport, store },
    );

    expect(document.querySelector('.pactor-chat-inspector')).not.toBeNull();
    const header = view.container.querySelector(
      '.pactor-chat-inspector__header .pactor-chat-chrome',
    );
    expect(header).not.toBeNull();
    const closeButton = header!.querySelector('button')!;
    fireEvent.click(closeButton);

    // 受控闭环：onPanelClose → setState panelOpen=false → 面板关闭
    await vi.waitFor(() => {
      expect(document.querySelector('.pactor-chat-inspector')).toBeNull();
    });
  });
});
