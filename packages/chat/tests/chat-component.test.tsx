// @vitest-environment jsdom
import './setup.js';

import { Registry, type DslNode, type PageDsl } from '@pactor-app/core';
import { createPageRuntime } from '@pactor-app/runtime';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  Chat,
  ChatServicesProvider,
  ConversationStore,
  createManualDriver,
  registerChatComponent,
  useChatServices,
  type ChatMenuItem,
  type ChatServices,
} from '../src/index.js';

afterEach(cleanup);

function getTextarea(): HTMLTextAreaElement {
  return document.querySelector('.pactor-chat-composer textarea')!;
}

function sendText(text: string): void {
  fireEvent.change(getTextarea(), { target: { value: text } });
  fireEvent.keyDown(getTextarea(), { key: 'Enter' });
}

function menuItems(): ChatMenuItem[] {
  return [
    { key: 'new', label: '新建对话', icon: 'plus' },
    { key: 's1', label: '本月报表分析', icon: 'history', group: '历史会话' },
    { key: 's2', label: '周报整理', icon: 'history' },
  ];
}

function renderChat(
  ui: React.ReactElement,
  services?: ChatServices,
): ReturnType<typeof render> {
  const driver = createManualDriver();
  const resolved = services ?? { transport: driver.transport };
  return render(
    <ChatServicesProvider value={resolved}>{ui}</ChatServicesProvider>,
  );
}

describe('registerChatComponent（spec: chat-dsl-component / Chat 组件注册）', () => {
  it('注册 Chat 类型（spec: 注册并声明）', () => {
    const registry = new Registry<unknown>('ComponentRegistry');
    registerChatComponent(registry);
    expect(registry.has('Chat')).toBe(true);
  });

  it('不覆盖已有注册（spec: 不覆盖已有注册）', () => {
    const registry = new Registry<unknown>('ComponentRegistry');
    const existing = (): null => null;
    registry.register('Chat', existing);
    registerChatComponent(registry);
    expect(registry.get('Chat')).toBe(existing);
  });
});

describe('ChatServicesProvider（spec: chat-dsl-component / 服务经 Context 注入）', () => {
  it('useChatServices 读取最近 provider 的服务；无 provider 返回 null', () => {
    const seen: (ChatServices | null)[] = [];
    function Probe(): null {
      seen.push(useChatServices());
      return null;
    }
    const services: ChatServices = { transport: createManualDriver().transport };
    render(
      <>
        <Probe />
        <ChatServicesProvider value={services}>
          <Probe />
        </ChatServicesProvider>
      </>,
    );
    expect(seen[0]).toBeNull();
    expect(seen[1]).toBe(services);
  });

  it('注入 mock transport：发送消息后对话 turn 正常执行（spec: 注入后可用）', async () => {
    const driver = createManualDriver();
    render(
      <ChatServicesProvider value={{ transport: driver.transport }}>
        <Chat greeting="你好" />
      </ChatServicesProvider>,
    );

    sendText('帮我分析');
    await screen.findByText('帮我分析');

    driver.push({ type: 'text.delta', messageId: 'x', delta: '分析完成' });
    await screen.findByText('分析完成');
    driver.push({ type: 'message.end', messageId: 'x' });
    driver.complete();
  });

  it('缺失 provider：渲染「未配置聊天服务」提示并 console.warn，不抛错（spec: 缺失受控降级）', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Chat />);
    expect(screen.getByText(/未配置聊天服务/)).toBeTruthy();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe('Chat 菜单（spec: chat-dsl-component / 左侧菜单配置与选择事件）', () => {
  it('menu 驱动内建侧栏：AppShell 承载，activeMenuKey 高亮（spec: 菜单渲染与高亮）', () => {
    renderChat(<Chat menu={menuItems()} activeMenuKey="s1" />);
    expect(document.querySelector('.pactor-chat-shell')).toBeTruthy();
    const items = document.querySelectorAll('.pactor-chat-menu__item');
    expect(items).toHaveLength(3);
    const active = document.querySelector('.pactor-chat-menu__item--active');
    expect(active?.textContent).toContain('本月报表分析');
  });

  it('group 渲染分组标题', () => {
    renderChat(<Chat menu={menuItems()} />);
    const group = document.querySelector('.pactor-chat-menu__group');
    expect(group?.textContent).toBe('历史会话');
  });

  it('未知图标名渲染占位，不抛错（spec: 未知图标名占位）', () => {
    renderChat(
      <Chat menu={[{ key: 'x', label: '未知图标项', icon: 'no-such-icon' }]} />,
    );
    expect(screen.getByText('未知图标项')).toBeTruthy();
    // ui Icon 未知名渲染占位并标 data-unknown（spec: chat-icon-convergence）
    expect(
      document.querySelector('[data-unknown="no-such-icon"]'),
    ).toBeTruthy();
  });

  it('onMenuSelect 以 key + item 触发；disabled 项不触发（spec: 禁用项不触发）', () => {
    const onMenuSelect = vi.fn();
    const menu: ChatMenuItem[] = [
      { key: 'a', label: '可选', icon: 'chat' },
      { key: 'b', label: '禁用', icon: 'settings', disabled: true },
    ];
    renderChat(<Chat menu={menu} onMenuSelect={onMenuSelect} />);

    fireEvent.click(screen.getByText('可选'));
    expect(onMenuSelect).toHaveBeenCalledTimes(1);
    expect(onMenuSelect).toHaveBeenCalledWith('a', menu[0]);

    fireEvent.click(screen.getByText('禁用'));
    expect(onMenuSelect).toHaveBeenCalledTimes(1);
  });

  it('sidebar 槽替代内建侧栏', () => {
    renderChat(
      <Chat menu={menuItems()} sidebar={<nav>自定义侧栏</nav>} />,
    );
    expect(screen.getByText('自定义侧栏')).toBeTruthy();
    expect(document.querySelector('.pactor-chat-menu')).toBeNull();
    expect(document.querySelector('.pactor-chat-shell')).toBeTruthy();
  });
});

describe('Chat header（spec: chat-dsl-component / Header 配置）', () => {
  it('title + headerExtra（ReactNode）：渲染标题与右侧槽', () => {
    renderChat(<Chat title="会话标题" headerExtra={<span>头部扩展</span>} />);
    const header = document.querySelector('.pactor-chat-workspace__header');
    expect(header?.textContent).toContain('会话标题');
    expect(screen.getByText('头部扩展')).toBeTruthy();
  });

  it('header 槽整体替换内建 header', () => {
    renderChat(<Chat title="不应出现" header={<div>自定义头部</div>} />);
    expect(screen.getByText('自定义头部')).toBeTruthy();
    expect(screen.queryByText('不应出现')).toBeNull();
    expect(
      document.querySelector('.pactor-chat-workspace__header'),
    ).toBeNull();
  });

  it('showHeader: false 关闭 header', () => {
    renderChat(<Chat title="会话标题" showHeader={false} />);
    expect(screen.queryByText('会话标题')).toBeNull();
    expect(
      document.querySelector('.pactor-chat-workspace__header'),
    ).toBeNull();
  });

  it('无头部内容时 workspace__header 节点不渲染；提供 headerActions 即渲染', () => {
    const { unmount } = renderChat(<Chat greeting="你好" />);
    expect(
      document.querySelector('.pactor-chat-workspace__header'),
    ).toBeNull();
    unmount();

    renderChat(<Chat headerActions={['export']} />);
    expect(
      document.querySelector('.pactor-chat-workspace__header'),
    ).not.toBeNull();
  });

  it('DslNode 槽在纯 React（无页面运行时）下降级：warn + 跳过，不抛错', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const headerExtra: DslNode = { type: 'Whatever', props: {} };
    renderChat(<Chat title="标题" headerExtra={headerExtra} />);
    expect(screen.getByText('标题')).toBeTruthy();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe('Chat 事件 props（spec: chat-dsl-component / 发送事件）', () => {
  it('onSend 在用户发送时以文本触发（与 transport turn 并行）', async () => {
    const driver = createManualDriver();
    const onSend = vi.fn();
    render(
      <ChatServicesProvider value={{ transport: driver.transport }}>
        <Chat onSend={onSend} />
      </ChatServicesProvider>,
    );

    sendText('你好世界');
    expect(onSend).toHaveBeenCalledWith('你好世界');
    await screen.findByText('你好世界');
    driver.push({ type: 'message.end', messageId: 'x' });
    driver.complete();
  });
});

describe('ChatDslAdapter 新事件折算（spec: chat-dsl-component / chat-model-selector / chat-context-sources，决策 D4/D5）', () => {
  /** 取注册表中的 Chat DSL 适配器组件 */
  function getAdapter(): React.ComponentType<Record<string, unknown>> {
    const registry = new Registry<unknown>('ComponentRegistry');
    registerChatComponent(registry);
    return registry.get('Chat') as React.ComponentType<
      Record<string, unknown>
    >;
  }

  it('events.onModelChange：event 作用域含 model（{ model: value }）', () => {
    const Adapter = getAdapter();
    const onModelChange = vi.fn();
    renderChat(
      <Adapter
        models={[
          { value: 'demo', label: 'demo-mock' },
          { value: 'pro', label: 'pro-max' },
        ]}
        onModelChange={onModelChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '选择模型' }));
    fireEvent.click(screen.getByText('pro-max'));
    expect(onModelChange).toHaveBeenCalledWith({ model: 'pro' });
  });

  it('events.onContextsChange：event 作用域含 contexts（chips 数组）', () => {
    const Adapter = getAdapter();
    const onContextsChange = vi.fn();
    renderChat(
      <Adapter
        contexts={[
          {
            trigger: '@',
            label: '智能体',
            items: [{ id: 'a1', label: '报表助手' }],
          },
        ]}
        onContextsChange={onContextsChange}
      />,
    );

    fireEvent.change(getTextarea(), { target: { value: '@' } });
    fireEvent.click(screen.getByText('报表助手'));
    expect(onContextsChange).toHaveBeenCalledWith({
      contexts: [expect.objectContaining({ id: 'a1', label: '报表助手' })],
    });
  });

  it('events.onExport / onClear 为空对象 {}；onThemeChange 含 theme；onTitleChange 含 title', () => {
    const Adapter = getAdapter();
    const createObjectURL = vi.fn(() => 'blob:mock');
    const revokeObjectURL = vi.fn();
    Object.assign(URL, { createObjectURL, revokeObjectURL });
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});

    const onExport = vi.fn();
    const onClear = vi.fn();
    const onThemeChange = vi.fn();
    const onTitleChange = vi.fn();
    renderChat(
      <Adapter
        title="原标题"
        headerActions={['export', 'theme', 'clear']}
        editableTitle
        onExport={onExport}
        onClear={onClear}
        onThemeChange={onThemeChange}
        onTitleChange={onTitleChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '导出 Markdown' }));
    expect(onExport).toHaveBeenCalledWith({});

    fireEvent.click(screen.getByRole('button', { name: '切换明暗主题' }));
    expect(onThemeChange).toHaveBeenCalledWith({ theme: 'dark' });
    document.documentElement.removeAttribute('data-pactor-theme');

    fireEvent.click(screen.getByRole('button', { name: '清空会话' }));
    expect(onClear).toHaveBeenCalledWith({});

    fireEvent.click(
      document.querySelector('.pactor-chat-workspace__title--editable')!,
    );
    const input = screen.getByRole('textbox', { name: '编辑标题' });
    fireEvent.change(input, { target: { value: '新标题' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onTitleChange).toHaveBeenCalledWith({ title: '新标题' });

    clickSpy.mockRestore();
  });

  it('DSL 受控模型闭环：model: ${state.model} + events.onModelChange → setState（spec: 受控闭环）', async () => {
    const driver = createManualDriver();
    const components = new Registry<unknown>('ComponentRegistry');
    registerChatComponent(components);
    const runtime = createPageRuntime(
      {
        dsl: '1.0',
        page: { id: 'chat', title: '聊天页' },
        state: { model: 'demo' },
        body: {
          type: 'Chat',
          props: {
            models: [
              { value: 'demo', label: 'demo-mock' },
              { value: 'pro', label: 'pro-max' },
            ],
            model: '${state.model}',
          },
          events: {
            onModelChange: [
              { action: 'setState', params: { model: '${event.model}' } },
            ],
          },
        },
      },
      { components },
    );

    render(
      <ChatServicesProvider value={{ transport: driver.transport }}>
        {runtime.render()}
      </ChatServicesProvider>,
    );

    expect(
      screen.getByRole('button', { name: '选择模型' }).textContent,
    ).toContain('demo-mock');

    fireEvent.click(screen.getByRole('button', { name: '选择模型' }));
    fireEvent.click(screen.getByText('pro-max'));
    await vi.waitFor(() => {
      expect(
        screen.getByRole('button', { name: '选择模型' }).textContent,
      ).toContain('pro-max');
    });
    await runtime.destroy();
  });
});

describe('Chat（spec: chat-dsl-component / 页面运行时集成）', () => {
  function createChatPageDsl(body: PageDsl['body']): PageDsl {
    return {
      dsl: '1.0',
      page: { id: 'chat', title: '聊天页' },
      state: { activeMenu: 's1', lastSent: '' },
      body,
    };
  }

  function createComponents(): Registry<unknown> {
    const components = new Registry<unknown>('ComponentRegistry');
    registerChatComponent(components);
    components.register('HeaderTag', ({ text }: { text?: string }) => (
      <div>{text}</div>
    ));
    components.register('Echo', ({ text }: { text?: string }) => (
      <div>回显：{text}</div>
    ));
    components.register(
      'Stack',
      ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    );
    return components;
  }

  it('{ type: Chat } 声明：menu + state 绑定 + onMenuSelect setState 切换高亮（spec: 选择更新状态）', async () => {
    const driver = createManualDriver();
    const runtime = createPageRuntime(
      createChatPageDsl({
        type: 'Chat',
        props: {
          greeting: '来自 DSL 的问候',
          menu: menuItems(),
          activeMenuKey: '${state.activeMenu}',
        },
        events: {
          onMenuSelect: [
            { action: 'setState', params: { activeMenu: '${event.key}' } },
          ],
        },
      }),
      { components: createComponents() },
    );

    render(
      <ChatServicesProvider value={{ transport: driver.transport }}>
        {runtime.render()}
      </ChatServicesProvider>,
    );
    await screen.findByText('来自 DSL 的问候');

    // 初始高亮 s1
    expect(
      document.querySelector('.pactor-chat-menu__item--active')?.textContent,
    ).toContain('本月报表分析');

    // 点击「周报整理」→ setState → 高亮切换
    fireEvent.click(screen.getByText('周报整理'));
    await vi.waitFor(() => {
      expect(
        document.querySelector('.pactor-chat-menu__item--active')?.textContent,
      ).toContain('周报整理');
    });
    await runtime.destroy();
  });

  it('events.onSend：event.text 为用户文本（spec: 发送触发动作）', async () => {
    const driver = createManualDriver();
    const runtime = createPageRuntime(
      createChatPageDsl({
        type: 'Stack',
        children: [
          {
            type: 'Chat',
            events: {
              onSend: [
                {
                  action: 'setState',
                  params: { lastSent: '${event.text}' },
                },
              ],
            },
          },
          { type: 'Echo', props: { text: '${state.lastSent}' } },
        ],
      }),
      { components: createComponents() },
    );

    render(
      <ChatServicesProvider value={{ transport: driver.transport }}>
        {runtime.render()}
      </ChatServicesProvider>,
    );

    sendText('记录我');
    await screen.findByText('回显：记录我');
    driver.push({ type: 'message.end', messageId: 'x' });
    driver.complete();
    await runtime.destroy();
  });

  it('headerExtra DslNode 槽：页面运行时下经 renderChildren 渲染', async () => {
    const driver = createManualDriver();
    const runtime = createPageRuntime(
      createChatPageDsl({
        type: 'Chat',
        props: {
          title: '工作区',
          headerExtra: { type: 'HeaderTag', props: { text: 'DSL 头部槽' } },
        },
      }),
      { components: createComponents() },
    );

    render(
      <ChatServicesProvider value={{ transport: driver.transport }}>
        {runtime.render()}
      </ChatServicesProvider>,
    );
    await screen.findByText('DSL 头部槽');
    expect(screen.getByText('工作区')).toBeTruthy();
    await runtime.destroy();
  });

  it('sidebar DslNode 槽：页面运行时下替代内建侧栏', async () => {
    const driver = createManualDriver();
    const runtime = createPageRuntime(
      createChatPageDsl({
        type: 'Chat',
        props: {
          menu: menuItems(),
          sidebar: { type: 'HeaderTag', props: { text: 'DSL 侧栏槽' } },
        },
      }),
      { components: createComponents() },
    );

    render(
      <ChatServicesProvider value={{ transport: driver.transport }}>
        {runtime.render()}
      </ChatServicesProvider>,
    );
    await screen.findByText('DSL 侧栏槽');
    expect(document.querySelector('.pactor-chat-menu')).toBeNull();
    await runtime.destroy();
  });
});


describe('Chat messageActions（spec: chat-message-actions / chat-dsl-component 消息操作配置）', () => {
  function createStore(): ConversationStore {
    const store = new ConversationStore();
    store.appendMessage({
      id: 'u1',
      role: 'user',
      status: 'completed',
      parts: [{ type: 'text', content: '问题', status: 'ready' }],
    });
    store.appendMessage({
      id: 'a1',
      role: 'assistant',
      status: 'completed',
      parts: [{ type: 'markdown', content: '回答', status: 'ready' }],
    });
    return store;
  }

  function createActionComponents(): Registry<unknown> {
    const components = new Registry<unknown>('ComponentRegistry');
    registerChatComponent(components);
    components.register('Echo', ({ text }: { text?: string }) => (
      <div>回显：{text}</div>
    ));
    components.register(
      'Stack',
      ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    );
    return components;
  }

  it('DSL 配置操作条：按数组渲染，onMessageAction 折算 event.action / event.message；内建动作亦通知', async () => {
    const driver = createManualDriver();
    const store = createStore();
    const callService = vi.fn().mockResolvedValue(undefined);
    const runtime = createPageRuntime(
      {
        dsl: '1.0',
        page: { id: 'chat', title: '聊天页' },
        state: { lastAction: '', lastMessage: '' },
        body: {
          type: 'Stack',
          children: [
            {
              type: 'Chat',
              props: {
                messageActions: [
                  'copy',
                  {
                    id: 'quote',
                    label: '引用回复',
                    icon: 'quote',
                    service: 'quoteMessage',
                  },
                ],
              },
              events: {
                onMessageAction: [
                  {
                    action: 'setState',
                    params: {
                      lastAction: '${event.action}',
                      lastMessage: '${event.message.id}',
                    },
                  },
                ],
              },
            },
            { type: 'Echo', props: { text: '${state.lastAction}' } },
            { type: 'Echo', props: { text: '${state.lastMessage}' } },
          ],
        },
      },
      { components: createActionComponents() },
    );

    render(
      <ChatServicesProvider
        value={{ transport: driver.transport, store, callService }}
      >
        {runtime.render()}
      </ChatServicesProvider>,
    );

    // 数组即真相：操作条仅含复制与引用回复两个按钮
    const assistantNode = document.querySelector('[data-message-id="a1"]')!;
    const labels = Array.from(
      assistantNode.querySelectorAll('.pactor-chat-message__actions button'),
    ).map((button) => button.getAttribute('aria-label'));
    expect(labels).toEqual(['复制', '引用回复']);

    // 点击自定义动作：callService 派发 + DSL 事件（event.action / event.message）
    fireEvent.click(screen.getByRole('button', { name: '引用回复' }));
    expect(callService).toHaveBeenCalledWith('quoteMessage', {
      actionId: 'quote',
      message: expect.objectContaining({ id: 'a1' }),
    });
    await screen.findByText('回显：quote');
    await screen.findByText('回显：a1');

    // 内建动作点击同样触发事件通知（默认行为不受影响）
    fireEvent.click(screen.getByRole('button', { name: '复制' }));
    await screen.findByText('回显：copy');
    await runtime.destroy();
  });
});
