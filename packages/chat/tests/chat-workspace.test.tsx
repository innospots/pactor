// @vitest-environment jsdom
import './setup.js';

import { Registry, type DslNode, type PageDsl } from '@pactor-app/core';
import { createPageRuntime } from '@pactor-app/runtime';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ChatServicesProvider,
  ConversationStore,
  createChatWorkspace,
  createManualDriver,
  useChatServices,
} from '../src/index.js';

afterEach(cleanup);

function getTextarea(): HTMLTextAreaElement {
  return document.querySelector('.pactor-chat-composer textarea')!;
}

function sendText(text: string): void {
  fireEvent.change(getTextarea(), { target: { value: text } });
  fireEvent.keyDown(getTextarea(), { key: 'Enter' });
}

describe('createChatWorkspace（spec: chat-dsl-page / 工厂）', () => {
  it('工厂创建组件：发送经注入的 transport 驱动一轮对话（spec: 工厂创建组件）', async () => {
    const driver = createManualDriver();
    const ChatWorkspace = createChatWorkspace({ transport: driver.transport });
    render(<ChatWorkspace greeting="你好" />);

    sendText('帮我分析');
    // user 消息立即出现
    await screen.findByText('帮我分析');

    driver.push({ type: 'text.delta', messageId: 'x', delta: '分析' });
    await screen.findByText('分析');
    driver.push({ type: 'text.delta', messageId: 'x', delta: '完成' });
    await screen.findByText('分析完成');
    driver.push({ type: 'message.end', messageId: 'x' });
    driver.complete();
  });

  it('重渲染不丢会话：props 变化后 store 实例保持、既有消息不丢（spec: 重渲染不丢会话）', async () => {
    const driver = createManualDriver();
    const ChatWorkspace = createChatWorkspace({ transport: driver.transport });
    const { rerender } = render(<ChatWorkspace greeting="你好" />);

    sendText('第一条消息');
    await screen.findByText('第一条消息');

    rerender(<ChatWorkspace greeting="换个问候" subtitle="新副标题" />);
    // 消息仍在（store 未重建）；空状态不再出现故问候文案不可见
    expect(screen.getByText('第一条消息')).toBeTruthy();

    driver.push({ type: 'text.delta', messageId: 'x', delta: '继续回复' });
    await screen.findByText('继续回复');
    driver.push({ type: 'message.end', messageId: 'x' });
    driver.complete();
  });

  it('外部 store 生效：宿主自持 store 中的消息直接渲染', () => {
    const driver = createManualDriver();
    const store = new ConversationStore();
    store.appendMessage({
      id: 'u1',
      role: 'user',
      status: 'completed',
      parts: [{ type: 'text', content: '外部消息', status: 'ready' }],
    });
    const ChatWorkspace = createChatWorkspace({
      transport: driver.transport,
      store,
    });
    render(<ChatWorkspace />);
    expect(screen.getByText('外部消息')).toBeTruthy();
  });

  it('storeFactory 创建自持 store（未提供 store 时）', async () => {
    const driver = createManualDriver();
    const store = new ConversationStore();
    const storeFactory = vi.fn(() => store);
    const ChatWorkspace = createChatWorkspace({
      transport: driver.transport,
      storeFactory,
    });
    render(<ChatWorkspace />);
    expect(storeFactory).toHaveBeenCalledTimes(1);

    sendText('经工厂 store 发送');
    await screen.findByText('经工厂 store 发送');
    expect(store.getMessages().some((m) => m.role === 'user')).toBe(true);
    driver.push({ type: 'message.end', messageId: 'x' });
    driver.complete();
  });

  it('DSL 安全 props：greeting / subtitle / suggestions 渲染，点击建议即发送', async () => {
    const driver = createManualDriver();
    const ChatWorkspace = createChatWorkspace({ transport: driver.transport });
    render(
      <ChatWorkspace
        greeting="你好，我是工作区"
        subtitle="由 DSL 配置"
        suggestions={[{ label: '今天天气怎么样', prompt: '今天天气怎么样' }]}
      />,
    );

    expect(screen.getByText('你好，我是工作区')).toBeTruthy();
    expect(screen.getByText('由 DSL 配置')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '今天天气怎么样' }));
    // 建议点击走发送路径：user 消息出现，空状态卸载
    await screen.findAllByText('今天天气怎么样');
    await vi.waitFor(() => {
      expect(screen.queryByText('你好，我是工作区')).toBeNull();
    });
    driver.push({ type: 'message.end', messageId: 'x' });
    driver.complete();
  });

  it('附件受控：onAttachFiles 回传附件渲染卡片，发送后清空', async () => {
    const driver = createManualDriver();
    const ChatWorkspace = createChatWorkspace({
      transport: driver.transport,
      onAttachFiles: (files) =>
        files.map((file, index) => ({
          id: `att-${index}`,
          name: file.name,
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
        })),
    });
    render(<ChatWorkspace />);

    const file = new File(['data'], '报告.pdf', { type: 'application/pdf' });
    fireEvent.change(
      document.querySelector('.pactor-chat-composer input[type="file"]')!,
      { target: { files: [file] } },
    );
    await screen.findByText('报告.pdf');

    sendText('请看附件');
    await screen.findByText('请看附件');
    // 发送后附件区清空
    await vi.waitFor(() => {
      expect(screen.queryByText('报告.pdf')).toBeNull();
    });
    driver.push({ type: 'message.end', messageId: 'x' });
    driver.complete();
  });

  it('title / headerExtra：渲染工作区头部', () => {
    const driver = createManualDriver();
    const ChatWorkspace = createChatWorkspace({
      transport: driver.transport,
      headerExtra: <span>头部扩展</span>,
    });
    render(<ChatWorkspace title="工作区标题" />);
    expect(screen.getByText('工作区标题')).toBeTruthy();
    expect(screen.getByText('头部扩展')).toBeTruthy();
  });
});

describe('createChatWorkspace（spec: chat-dsl-page / 页面运行时集成）', () => {
  function createChatPageDsl(props: Record<string, unknown>): PageDsl {
    return {
      dsl: '1.0',
      page: { id: 'chat', title: '聊天页' },
      body: { type: 'ChatWorkspace', props },
    };
  }

  function createComponents(
    ChatWorkspace: ReturnType<typeof createChatWorkspace>,
  ): Registry<unknown> {
    const components = new Registry<unknown>('ComponentRegistry');
    components.register('ChatWorkspace', ChatWorkspace);
    components.register(
      'ToolbarTag',
      ({ text }: { text?: string }) => <span>{text}</span>,
    );
    components.register(
      'SidebarTag',
      ({ text }: { text?: string }) => <nav>{text}</nav>,
    );
    return components;
  }

  it('经 createPageRuntime 渲染：DSL props 生效，mock 对话流程走通（spec: 经 createPageRuntime 渲染）', async () => {
    const driver = createManualDriver();
    const ChatWorkspace = createChatWorkspace({ transport: driver.transport });
    const runtime = createPageRuntime(
      createChatPageDsl({
        greeting: '来自 DSL 的问候',
        suggestions: [{ label: '看一下本月报表', prompt: '看一下本月报表' }],
      }),
      { components: createComponents(ChatWorkspace) },
    );

    render(<>{runtime.render()}</>);
    await screen.findByText('来自 DSL 的问候');

    fireEvent.click(screen.getByRole('button', { name: '看一下本月报表' }));
    await vi.waitFor(() => {
      expect(screen.queryByText('来自 DSL 的问候')).toBeNull();
    });

    driver.push({ type: 'text.delta', messageId: 'x', delta: '报表已生成' });
    await screen.findByText('报表已生成');
    driver.push({ type: 'message.end', messageId: 'x' });
    driver.complete();
    await runtime.destroy();
  });

  it('toolbarEnd DslNode 槽：内嵌 DSL 子树经 renderChildren 渲染（任务 1.1 结论）', async () => {
    const driver = createManualDriver();
    const ChatWorkspace = createChatWorkspace({ transport: driver.transport });
    const toolbarEnd: DslNode = {
      type: 'ToolbarTag',
      props: { text: 'DSL 工具栏槽' },
    };
    const runtime = createPageRuntime(
      createChatPageDsl({ toolbarEnd }),
      { components: createComponents(ChatWorkspace) },
    );

    render(<>{runtime.render()}</>);
    await screen.findByText('DSL 工具栏槽');
    await runtime.destroy();
  });

  it('sidebar DslNode 槽：以 AppShell 侧栏渲染内嵌 DSL 子树', async () => {
    const driver = createManualDriver();
    const ChatWorkspace = createChatWorkspace({ transport: driver.transport });
    const sidebar: DslNode = {
      type: 'SidebarTag',
      props: { text: 'DSL 侧栏槽' },
    };
    const runtime = createPageRuntime(createChatPageDsl({ sidebar }), {
      components: createComponents(ChatWorkspace),
    });

    render(<>{runtime.render()}</>);
    await screen.findByText('DSL 侧栏槽');
    await runtime.destroy();
  });
});

describe('ChatServicesProvider 服务透传（spec: chat-context-sources / callService）', () => {
  it('注入的 callService 经 useChatServices 可被消费方读到（引用一致）', () => {
    const driver = createManualDriver();
    const callService = vi.fn(async () => []);

    let consumed: ReturnType<typeof useChatServices> = null;
    function Probe(): null {
      consumed = useChatServices();
      return null;
    }

    render(
      <ChatServicesProvider
        value={{ transport: driver.transport, callService }}
      >
        <Probe />
      </ChatServicesProvider>,
    );

    expect(consumed).not.toBeNull();
    expect(consumed!.callService).toBe(callService);
  });
});

describe('ChatWorkspace 内建特性 props 透传（spec: chat-model-selector / chat-context-sources / chat-dsl-component）', () => {
  it('models / onModelChange 透传：渲染模型 chip，React 直连回调收到原始值', () => {
    const driver = createManualDriver();
    const ChatWorkspace = createChatWorkspace({ transport: driver.transport });
    const onModelChange = vi.fn();
    render(
      <ChatWorkspace
        models={[
          { value: 'demo', label: 'demo-mock' },
          { value: 'pro', label: 'pro-max' },
        ]}
        model="demo"
        onModelChange={onModelChange}
      />,
    );

    expect(
      screen.getByRole('button', { name: '选择模型' }).textContent,
    ).toContain('demo-mock');
    fireEvent.click(screen.getByRole('button', { name: '选择模型' }));
    fireEvent.click(screen.getByText('pro-max'));
    expect(onModelChange).toHaveBeenCalledWith('pro');
  });

  it('contexts 透传：静态源输入 @ 出内建弹层，选中成 chip 并回调', () => {
    const driver = createManualDriver();
    const ChatWorkspace = createChatWorkspace({ transport: driver.transport });
    const onContextsChange = vi.fn();
    render(
      <ChatWorkspace
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
    expect(
      document.querySelector('.pactor-chat-context-chip__label')?.textContent,
    ).toBe('报表助手');
    expect(onContextsChange).toHaveBeenCalledWith([
      expect.objectContaining({ id: 'a1' }),
    ]);
  });

  it('headerActions / editableTitle / onTitleChange 透传到内建 header', () => {
    const driver = createManualDriver();
    const ChatWorkspace = createChatWorkspace({ transport: driver.transport });
    const onTitleChange = vi.fn();
    render(
      <ChatWorkspace
        title="原标题"
        headerActions={['export', 'theme', 'clear']}
        editableTitle
        onTitleChange={onTitleChange}
      />,
    );

    expect(screen.getByRole('button', { name: '导出 Markdown' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '切换明暗主题' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '清空会话' })).toBeTruthy();

    fireEvent.click(
      document.querySelector('.pactor-chat-workspace__title--editable')!,
    );
    const input = screen.getByRole('textbox', { name: '编辑标题' });
    fireEvent.change(input, { target: { value: '新标题' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onTitleChange).toHaveBeenCalledWith('新标题');
  });
});

