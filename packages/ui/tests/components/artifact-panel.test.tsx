// @vitest-environment jsdom
/**
 * ArtifactPanel 产物预览面板契约：kind 分发内建渲染（markdown / code /
 * text / 图片 / dsl 活预览）、自定义查看器优先级、目录树列表视图、
 * 下载、白名单守卫与受控降级。
 */
import { Registry } from '@pactor-app/core';
import type { DslNode } from '@pactor-app/core';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { createComponentRegistry } from '../../src/components/index.js';
import { buildArtifactTree } from '../../src/components/chat/ArtifactPanel/artifact.js';
import type { ChatPageArtifact } from '../../src/components/chat/ArtifactPanel/artifact.js';
import {
  buildArtifactBlob,
  resolveArtifactFilename,
} from '../../src/components/chat/ArtifactPanel/download.js';
import { ArtifactPanel } from '../../src/components/chat/ArtifactPanel/index.js';
import {
  expectEventState,
  renderDslWith,
  type RenderDslResult,
} from './helpers.js';

function renderDsl(node: DslNode): RenderDslResult {
  return renderDslWith(createComponentRegistry(), node);
}

const MD_ARTIFACT: ChatPageArtifact = {
  id: 'reports/月报.md',
  kind: 'markdown',
  title: '月报.md',
  content: '# 月报',
};

function renderPanel(
  props: Record<string, unknown>,
  events?: DslNode['events'],
): RenderDslResult {
  return renderDsl({ type: 'ArtifactPanel', props, events });
}

describe('ArtifactPanel 内建渲染器', () => {
  it('markdown 产物安全渲染', () => {
    renderPanel({ artifact: MD_ARTIFACT });
    expect(screen.getByRole('heading', { name: '月报' })).toBeTruthy();
  });

  it('code 产物经 CodeBlock 渲染', () => {
    const { container } = renderPanel({
      artifact: {
        id: 'a.ts',
        kind: 'code',
        title: 'a.ts',
        language: 'ts',
        content: 'const answer = 42;',
      },
    });
    expect(container.querySelector('[data-slot=artifact-panel]')!.textContent).toContain(
      'const answer = 42;',
    );
  });

  it('text 产物预格式渲染', () => {
    const { container } = renderPanel({
      artifact: { id: 'note', kind: 'text', title: '便签', content: '第一行\n第二行' },
    });
    const pre = container.querySelector('[data-slot=artifact-panel-text]')!;
    expect(pre.textContent).toBe('第一行\n第二行');
  });

  it('图片产物（扩展名识别）渲染 <img>；svg 原始标记走 data URL', () => {
    const { container, unmount } = renderPanel({
      artifact: {
        id: 'chart.png',
        kind: 'text',
        title: 'chart.png',
        content: 'https://example.com/chart.png',
      },
    });
    const img = container.querySelector('[data-slot=artifact-panel-image] img')!;
    expect(img.getAttribute('src')).toBe('https://example.com/chart.png');
    unmount();

    const { container: c2 } = renderPanel({
      artifact: {
        id: 'icon.svg',
        kind: 'text',
        title: 'icon.svg',
        content: '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
      },
    });
    const svgImg = c2.querySelector('[data-slot=artifact-panel-image] img')!;
    expect(svgImg.getAttribute('src')!.startsWith('data:image/svg+xml')).toBe(true);
  });

  it('无产物时展示空态文案与标题兜底', () => {
    renderPanel({ title: '产物', emptyText: '暂无产物' });
    expect(screen.getByText('产物')).toBeTruthy();
    expect(screen.getByText('暂无产物')).toBeTruthy();
  });

  it('onClose 经关闭钮传出', async () => {
    const { container, context } = renderPanel(
      { artifact: MD_ARTIFACT },
      { onClose: { action: 'setState', params: { closed: true } } },
    );
    fireEvent.click(container.querySelector('.lucide-x')!.closest('button')!);
    await expectEventState(context, 'closed', true);
  });
});

describe('ArtifactPanel 自定义查看器', () => {
  const viewers = {
    md: (artifact: ChatPageArtifact): ReactNode => (
      <div data-slot="custom-md-viewer">自定义：{artifact.title}</div>
    ),
    markdown: (): ReactNode => <div data-slot="kind-viewer">kind 查看器</div>,
  };

  it('扩展名键优先于 kind 键与内建渲染器', () => {
    render(
      <ArtifactPanel artifact={MD_ARTIFACT} artifactViewers={viewers} />,
    );
    expect(screen.getByText('自定义：月报.md')).toBeTruthy();
    expect(screen.queryByRole('heading', { name: '月报' })).toBeNull();
  });

  it('扩展名无命中时回落 kind 键', () => {
    render(
      <ArtifactPanel
        artifact={{ id: 'a1', kind: 'markdown', title: '无扩展名', content: '# x' }}
        artifactViewers={viewers}
      />,
    );
    expect(screen.getByText('kind 查看器')).toBeTruthy();
  });
});

describe('ArtifactPanel 目录树与列表视图', () => {
  it('buildArtifactTree 按 id 分段建目录层级，目录先于文件、各自按名称排序', () => {
    const tree = buildArtifactTree([
      { id: 'reports/q3/月报.md', kind: 'markdown', title: '月报.md', content: '' },
      { id: 'reports/q2/季报.md', kind: 'markdown', title: '季报.md', content: '' },
      { id: 'readme.md', kind: 'markdown', title: 'readme.md', content: '' },
    ]);
    expect(tree.map((node) => node.name)).toEqual(['reports', 'readme.md']);
    const reports = tree[0]!;
    expect(reports.children.map((node) => node.name)).toEqual(['q2', 'q3']);
    expect(reports.children[0]!.children[0]!.artifact?.title).toBe('季报.md');
  });

  it('目录切换钮切列表视图；点击产物行经 onSelectArtifact 传出 id', async () => {
    const { container, context } = renderPanel(
      {
        artifact: MD_ARTIFACT,
        artifacts: [
          MD_ARTIFACT,
          { id: 'reports/季报.md', kind: 'markdown', title: '季报.md', content: '# 季报' },
        ],
        activeArtifactId: 'reports/月报.md',
      },
      { onSelectArtifact: { action: 'setState', params: { selected: '${event}' } } },
    );

    // 内容视图 → 列表视图
    fireEvent.click(container.querySelector('.lucide-list')!.closest('button')!);
    expect(screen.getByText('产物目录')).toBeTruthy();
    // 目录节点 + 产物行
    expect(container.querySelector('[data-slot=artifact-panel-list-folder]')!.textContent).toContain('reports');
    fireEvent.click(screen.getByText('季报.md'));
    await expectEventState(context, 'selected', 'reports/季报.md');
  });

  it('标题处产物切换下拉：选择经 onSelectArtifact 传出 id', async () => {
    const { context } = renderPanel(
      {
        artifact: MD_ARTIFACT,
        artifacts: [
          MD_ARTIFACT,
          { id: 'b2', kind: 'text', title: '便签.txt', content: 'hello' },
        ],
        activeArtifactId: 'reports/月报.md',
      },
      { onSelectArtifact: { action: 'setState', params: { picked: '${event}' } } },
    );

    fireEvent.click(screen.getByText('月报.md'));
    fireEvent.click(await screen.findByText('便签.txt'));
    await expectEventState(context, 'picked', 'b2');
  });
});

describe('ArtifactPanel 下载', () => {
  it('文件名规则：title 带扩展名原样；否则补 fileType / kind 缺省扩展名', () => {
    expect(resolveArtifactFilename(MD_ARTIFACT)).toBe('月报.md');
    expect(
      resolveArtifactFilename({ id: 'a', kind: 'markdown', title: '月报', content: '' }),
    ).toBe('月报.md');
    expect(
      resolveArtifactFilename({
        id: 'a',
        kind: 'text',
        title: '数据',
        fileType: '.CSV',
        content: '',
      }),
    ).toBe('数据.csv');
    expect(
      resolveArtifactFilename({ id: 'a', kind: 'dsl', title: '页面', content: {} as never }),
    ).toBe('页面.json');
  });

  it('dsl 产物 Blob 为格式化 JSON', async () => {
    const node = { type: 'Text', props: { text: 'hi' } };
    const blob = buildArtifactBlob({
      id: 'a',
      kind: 'dsl',
      title: '页面',
      content: node,
    })!;
    expect(blob.type).toBe('application/json');
    expect(await blob.text()).toBe(JSON.stringify(node, null, 2));
  });

  it('下载钮点击经 onDownload 传出当前产物；无产物不渲染下载钮', async () => {
    const artifact: ChatPageArtifact = {
      id: 'a1',
      kind: 'text',
      title: '便签.txt',
      content: 'hello',
    };
    const { container, context } = renderPanel(
      { artifact },
      { onDownload: { action: 'setState', params: { downloaded: '${event}' } } },
    );
    fireEvent.click(container.querySelector('.lucide-download')!.closest('button')!);
    await vi.waitFor(() => {
      expect(context.state.get('downloaded')).toEqual(artifact);
    });

    const { container: c2 } = renderPanel({ artifact: null });
    expect(c2.querySelector('.lucide-download')).toBeNull();
  });
});

describe('ArtifactPanel dsl 活预览', () => {
  function previewRegistry(): Registry<unknown> {
    const registry = new Registry<unknown>('PreviewRegistry');
    registry.register('PlainText', ({ text }: { text?: string }) => (
      <span>{text}</span>
    ));
    registry.register('Boom', (): ReactNode => {
      throw new Error('boom');
    });
    return registry;
  }

  it('白名单内组件活预览渲染', () => {
    render(
      <ArtifactPanel
        artifact={{
          id: 'p1',
          kind: 'dsl',
          title: '页面',
          content: { type: 'PlainText', props: { text: '活预览内容' } },
        }}
        safeRegistry={previewRegistry()}
      />,
    );
    expect(screen.getByText('活预览内容')).toBeTruthy();
  });

  it('白名单外组件降级为受控占位块', () => {
    render(
      <ArtifactPanel
        artifact={{
          id: 'p2',
          kind: 'dsl',
          title: '页面',
          content: { type: 'Evil', props: {} },
        }}
        safeRegistry={previewRegistry()}
      />,
    );
    const denied = document.querySelector('[data-slot=artifact-denied]')!;
    expect(denied.textContent).toContain('该组件不允许在产物预览中使用：Evil');
  });

  it('渲染抛错经错误边界降级，不击穿面板', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <ArtifactPanel
        artifact={{
          id: 'p3',
          kind: 'dsl',
          title: '页面',
          content: { type: 'Boom', props: {} },
        }}
        safeRegistry={previewRegistry()}
      />,
    );
    expect(screen.getByText('DSL 产物渲染失败，已降级展示')).toBeTruthy();
    warn.mockRestore();
  });

  it('未注入 Safe Registry 时 dsl 内容渲染降级块；非法内容同样降级', () => {
    const { unmount } = render(
      <ArtifactPanel
        artifact={{
          id: 'p4',
          kind: 'dsl',
          title: '页面',
          content: { type: 'PlainText', props: {} },
        }}
      />,
    );
    expect(screen.getByText('DSL 预览不可用（未注入 Safe Registry）')).toBeTruthy();
    unmount();

    render(
      <ArtifactPanel
        artifact={{ id: 'p5', kind: 'dsl', title: '页面', content: 'not-a-node' }}
        safeRegistry={previewRegistry()}
      />,
    );
    expect(screen.getByText('DSL 产物内容无效')).toBeTruthy();
  });
});

describe('ChatPage 产物区集成', () => {
  it('产物区渲染 ArtifactPanel：列表切换与选择闭环', async () => {
    const { container, context } = renderDslWith(
      createComponentRegistry(),
      {
        type: 'ChatPage',
        props: {
          conversationTitle: '会话',
          messages: [],
          artifacts: [
            MD_ARTIFACT,
            { id: 'b2', kind: 'text', title: '便签.txt', content: 'hello' },
          ],
          defaultArtifactOpen: true,
        },
        events: {
          onSelectArtifact: { action: 'setState', params: { picked: '${event}' } },
        },
      },
    );

    const region = container.querySelector('[data-slot=chat-page-artifact]')!;
    expect(region.querySelector('[data-slot=artifact-panel]')).not.toBeNull();
    // 缺省展示最新产物
    expect(screen.getByText('便签.txt')).toBeTruthy();

    fireEvent.click(region.querySelector('.lucide-list')!.closest('button')!);
    fireEvent.click(screen.getByText('月报.md'));
    await expectEventState(context, 'picked', 'reports/月报.md');
  });

  it('面板关闭钮经 onArtifactOpenChange 闭环', async () => {
    const { container, context } = renderDslWith(
      createComponentRegistry(),
      {
        type: 'ChatPage',
        props: {
          conversationTitle: '会话',
          messages: [],
          artifacts: [MD_ARTIFACT],
          artifactOpen: true,
        },
        events: {
          onArtifactOpenChange: { action: 'setState', params: { open: '${event}' } },
        },
      },
    );

    const region = container.querySelector('[data-slot=chat-page-artifact]')!;
    fireEvent.click(region.querySelector('.lucide-x')!.closest('button')!);
    await expectEventState(context, 'open', false);
    // 受控：仅上报，不自行关闭
    expect(container.querySelector('[data-slot=chat-page-artifact]')).not.toBeNull();
  });
});
