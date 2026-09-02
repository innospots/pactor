// @vitest-environment jsdom
import './setup.js';

import { Registry, type PageDsl } from '@pactor/core';
import { createPageRuntime } from '@pactor/runtime';
import { createShadcnComponentRegistry } from '@pactor/ui/components';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ArtifactPanel,
  ArtifactStore,
  Chat,
  ChatServicesProvider,
  ChatView,
  ConversationStore,
  createManualDriver,
  createSafeRegistry,
  registerChatComponent,
  type ChatArtifact,
} from '../src/index.js';

afterEach(cleanup);

const MARKDOWN_ARTIFACT: ChatArtifact = {
  id: 'a1',
  kind: 'markdown',
  title: '分析报告',
  content: '## 结论\n\n一切正常',
};

/** 面板 dsl 预览用 Safe Registry（与 view.test.tsx 同款白名单） */
function createPanelSafeRegistry(
  extra?: (registry: Registry<unknown>) => void,
): Registry<unknown> {
  const source = createShadcnComponentRegistry();
  extra?.(source);
  return createSafeRegistry(source, ['Statistic', 'Card', 'Boom']);
}

describe('ArtifactPanel（spec: chat-artifact-panel / ArtifactPanel 视图与内建渲染器）', () => {
  it('markdown 产出物渲染：标题语法渲染为 HTML，原始 HTML 不注入（spec scenario）', () => {
    render(
      <ArtifactPanel
        artifact={{
          ...MARKDOWN_ARTIFACT,
          content: '## 结论\n\n<script>alert(1)</script>',
        }}
        onClose={() => {}}
      />,
    );
    expect(
      screen.getByRole('heading', { level: 2, name: '结论' }),
    ).toBeTruthy();
    expect(document.querySelector('script')).toBeNull();
    // 标题栏：标题 + kind 角标
    const header = document.querySelector('.pactor-chat-inspector__header')!;
    expect(header.textContent).toContain('分析报告');
    expect(header.textContent).toContain('markdown');
  });

  it('code 产出物：只读代码块 + language 角标', () => {
    const { container } = render(
      <ArtifactPanel
        artifact={{
          id: 'a2',
          kind: 'code',
          title: '查询脚本',
          content: 'SELECT 1;',
          language: 'sql',
        }}
      />,
    );
    const pre = container.querySelector('.pactor-chat-inspector__body pre')!;
    expect(pre.textContent).toContain('SELECT 1;');
    expect(
      container.querySelector('.pactor-chat-inspector__code-lang')
        ?.textContent,
    ).toBe('sql');
  });

  it('text 产出物：预格式文本', () => {
    const { container } = render(
      <ArtifactPanel
        artifact={{ id: 'a3', kind: 'text', title: '纪要', content: '第一行\n第二行' }}
      />,
    );
    const pre = container.querySelector('.pactor-chat-inspector__body pre')!;
    expect(pre.textContent).toBe('第一行\n第二行');
  });

  it('拖拽调宽：手柄左拖变宽（spec scenario: 拖拽调宽）', () => {
    // jsdom 无布局：面板 320、宿主容器 1000（mock getBoundingClientRect）
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        const width = this.classList?.contains('pactor-chat-inspector')
          ? 320
          : 1000;
        return {
          width,
          height: 600,
          top: 0,
          left: 0,
          right: width,
          bottom: 600,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        } as DOMRect;
      });

    render(<ArtifactPanel artifact={MARKDOWN_ARTIFACT} />);
    const panel = document.querySelector('.pactor-chat-inspector')!;
    const handle = screen.getByRole('separator', { name: '拖动调整面板宽度' });

    fireEvent.pointerDown(handle, { clientX: 500 });
    fireEvent.pointerMove(document, { clientX: 400 });
    // 320 + (500-400) = 420（容器 1000 的 70% = 700，未触顶）
    expect((panel as HTMLElement).style.width).toBe('420px');
    // 拖拽期间禁文本选择
    expect(document.body.style.userSelect).toBe('none');

    fireEvent.pointerUp(document);
    expect(document.body.style.userSelect).toBe('');
    rectSpy.mockRestore();
  });

  it('拖拽夹取下限：右拖超过 240px 后保持 240px（spec scenario: 拖拽夹取下限）', () => {
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        const width = this.classList?.contains('pactor-chat-inspector')
          ? 320
          : 1000;
        return {
          width,
          height: 600,
          top: 0,
          left: 0,
          right: width,
          bottom: 600,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        } as DOMRect;
      });

    render(<ArtifactPanel artifact={MARKDOWN_ARTIFACT} />);
    const panel = document.querySelector('.pactor-chat-inspector')!;
    const handle = screen.getByRole('separator', { name: '拖动调整面板宽度' });

    fireEvent.pointerDown(handle, { clientX: 500 });
    fireEvent.pointerMove(document, { clientX: 900 });
    expect((panel as HTMLElement).style.width).toBe('240px');
    fireEvent.pointerUp(document);
    rectSpy.mockRestore();
  });

  it('dsl 产出物活预览：白名单组件经 renderChildren 渲染（spec scenario）', async () => {
    render(
      <ArtifactPanel
        artifact={{
          id: 'a4',
          kind: 'dsl',
          title: '指标卡',
          content: {
            type: 'Statistic',
            props: { title: '产出物指标', value: 7 },
          },
        }}
        safeRegistry={createPanelSafeRegistry()}
      />,
    );
    await screen.findByText('产出物指标');
    expect(screen.getByText('7')).toBeTruthy();
  });

  it('dsl 产出物被守卫拦截：非白名单组件渲染受控降级块，不抛错（spec scenario）', async () => {
    render(
      <ArtifactPanel
        artifact={{
          id: 'a5',
          kind: 'dsl',
          title: '越权片段',
          content: { type: 'Button', props: { text: '越权按钮' } },
        }}
        safeRegistry={createPanelSafeRegistry()}
      />,
    );
    await screen.findByText(/该组件不允许在 Chat 中使用/);
    expect(screen.queryByText('越权按钮')).toBeNull();
  });

  it('dsl 产出物渲染失败：错误边界降级块，不抛错（spec: MUST NOT 抛错）', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ArtifactPanel
        artifact={{
          id: 'a6',
          kind: 'dsl',
          title: '坏片段',
          content: { type: 'Boom', props: {} },
        }}
        safeRegistry={createPanelSafeRegistry((registry) => {
          registry.register('Boom', () => {
            throw new Error('boom');
          });
        })}
      />,
    );
    await screen.findByText(/DSL 产出物渲染失败/);
    error.mockRestore();
  });

  it('关闭回调：点击关闭按钮触发 onClose（spec scenario）', () => {
    const onClose = vi.fn();
    render(<ArtifactPanel artifact={MARKDOWN_ARTIFACT} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: '关闭面板' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('inspector 槽整体替代内建渲染器', () => {
    render(
      <ArtifactPanel
        artifact={MARKDOWN_ARTIFACT}
        inspector={<div data-testid="custom-inspector">自定义面板</div>}
      />,
    );
    expect(screen.getByTestId('custom-inspector')).toBeTruthy();
    // 内建 markdown 渲染不再出现
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
  });
});

describe('artifact 消息 part（spec: chat-artifact-panel / artifact 消息 part）', () => {
  it('消息流内产出物卡片：渲染标题 + kind 角标 + 打开按钮，而非原始 JSON（spec scenario）', () => {
    const store = new ConversationStore();
    store.appendMessage({
      id: 'a1',
      role: 'assistant',
      status: 'completed',
      parts: [
        {
          type: 'artifact',
          status: 'ready',
          artifact: MARKDOWN_ARTIFACT,
        },
      ],
    });

    render(<ChatView store={store} />);
    const card = document.querySelector('.pactor-chat-artifact-card')!;
    expect(card).toBeTruthy();
    expect(card.textContent).toContain('分析报告');
    expect(card.textContent).toContain('markdown');
    expect(
      screen.getByRole('button', { name: '在面板中打开' }),
    ).toBeTruthy();
    // 不渲染原始 JSON
    expect(screen.queryByText(/"kind":/)).toBeNull();
  });

  it('卡片打开按钮触发 onOpenArtifact 回调（纯展示组件可测）', () => {
    const onOpenArtifact = vi.fn();
    const store = new ConversationStore();
    store.appendMessage({
      id: 'a1',
      role: 'assistant',
      status: 'completed',
      parts: [
        { type: 'artifact', status: 'ready', artifact: MARKDOWN_ARTIFACT },
      ],
    });

    render(<ChatView store={store} onOpenArtifact={onOpenArtifact} />);
    fireEvent.click(screen.getByRole('button', { name: '在面板中打开' }));
    expect(onOpenArtifact).toHaveBeenCalledTimes(1);
    expect(onOpenArtifact).toHaveBeenCalledWith(MARKDOWN_ARTIFACT);
  });
});

describe('Chat 面板集成（spec: chat-artifact-panel / 面板布局与响应式）', () => {
  function renderChat(
    ui: React.ReactElement,
    services?: Parameters<typeof ChatServicesProvider>[0]['value'],
  ): ReturnType<typeof render> {
    const driver = createManualDriver();
    return render(
      <ChatServicesProvider value={services ?? { transport: driver.transport }}>
        {ui}
      </ChatServicesProvider>,
    );
  }

  it('缺省不渲染：未配置 artifact 且面板未打开时 DOM 中无面板节点（spec scenario）', () => {
    renderChat(<Chat />);
    expect(document.querySelector('.pactor-chat-inspector')).toBeNull();
    expect(document.querySelector('.pactor-chat-inspector-host')).toBeNull();
  });

  it('受控：artifact + panelOpen 渲染面板；桌面并排为 flex 行（spec scenario: 桌面并排）', () => {
    renderChat(<Chat artifact={MARKDOWN_ARTIFACT} panelOpen />);
    const host = document.querySelector('.pactor-chat-inspector-host')!;
    expect(host).toBeTruthy();
    // workspace 与面板在 flex 行内同级
    expect(host.querySelector(':scope > .pactor-chat-workspace')).toBeTruthy();
    const panel = host.querySelector(':scope > .pactor-chat-inspector')!;
    expect(panel).toBeTruthy();
    expect(panel.textContent).toContain('分析报告');
  });

  it('受控：仅提供 artifact 即受控（面板随 artifact 出现）', () => {
    const { rerender } = render(
      <ChatServicesProvider
        value={{ transport: createManualDriver().transport }}
      >
        <Chat artifact={undefined} panelOpen={false} />
      </ChatServicesProvider>,
    );
    expect(document.querySelector('.pactor-chat-inspector')).toBeNull();

    rerender(
      <ChatServicesProvider
        value={{ transport: createManualDriver().transport }}
      >
        <Chat artifact={MARKDOWN_ARTIFACT} panelOpen />
      </ChatServicesProvider>,
    );
    expect(document.querySelector('.pactor-chat-inspector')).toBeTruthy();
  });

  it('受控：点击关闭按钮触发 onPanelClose，面板不单方面修改受控 props（spec: 受控开关闭环）', () => {
    const onPanelClose = vi.fn();
    renderChat(
      <Chat
        artifact={MARKDOWN_ARTIFACT}
        panelOpen
        onPanelClose={onPanelClose}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '关闭面板' }));
    expect(onPanelClose).toHaveBeenCalledTimes(1);
    // 受控：props 未变，面板仍在（由宿主闭环关闭）
    expect(document.querySelector('.pactor-chat-inspector')).toBeTruthy();
  });

  it('回归：面板功能使用时结构稳定——开关面板不重挂载 ChatView，composer 草稿不丢', () => {
    const driver = createManualDriver();
    const { rerender } = render(
      <ChatServicesProvider value={{ transport: driver.transport }}>
        <Chat artifact={MARKDOWN_ARTIFACT} panelOpen />
      </ChatServicesProvider>,
    );
    expect(document.querySelector('.pactor-chat-inspector')).toBeTruthy();

    const textarea = document.querySelector(
      '.pactor-chat-composer textarea',
    )! as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '未发送的草稿' } });

    // 关面板：host 包裹层保持稳定，ChatView 子树不重挂载
    rerender(
      <ChatServicesProvider value={{ transport: driver.transport }}>
        <Chat artifact={MARKDOWN_ARTIFACT} panelOpen={false} />
      </ChatServicesProvider>,
    );
    expect(document.querySelector('.pactor-chat-inspector')).toBeNull();
    expect(document.querySelector('.pactor-chat-inspector-host')).toBeTruthy();
    expect(
      (document.querySelector('.pactor-chat-composer textarea') as HTMLTextAreaElement)
        .value,
    ).toBe('未发送的草稿');

    // 再开面板：草稿仍在
    rerender(
      <ChatServicesProvider value={{ transport: driver.transport }}>
        <Chat artifact={MARKDOWN_ARTIFACT} panelOpen />
      </ChatServicesProvider>,
    );
    expect(document.querySelector('.pactor-chat-inspector')).toBeTruthy();
    expect(
      (document.querySelector('.pactor-chat-composer textarea') as HTMLTextAreaElement)
        .value,
    ).toBe('未发送的草稿');
  });

  it('非受控：内部 ArtifactStore 驱动——卡片打开面板，关闭按钮 / 遮罩关闭（spec scenario: 卡片打开面板 + 窄屏覆盖）', async () => {
    const driver = createManualDriver();
    render(
      <ChatServicesProvider value={{ transport: driver.transport }}>
        <Chat />
      </ChatServicesProvider>,
    );

    // transport 产出 artifact part
    fireEvent.change(document.querySelector('.pactor-chat-composer textarea')!, {
      target: { value: '给我报告' },
    });
    fireEvent.keyDown(document.querySelector('.pactor-chat-composer textarea')!, {
      key: 'Enter',
    });
    driver.push({
      type: 'artifact',
      messageId: 'x',
      artifact: MARKDOWN_ARTIFACT,
    });
    driver.push({ type: 'message.end', messageId: 'x' });
    driver.complete();

    // 框架不擅自开面板：卡片出现但面板未开
    await screen.findByRole('button', { name: '在面板中打开' });
    expect(document.querySelector('.pactor-chat-inspector')).toBeNull();

    // 点击卡片按钮 → 面板以该 artifact 打开
    fireEvent.click(screen.getByRole('button', { name: '在面板中打开' }));
    await screen.findByText('结论');
    expect(document.querySelector('.pactor-chat-inspector')).toBeTruthy();

    // 遮罩点击关闭（窄屏覆盖抽屉语义；jsdom 为桌面视口，遮罩仍在 DOM）
    fireEvent.click(document.querySelector('.pactor-chat-inspector__scrim')!);
    expect(document.querySelector('.pactor-chat-inspector')).toBeNull();
  });

  it('受控：卡片打开按钮无条件触发 onOpenArtifact 回调（spec scenario: 卡片触发宿主回调）', async () => {
    const driver = createManualDriver();
    const onOpenArtifact = vi.fn();
    render(
      <ChatServicesProvider value={{ transport: driver.transport }}>
        <Chat
          artifact={MARKDOWN_ARTIFACT}
          panelOpen={false}
          onOpenArtifact={onOpenArtifact}
        />
      </ChatServicesProvider>,
    );

    fireEvent.change(document.querySelector('.pactor-chat-composer textarea')!, {
      target: { value: '给我报告' },
    });
    fireEvent.keyDown(document.querySelector('.pactor-chat-composer textarea')!, {
      key: 'Enter',
    });
    driver.push({
      type: 'artifact',
      messageId: 'x',
      artifact: MARKDOWN_ARTIFACT,
    });
    driver.push({ type: 'message.end', messageId: 'x' });
    driver.complete();

    // 受控：点击卡片按钮触发回调（面板开关由宿主决定，本身保持关闭）
    fireEvent.click(
      await screen.findByRole('button', { name: '在面板中打开' }),
    );
    expect(onOpenArtifact).toHaveBeenCalledTimes(1);
    expect(onOpenArtifact).toHaveBeenCalledWith(MARKDOWN_ARTIFACT);
    expect(document.querySelector('.pactor-chat-inspector')).toBeNull();
  });

  it('非受控：services.artifactStore 注入即生效（store.open → 面板打开）', async () => {
    const artifactStore = new ArtifactStore();
    renderChat(<Chat />, {
      transport: createManualDriver().transport,
      artifactStore,
    });
    expect(document.querySelector('.pactor-chat-inspector')).toBeNull();

    artifactStore.open(MARKDOWN_ARTIFACT);
    await screen.findByText('分析报告');

    artifactStore.close();
    await vi.waitFor(() => {
      expect(document.querySelector('.pactor-chat-inspector')).toBeNull();
    });
  });

  it('onArtifact：artifact part 就绪时以 artifact 触发（spec: chat-dsl-component / 产出物事件）', async () => {
    const driver = createManualDriver();
    const onArtifact = vi.fn();
    render(
      <ChatServicesProvider value={{ transport: driver.transport }}>
        <Chat onArtifact={onArtifact} />
      </ChatServicesProvider>,
    );

    fireEvent.change(document.querySelector('.pactor-chat-composer textarea')!, {
      target: { value: 'hi' },
    });
    fireEvent.keyDown(document.querySelector('.pactor-chat-composer textarea')!, {
      key: 'Enter',
    });
    driver.push({
      type: 'artifact',
      messageId: 'x',
      artifact: MARKDOWN_ARTIFACT,
    });
    await vi.waitFor(() => {
      expect(onArtifact).toHaveBeenCalledWith(MARKDOWN_ARTIFACT);
    });
    expect(onArtifact).toHaveBeenCalledTimes(1);
    driver.push({ type: 'message.end', messageId: 'x' });
    driver.complete();
    // message.end 收尾不重复触发
    expect(onArtifact).toHaveBeenCalledTimes(1);
  });
});

describe('Chat 面板 DSL 集成（spec: chat-dsl-component / 产出物面板配置与产出物事件）', () => {
  function createComponents(): Registry<unknown> {
    const components = new Registry<unknown>('ComponentRegistry');
    registerChatComponent(components);
    components.register('Echo', ({ text }: { text?: string }) => (
      <div>回显：{text}</div>
    ));
    components.register('PanelSlot', ({ text }: { text?: string }) => (
      <div>自定义检视：{text}</div>
    ));
    components.register(
      'Stack',
      ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    );
    return components;
  }

  function createRuntime(body: PageDsl['body'], state?: Record<string, unknown>) {
    return createPageRuntime(
      {
        dsl: '1.0',
        page: { id: 'chat', title: '聊天页' },
        state: {
          panelOpen: true,
          artifactTitle: '',
          artifact: MARKDOWN_ARTIFACT as unknown as Record<string, unknown>,
          ...state,
        },
        body,
      },
      { components: createComponents() },
    );
  }

  it('受控开关闭环：panelOpen 绑 state，onPanelClose setState 后面板关闭（spec scenario）', async () => {
    const driver = createManualDriver();
    const runtime = createRuntime({
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
    });

    render(
      <ChatServicesProvider value={{ transport: driver.transport }}>
        {runtime.render()}
      </ChatServicesProvider>,
    );
    await screen.findByText('分析报告');

    fireEvent.click(screen.getByRole('button', { name: '关闭面板' }));
    await vi.waitFor(() => {
      expect(document.querySelector('.pactor-chat-inspector')).toBeNull();
    });
    await runtime.destroy();
  });

  it('inspector DslNode 槽：面板内容区渲染该节点而非内建渲染器（spec scenario）', async () => {
    const driver = createManualDriver();
    const runtime = createRuntime({
      type: 'Chat',
      props: {
        artifact: '${state.artifact}',
        panelOpen: '${state.panelOpen}',
        inspector: { type: 'PanelSlot', props: { text: '检视内容' } },
      },
    });

    render(
      <ChatServicesProvider value={{ transport: driver.transport }}>
        {runtime.render()}
      </ChatServicesProvider>,
    );
    await screen.findByText('自定义检视：检视内容');
    // 内建 markdown 渲染不出现
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
    await runtime.destroy();
  });

  it('onArtifact 事件：artifact part 就绪触发 setState，event.artifact 为产出物数据（spec scenario）', async () => {
    const driver = createManualDriver();
    const runtime = createRuntime(
      {
        type: 'Stack',
        children: [
          {
            type: 'Chat',
            events: {
              onArtifact: [
                {
                  action: 'setState',
                  params: { artifactTitle: '${event.artifact.title}' },
                },
              ],
            },
          },
          { type: 'Echo', props: { text: '${state.artifactTitle}' } },
        ],
      },
      { panelOpen: false },
    );

    render(
      <ChatServicesProvider value={{ transport: driver.transport }}>
        {runtime.render()}
      </ChatServicesProvider>,
    );

    fireEvent.change(document.querySelector('.pactor-chat-composer textarea')!, {
      target: { value: 'hi' },
    });
    fireEvent.keyDown(document.querySelector('.pactor-chat-composer textarea')!, {
      key: 'Enter',
    });
    driver.push({
      type: 'artifact',
      messageId: 'x',
      artifact: MARKDOWN_ARTIFACT,
    });
    await screen.findByText('回显：分析报告');
    // 框架未擅自开面板
    expect(document.querySelector('.pactor-chat-inspector')).toBeNull();
    driver.push({ type: 'message.end', messageId: 'x' });
    driver.complete();
    await runtime.destroy();
  });

  it('onOpenArtifact 事件：受控 DSL 场景点击卡片打开按钮 → setState 重开面板（spec scenario: 卡片点击触发动作）', async () => {
    const driver = createManualDriver();
    // 典型接法：onArtifact 首次自动开、onPanelClose 关闭、
    // onOpenArtifact 卡片重开（fix-artifact-card-open）
    const runtime = createRuntime(
      {
        type: 'Chat',
        props: {
          artifact: '${state.artifact}',
          panelOpen: '${state.panelOpen}',
        },
        events: {
          onArtifact: [
            { action: 'setState', params: { panelOpen: true } },
          ],
          onPanelClose: [
            { action: 'setState', params: { panelOpen: false } },
          ],
          onOpenArtifact: [
            { action: 'setState', params: { panelOpen: true } },
          ],
        },
      },
      { panelOpen: false },
    );

    render(
      <ChatServicesProvider value={{ transport: driver.transport }}>
        {runtime.render()}
      </ChatServicesProvider>,
    );

    fireEvent.change(document.querySelector('.pactor-chat-composer textarea')!, {
      target: { value: 'hi' },
    });
    fireEvent.keyDown(document.querySelector('.pactor-chat-composer textarea')!, {
      key: 'Enter',
    });
    driver.push({
      type: 'artifact',
      messageId: 'x',
      artifact: MARKDOWN_ARTIFACT,
    });
    await vi.waitFor(() => {
      expect(document.querySelector('.pactor-chat-inspector')).toBeTruthy();
    });

    // 关面板 → 点击卡片"在面板中打开" → onOpenArtifact → setState 重开
    fireEvent.click(screen.getByRole('button', { name: '关闭面板' }));
    await vi.waitFor(() => {
      expect(document.querySelector('.pactor-chat-inspector')).toBeNull();
    });
    fireEvent.click(screen.getByRole('button', { name: '在面板中打开' }));
    await vi.waitFor(() => {
      expect(document.querySelector('.pactor-chat-inspector')).toBeTruthy();
    });

    driver.push({ type: 'message.end', messageId: 'x' });
    driver.complete();
    await runtime.destroy();
  });

  it('回归：onArtifact 开面板 → onPanelClose setState 关闭后保持关闭（不被历史 ready part 重放重新打开）', async () => {
    const driver = createManualDriver();
    // 典型 DSL 接法（决策 D4）：onArtifact → setState 开面板，
    // onPanelClose → setState 关面板
    const runtime = createRuntime(
      {
        type: 'Chat',
        props: {
          artifact: '${state.artifact}',
          panelOpen: '${state.panelOpen}',
        },
        events: {
          onArtifact: [
            { action: 'setState', params: { panelOpen: true } },
          ],
          onPanelClose: [
            { action: 'setState', params: { panelOpen: false } },
          ],
        },
      },
      { panelOpen: false },
    );

    render(
      <ChatServicesProvider value={{ transport: driver.transport }}>
        {runtime.render()}
      </ChatServicesProvider>,
    );

    // artifact part 就绪 → onArtifact → setState 开面板
    fireEvent.change(document.querySelector('.pactor-chat-composer textarea')!, {
      target: { value: 'hi' },
    });
    fireEvent.keyDown(document.querySelector('.pactor-chat-composer textarea')!, {
      key: 'Enter',
    });
    driver.push({
      type: 'artifact',
      messageId: 'x',
      artifact: MARKDOWN_ARTIFACT,
    });
    await vi.waitFor(() => {
      expect(document.querySelector('.pactor-chat-inspector')).toBeTruthy();
    });

    // 关闭面板 → setState panelOpen=false；关闭后 ChatView 不重挂载，
    // onArtifact 去重记录保留，历史 ready part 不重放 → 面板保持关闭
    fireEvent.click(screen.getByRole('button', { name: '关闭面板' }));
    await vi.waitFor(() => {
      expect(document.querySelector('.pactor-chat-inspector')).toBeNull();
    });
    // 留一个宏任务窗口：若发生重放，面板会在此期间被重新打开
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(document.querySelector('.pactor-chat-inspector')).toBeNull();

    driver.push({ type: 'message.end', messageId: 'x' });
    driver.complete();
    await runtime.destroy();
  });
});
