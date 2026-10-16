// @vitest-environment jsdom
import './setup.js';

import { Registry, type PageDsl } from '@pactor-app/core';
import { createPageRuntime } from '@pactor-app/runtime';
import { createComponentRegistry } from '@pactor-app/ui/components';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ArtifactPanel,
  ArtifactStore,
  buildArtifactTree,
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
  const source = createComponentRegistry();
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

  it('code 产出物：只读代码块（language 供高亮，header 展示 kind 角标）', () => {
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
    const pre = container.querySelector('[data-slot=artifact-panel] pre')!;
    expect(pre.textContent).toContain('SELECT 1;');
    // header kind 角标
    const header = document.querySelector('.pactor-chat-inspector__header')!;
    expect(header.textContent).toContain('code');
  });

  it('text 产出物：预格式文本', () => {
    const { container } = render(
      <ArtifactPanel
        artifact={{ id: 'a3', kind: 'text', title: '纪要', content: '第一行\n第二行' }}
      />,
    );
    const pre = container.querySelector('[data-slot=artifact-panel-text]')!;
    expect(pre.textContent).toBe('第一行\n第二行');
  });

  it('拖拽调宽：手柄左拖变宽（spec scenario: 拖拽调宽）', () => {
    // jsdom 无布局：面板 480、宿主容器 1000（mock getBoundingClientRect）
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        const width = this.classList?.contains('pactor-chat-inspector')
          ? 480
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
    // 480 + (500-400) = 580（上限 min(600, 容器 1000 的 2/3 ≈ 666.7)，未触顶）
    expect((panel as HTMLElement).style.width).toBe('580px');
    // 拖拽期间禁文本选择
    expect(document.body.style.userSelect).toBe('none');

    fireEvent.pointerUp(document);
    expect(document.body.style.userSelect).toBe('');
    rectSpy.mockRestore();
  });

  it('拖拽夹取上限：左拖超过 600px 上限后保持 600px（spec scenario: 拖拽夹取上限）', () => {
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        const width = this.classList?.contains('pactor-chat-inspector')
          ? 560
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
    // 560 + (500-(-900)) = 1960 → 夹取 min(600, 1000*2/3 ≈ 666.7) → 600
    fireEvent.pointerMove(document, { clientX: -900 });
    expect((panel as HTMLElement).style.width).toBe('600px');
    fireEvent.pointerUp(document);
    rectSpy.mockRestore();
  });

  it('拖拽夹取上限：窄 host 下 2/3 低于 600px 时保持 host 宽 2/3', () => {
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        const width = this.classList?.contains('pactor-chat-inspector')
          ? 480
          : 780;
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
    // 480 + (500-(-400)) = 1380 → 夹取 min(600, 780*2/3 = 520) → 520
    fireEvent.pointerMove(document, { clientX: -400 });
    expect((panel as HTMLElement).style.width).toBe('520px');
    fireEvent.pointerUp(document);
    rectSpy.mockRestore();
  });

  it('拖拽夹取下限：右拖低于 480px 后保持 480px（spec scenario: 拖拽夹取下限）', () => {
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        const width = this.classList?.contains('pactor-chat-inspector')
          ? 560
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
    expect((panel as HTMLElement).style.width).toBe('480px');
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
    await screen.findByText(/该组件不允许在产物预览中使用/);
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
    await screen.findByText(/DSL 产物渲染失败/);
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
  it('消息流内产出物卡片：整卡可点击——着色图标盒 + 标题 + 元信息 + 箭头，而非原始 JSON（spec scenario）', () => {
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
    // 整卡即按钮（aria-label 带产物标题）
    expect(card.tagName).toBe('BUTTON');
    // 文件类型图标盒（扩展名优先，kind 兜底 → markdown 无扩展名得 file-text/slate）
    expect(card.querySelector('.pactor-chat-artifact-card__icon')).toBeTruthy();
    expect(card.className).toContain('pactor-chat-artifact-card--slate');
    expect(card.textContent).toContain('分析报告');
    // 元信息行：类型标签（无扩展名时 kind 大写）
    expect(card.textContent).toContain('MARKDOWN');
    // 右上箭头
    expect(card.querySelector('.pactor-chat-artifact-card__arrow')).toBeTruthy();
    // 不渲染原始 JSON
    expect(screen.queryByText(/"kind":/)).toBeNull();
  });

  it('卡片元信息：扩展名大写 + meta.size 尺寸（"尺寸 · 类型"）', () => {
    const store = new ConversationStore();
    store.appendMessage({
      id: 'a1',
      role: 'assistant',
      status: 'completed',
      parts: [
        {
          type: 'artifact',
          status: 'ready',
          artifact: {
            id: 'a2',
            kind: 'markdown',
            title: '本月经营月报.md',
            content: '# 月报',
            meta: { size: 3584 },
          },
        },
      ],
    });

    render(<ChatView store={store} />);
    const card = document.querySelector('.pactor-chat-artifact-card')!;
    expect(card.textContent).toContain('3.5 KB · MD');
    // 图标 tone 按文件类型修饰类挂在卡片根上
    expect(card.className).toContain('pactor-chat-artifact-card--slate');
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
    fireEvent.click(screen.getByRole('button', { name: /在面板中打开/ }));
    expect(onOpenArtifact).toHaveBeenCalledTimes(1);
    expect(onOpenArtifact).toHaveBeenCalledWith(MARKDOWN_ARTIFACT);
  });
});

describe('产物卡片组收起（spec: chat-artifact-panel / 卡片区收起）', () => {
  function buildArtifacts(count: number): ChatArtifact[] {
    return Array.from({ length: count }, (_, index) => ({
      id: `f${index + 1}`,
      kind: 'markdown' as const,
      title: `产物${index + 1}.md`,
      content: `# 产物${index + 1}`,
    }));
  }

  function artifactParts(artifacts: ChatArtifact[]) {
    return artifacts.map((artifact) => ({
      type: 'artifact' as const,
      status: 'ready' as const,
      artifact,
    }));
  }

  function appendArtifactMessage(
    store: ConversationStore,
    count: number,
  ): void {
    store.appendMessage({
      id: 'a1',
      role: 'assistant',
      status: 'completed',
      parts: artifactParts(buildArtifacts(count)),
    });
  }

  it('多于 4 个产物只展示 4 个 + 展开按钮；展开查看全部，可再收起', () => {
    const store = new ConversationStore();
    appendArtifactMessage(store, 6);
    render(<ChatView store={store} />);

    expect(
      document.querySelectorAll('.pactor-chat-artifact-card'),
    ).toHaveLength(4);
    fireEvent.click(screen.getByRole('button', { name: /展开/ }));
    expect(
      document.querySelectorAll('.pactor-chat-artifact-card'),
    ).toHaveLength(6);
    fireEvent.click(screen.getByRole('button', { name: /收起/ }));
    expect(
      document.querySelectorAll('.pactor-chat-artifact-card'),
    ).toHaveLength(4);
  });

  it('4 个及以下不收起（无 footer 按钮）', () => {
    const store = new ConversationStore();
    appendArtifactMessage(store, 4);
    render(<ChatView store={store} />);
    expect(
      document.querySelectorAll('.pactor-chat-artifact-card'),
    ).toHaveLength(4);
    expect(screen.queryByRole('button', { name: /展开/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /查看所有产物/ })).toBeNull();
  });

  it('非连续 artifact part 不并组（被文本分隔的两段各自成组）', () => {
    const store = new ConversationStore();
    const artifacts = buildArtifacts(6);
    store.appendMessage({
      id: 'a1',
      role: 'assistant',
      status: 'completed',
      parts: [
        ...artifactParts(artifacts.slice(0, 3)),
        { type: 'text', content: '分隔' },
        ...artifactParts(artifacts.slice(3)),
      ],
    });
    render(<ChatView store={store} />);
    // 3 + 3 均不超阈值：全部展示、无收起 footer
    expect(
      document.querySelectorAll('.pactor-chat-artifact-card'),
    ).toHaveLength(6);
    expect(screen.queryByRole('button', { name: /展开/ })).toBeNull();
  });

  it('"查看所有产物(n)"触发 onOpenArtifactList 回调', () => {
    const onOpenArtifactList = vi.fn();
    const store = new ConversationStore();
    appendArtifactMessage(store, 6);
    render(<ChatView store={store} onOpenArtifactList={onOpenArtifactList} />);
    fireEvent.click(
      screen.getByRole('button', { name: /查看所有产物\(6\)/ }),
    );
    expect(onOpenArtifactList).toHaveBeenCalledTimes(1);
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
    // __main 左列（对话区）与面板在 host 行内容器内同级
    const row = host.querySelector(
      ':scope > .pactor-chat-inspector-host__row',
    )!;
    const mainCol = row.querySelector(
      ':scope > .pactor-chat-inspector-host__main',
    )!;
    expect(mainCol.querySelector(':scope > .pactor-chat-workspace')).toBeTruthy();
    const panel = row.querySelector(':scope > .pactor-chat-inspector')!;
    expect(panel).toBeTruthy();
    expect(panel.textContent).toContain('分析报告');
  });

  it('工作区 header 收进 __main 左列（随 __main 通栏，不覆盖面板上方）', () => {
    renderChat(
      <Chat artifact={MARKDOWN_ARTIFACT} panelOpen title="助手工作区" />,
    );
    const host = document.querySelector('.pactor-chat-inspector-host')!;
    // header 不是 host 直接子级（不通栏横跨面板）
    expect(
      host.querySelector(':scope > .pactor-chat-workspace__header'),
    ).toBeNull();
    // header 在 __main 左列内、对话区之前
    const mainCol = host.querySelector('.pactor-chat-inspector-host__main')!;
    const header = mainCol.querySelector(
      ':scope > .pactor-chat-workspace__header',
    );
    expect(header).toBeTruthy();
    // header 不在限宽的对话列内
    expect(
      document.querySelector(
        '.pactor-chat-workspace .pactor-chat-workspace__header',
      ),
    ).toBeNull();
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
    await screen.findByRole('button', { name: /在面板中打开/ });
    expect(document.querySelector('.pactor-chat-inspector')).toBeNull();

    // 点击卡片按钮 → 面板以该 artifact 打开
    fireEvent.click(screen.getByRole('button', { name: /在面板中打开/ }));
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
      await screen.findByRole('button', { name: /在面板中打开/ }),
    );
    expect(onOpenArtifact).toHaveBeenCalledTimes(1);
    expect(onOpenArtifact).toHaveBeenCalledWith(MARKDOWN_ARTIFACT);
    expect(document.querySelector('.pactor-chat-inspector')).toBeNull();
  });

  it('非受控："查看所有产物"打开面板并定位产物目录视图（spec scenario）', async () => {
    const driver = createManualDriver();
    render(
      <ChatServicesProvider value={{ transport: driver.transport }}>
        <Chat />
      </ChatServicesProvider>,
    );

    fireEvent.change(document.querySelector('.pactor-chat-composer textarea')!, {
      target: { value: '给我报告' },
    });
    fireEvent.keyDown(document.querySelector('.pactor-chat-composer textarea')!, {
      key: 'Enter',
    });
    for (let index = 1; index <= 6; index += 1) {
      driver.push({
        type: 'artifact',
        messageId: 'x',
        partId: `p${index}`,
        artifact: {
          id: `f${index}`,
          kind: 'markdown',
          title: `产物${index}.md`,
          content: `# 产物${index}`,
        },
      });
    }
    driver.push({ type: 'message.end', messageId: 'x' });
    driver.complete();

    // 框架不擅自开面板：卡片组收起为 4 张 + footer
    const all = await screen.findByRole('button', { name: /查看所有产物\(6\)/ });
    expect(document.querySelector('.pactor-chat-inspector')).toBeNull();
    expect(
      document.querySelectorAll('.pactor-chat-artifact-card'),
    ).toHaveLength(4);

    // 点击"查看所有产物" → 面板打开并定位产物目录视图
    fireEvent.click(all);
    await screen.findByText('产物目录');
    expect(document.querySelector('.pactor-chat-inspector')).toBeTruthy();
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
    fireEvent.click(screen.getByRole('button', { name: /在面板中打开/ }));
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

describe('ArtifactPanel 多产物（tabs / 目录列表视图）', () => {
  const CODE_ARTIFACT: ChatArtifact = {
    id: 'a2',
    kind: 'code',
    title: '生成脚本',
    content: 'echo hi',
    language: 'bash',
  };
  const NESTED_ARTIFACT: ChatArtifact = {
    id: 'reports/q3/monthly',
    kind: 'markdown',
    title: 'Q3 月报',
    content: '# Q3',
  };
  const ALL = [MARKDOWN_ARTIFACT, CODE_ARTIFACT, NESTED_ARTIFACT];

  it('buildArtifactTree：id 的 / 分段建目录层级，无分段平铺根层', () => {
    const tree = buildArtifactTree(ALL);
    // 根层：目录 reports 在前（目录优先），两个文件在后
    expect(tree.map((n) => n.name)).toEqual(['reports', '分析报告', '生成脚本']);
    const reports = tree[0]!;
    expect(reports.artifact).toBeUndefined();
    expect(reports.children.map((n) => n.name)).toEqual(['q3']);
    expect(reports.children[0]!.children[0]!.artifact?.id).toBe(
      'reports/q3/monthly',
    );
  });

  it('多产物时 header 文件名处为切换下拉，点击菜单项切换', async () => {
    const onSelect = vi.fn();
    render(
      <ArtifactPanel
        artifact={MARKDOWN_ARTIFACT}
        artifacts={ALL}
        activeArtifactId="a1"
        onSelectArtifact={onSelect}
      />,
    );
    // 不再有 tab 条；触发器展示当前产物名
    expect(document.querySelector('.pactor-chat-inspector__tab')).toBeNull();
    const trigger = document.querySelector(
      '.pactor-chat-inspector__menu-trigger',
    )!;
    expect(trigger.textContent).toContain('分析报告');

    // 打开下拉 → 列出全部产物 → 点击切换
    fireEvent.click(trigger);
    await screen.findByText('生成脚本');
    fireEvent.click(screen.getByText('生成脚本'));
    expect(onSelect).toHaveBeenCalledWith(CODE_ARTIFACT);
  });

  it('未提供 artifacts 时文件名处为纯标题（无下拉）', () => {
    render(<ArtifactPanel artifact={MARKDOWN_ARTIFACT} />);
    expect(
      document.querySelector('.pactor-chat-inspector__menu-trigger'),
    ).toBeNull();
    expect(screen.queryByRole('button', { name: '产物目录' })).toBeNull();
  });

  it('header 左端目录钮切换到目录列表视图，点击产物查看内容；列表视图隐藏返回钮且标题显示"产物目录"', () => {
    const onSelect = vi.fn();
    render(
      <ArtifactPanel
        artifact={MARKDOWN_ARTIFACT}
        artifacts={ALL}
        activeArtifactId="a1"
        onSelectArtifact={onSelect}
      />,
    );
    // 内容视图：markdown 正文在，列表不在
    expect(document.querySelector('[data-slot=artifact-panel-list]')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: '产物目录' }));
    // 列表视图：目录树渲染（reports 目录 + 根层产物）；
    // 返回钮隐藏，文件名处显示"产物目录"，kind 角标隐藏
    expect(document.querySelector('[data-slot=artifact-panel-list]')).toBeTruthy();
    expect(screen.getByText('reports')).toBeTruthy();
    expect(
      document.querySelector('.pactor-chat-inspector__list-toggle'),
    ).toBeNull();
    expect(
      document.querySelector('.pactor-chat-inspector__menu-trigger')
        ?.textContent,
    ).toContain('产物目录');
    expect(
      document.querySelector(
        '.pactor-chat-inspector__header .pactor-chat-inspector__kind',
      ),
    ).toBeNull();
    const listTitles = [
      ...document.querySelectorAll('[data-slot=artifact-panel-list-item]'),
    ].map((el) => el.textContent ?? '');
    expect(listTitles.some((text) => text.includes('分析报告'))).toBe(true);

    // 目录展开（默认展开）：嵌套产物可见，点击触发切换
    const nested = [
      ...document.querySelectorAll('[data-slot=artifact-panel-list-item]'),
    ].find((el) => el.textContent?.includes('Q3 月报'))!;
    fireEvent.click(nested.closest('button')!);
    expect(onSelect).toHaveBeenCalledWith(NESTED_ARTIFACT);
  });

  it('未提供 artifacts 时不渲染目录钮（单产物受控场景不变）', () => {
    render(<ArtifactPanel artifact={MARKDOWN_ARTIFACT} />);
    expect(screen.queryByRole('button', { name: '产物目录' })).toBeNull();
    expect(document.querySelector('.pactor-chat-inspector__tabs')).toBeNull();
  });

  it('激活产物变化自动回到内容视图', () => {
    const { rerender } = render(
      <ArtifactPanel
        artifact={MARKDOWN_ARTIFACT}
        artifacts={ALL}
        activeArtifactId="a1"
        onSelectArtifact={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '产物目录' }));
    expect(document.querySelector('[data-slot=artifact-panel-list]')).toBeTruthy();

    rerender(
      <ArtifactPanel
        artifact={CODE_ARTIFACT}
        artifacts={ALL}
        activeArtifactId="a2"
        onSelectArtifact={() => {}}
      />,
    );
    expect(document.querySelector('[data-slot=artifact-panel-list]')).toBeNull();
    // CodeBlock 高亮会把代码拆成多个 span，按容器文本断言
    expect(
      document.querySelector('[data-slot=artifact-panel]')!.textContent,
    ).toContain('echo hi');
  });

  it('非受控组合层：多产物经内部 store 驱动下拉切换', async () => {
    const store = new ConversationStore();
    const artifactStore = new ArtifactStore();
    artifactStore.open(MARKDOWN_ARTIFACT);
    artifactStore.open(CODE_ARTIFACT);
    render(
      <ChatServicesProvider
        value={{
          transport: createManualDriver().transport,
          store,
          artifactStore,
        }}
      >
        <Chat />
      </ChatServicesProvider>,
    );
    // 触发器展示当前激活产物（后打开的 CODE）
    const trigger = document.querySelector(
      '.pactor-chat-inspector__menu-trigger',
    )!;
    expect(trigger.textContent).toContain('生成脚本');

    // 下拉切到第一个产物 → 内容区展示其 markdown
    fireEvent.click(trigger);
    const item = await screen.findByText('分析报告');
    fireEvent.click(item);
    expect(
      document.querySelector('.pactor-chat-inspector__menu-trigger')
        ?.textContent,
    ).toContain('分析报告');
  });
});

describe('ArtifactPanel 常见文件预览与自定义查看器', () => {
  it('txt / 无扩展名文本：kind text 预格式渲染（现状保持）', () => {
    render(
      <ArtifactPanel
        artifact={{ id: 'f1', kind: 'text', title: '说明.txt', content: '纯文本内容' }}
      />,
    );
    const pre = document.querySelector('[data-slot=artifact-panel-text]')!;
    expect(pre.textContent).toBe('纯文本内容');
  });

  it('图片类：title 扩展名命中即按图片渲染（content 为 URL）', () => {
    render(
      <ArtifactPanel
        artifact={{
          id: 'img1',
          kind: 'text',
          title: '架构图.png',
          content: 'https://example.com/arch.png',
        }}
      />,
    );
    const img = document.querySelector(
      '[data-slot=artifact-panel-image] img',
    ) as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.src).toBe('https://example.com/arch.png');
    expect(img.alt).toBe('架构图.png');
    // 不再按 text 预格式渲染
    expect(document.querySelector('[data-slot=artifact-panel-text]')).toBeNull();
  });

  it('显式 fileType 优先于 title；svg 原始标记经 data URL 呈现', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10"/></svg>';
    render(
      <ArtifactPanel
        artifact={{
          id: 'img2',
          kind: 'text',
          title: '图标',
          fileType: 'SVG',
          content: svg,
        }}
      />,
    );
    const img = document.querySelector(
      '[data-slot=artifact-panel-image] img',
    ) as HTMLImageElement;
    expect(img.src.startsWith('data:image/svg+xml;utf8,')).toBe(true);
    expect(decodeURIComponent(img.src)).toContain('<svg');
  });

  it('自定义查看器按扩展名命中，优先于内建图片渲染', () => {
    render(
      <ArtifactPanel
        artifact={{
          id: 'img3',
          kind: 'text',
          title: '数据.png',
          content: 'https://example.com/d.png',
        }}
        artifactViewers={{
          png: (artifact) => <div data-testid="custom-png">{artifact.title} 自定义预览</div>,
        }}
      />,
    );
    expect(screen.getByTestId('custom-png').textContent).toContain(
      '数据.png 自定义预览',
    );
    expect(document.querySelector('[data-slot=artifact-panel-image]')).toBeNull();
  });

  it('自定义查看器按 kind 命中；扩展名键优先于 kind 键', () => {
    render(
      <ArtifactPanel
        artifact={{
          id: 'doc1',
          kind: 'markdown',
          title: '报告.md',
          content: '# 正文',
        }}
        artifactViewers={{
          markdown: () => <div data-testid="kind-viewer">kind 查看器</div>,
          md: () => <div data-testid="ext-viewer">扩展名查看器</div>,
        }}
      />,
    );
    expect(screen.getByTestId('ext-viewer')).toBeTruthy();
    expect(screen.queryByTestId('kind-viewer')).toBeNull();
  });

  it('services.artifactViewers 注入：组合层面板生效', async () => {
    const store = new ConversationStore();
    const artifactStore = new ArtifactStore();
    artifactStore.open({
      id: 'w1',
      kind: 'text',
      title: '配置.yaml',
      content: 'a: 1',
    });
    render(
      <ChatServicesProvider
        value={{
          transport: createManualDriver().transport,
          store,
          artifactStore,
          artifactViewers: {
            yaml: (artifact) => (
              <div data-testid="yaml-viewer">YAML 预览：{artifact.title}</div>
            ),
          },
        }}
      >
        <Chat />
      </ChatServicesProvider>,
    );
    expect(screen.getByTestId('yaml-viewer').textContent).toContain(
      '配置.yaml',
    );
  });

  it('面板背景令牌：--pactor-chat-inspector-bg 区别于 --pactor-chat-bg', () => {
    const css = readFileSync(join(__dirname, '../styles.css'), 'utf8');
    expect(css).toContain('--pactor-chat-inspector-bg:');
    expect(css).toMatch(
      /\.pactor-chat-inspector\s*\{[^}]*background:\s*var\(--pactor-chat-inspector-bg\)/,
    );
  });
});

describe('ArtifactPanel 产物下载', () => {
  function stubObjectUrl(): void {
    // jsdom 无 URL.createObjectURL
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: vi.fn(() => 'blob:mock'),
      revokeObjectURL: vi.fn(),
    });
  }

  it('文件名：title 带扩展名原样；无扩展名按 fileType / kind 补齐', async () => {
    const { resolveArtifactFilename } = await import('../src/index.js');
    expect(
      resolveArtifactFilename({ ...MARKDOWN_ARTIFACT, title: '报告.md' }),
    ).toBe('报告.md');
    expect(resolveArtifactFilename(MARKDOWN_ARTIFACT)).toBe('分析报告.md');
    expect(
      resolveArtifactFilename({
        id: 'c1',
        kind: 'text',
        title: '架构图',
        fileType: 'png',
        content: 'https://x/a.png',
      }),
    ).toBe('架构图.png');
    expect(
      resolveArtifactFilename({
        id: 'd1',
        kind: 'dsl',
        title: '面板',
        content: { type: 'Flex' },
      }),
    ).toBe('面板.json');
  });

  it('Blob 构建：markdown 文本、dsl JSON、svg 原始标记', async () => {
    const { buildArtifactBlob } = await import('../src/index.js');
    const mdBlob = buildArtifactBlob(MARKDOWN_ARTIFACT)!;
    expect(mdBlob.type).toContain('text/markdown');
    expect(await mdBlob.text()).toBe('## 结论\n\n一切正常');

    const dslBlob = buildArtifactBlob({
      id: 'd1',
      kind: 'dsl',
      title: '面板',
      content: { type: 'Flex', children: [] },
    })!;
    expect(dslBlob.type).toBe('application/json');
    expect(JSON.parse(await dslBlob.text())).toEqual({
      type: 'Flex',
      children: [],
    });

    const svgBlob = buildArtifactBlob({
      id: 's1',
      kind: 'text',
      title: '图标.svg',
      content: '<svg xmlns="http://www.w3.org/2000/svg"/>',
    })!;
    expect(svgBlob.type).toBe('image/svg+xml');
  });

  it('点击 header 下载钮触发本地下载（文件名 + Blob）', () => {
    stubObjectUrl();
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});
    render(<ArtifactPanel artifact={MARKDOWN_ARTIFACT} />);

    fireEvent.click(screen.getByRole('button', { name: '下载产物' }));
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    // 临时锚点携带下载文件名（点击后即移除，从 mock 调用记录中断言）
    clickSpy.mockRestore();
    vi.unstubAllGlobals();
  });

  it('下载文件名写入锚点 download 属性', () => {
    stubObjectUrl();
    const appended: HTMLAnchorElement[] = [];
    const original = document.body.appendChild.bind(document.body);
    const appendSpy = vi
      .spyOn(document.body, 'appendChild')
      .mockImplementation((node) => {
        if (node instanceof HTMLAnchorElement && node.download) {
          appended.push(node);
          return node;
        }
        return original(node);
      });
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    render(<ArtifactPanel artifact={MARKDOWN_ARTIFACT} />);

    fireEvent.click(screen.getByRole('button', { name: '下载产物' }));
    expect(appended[0]?.download).toBe('分析报告.md');
    appendSpy.mockRestore();
    vi.unstubAllGlobals();
  });

  it('无激活产物时不渲染下载钮', () => {
    render(<ArtifactPanel artifact={null} inspector={<div>自定义</div>} />);
    expect(screen.queryByRole('button', { name: '下载产物' })).toBeNull();
  });
});
