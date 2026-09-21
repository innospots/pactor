// @vitest-environment jsdom
/**
 * 媒体与内容类组件契约（第七批）：
 * ImageViewer / Gallery / Video / Audio / FilePreview / DocumentPreview /
 * RichText / Markdown / CodeBlock / DiffViewer / JSONViewer 的
 * props 映射、交互行为与通用 props。
 */
import { fireEvent, screen } from '@testing-library/react';
import type { DslNode } from '@pactor-app/core';
import type { CreateRuntimeContextOptions } from '@pactor-app/runtime';
import { describe, expect, it, vi } from 'vitest';

import { createComponentRegistry } from '../../src/components/index.js';
import { diffLines } from '../../src/components/components/DiffViewer/index.js';
import { inferKind } from '../../src/components/components/FilePreview/index.js';
import {
  COMMON_PROPS_PROBE,
  expectCommonProps,
  expectEventState,
  renderDslWith,
  type RenderDslResult,
} from './helpers.js';

const COMMON_PROPS = COMMON_PROPS_PROBE;

function renderDsl(node: DslNode, options: CreateRuntimeContextOptions = {}): RenderDslResult {
  return renderDslWith(createComponentRegistry(), node, options);
}

describe('Video / Audio', () => {
  it('Video：src / poster / controls 透传，通用 props', () => {
    const { container } = renderDsl({
      type: 'Video',
      props: { src: 'a.mp4', poster: 'p.png', ...COMMON_PROPS },
    });

    const video = container.querySelector('[data-slot=video]') as HTMLVideoElement;
    expect(video.getAttribute('src')).toBe('a.mp4');
    expect(video.getAttribute('poster')).toBe('p.png');
    expect(video.controls).toBe(true);
    expectCommonProps(video);
  });

  it('Audio：controls 可关闭，通用 props', () => {
    const { container } = renderDsl({
      type: 'Audio',
      props: { src: 'a.mp3', controls: false, ...COMMON_PROPS },
    });

    const audio = container.querySelector('[data-slot=audio]') as HTMLAudioElement;
    expect(audio.controls).toBe(false);
    expectCommonProps(audio);
  });
});

describe('ImageViewer', () => {
  it('点击图片打开灯箱：缩放 / 旋转 / 复位 / 关闭（onClose 事件）', async () => {
    const { context } = renderDsl({
      type: 'ImageViewer',
      props: { src: 'a.png', alt: '样图' },
      events: { onClose: { action: 'setState', params: { closed: true } } },
    });

    fireEvent.click(screen.getByAltText('样图'));
    const lightbox = document.querySelector('[data-slot=image-lightbox]')!;
    expect(lightbox).not.toBeNull();

    const img = document.querySelector('[data-slot=image-lightbox-img]') as HTMLElement;
    fireEvent.click(screen.getByRole('button', { name: '放大' }));
    expect(img.style.transform).toContain('scale(1.5)');
    fireEvent.click(screen.getByRole('button', { name: '旋转' }));
    expect(img.style.transform).toContain('rotate(-90deg)');
    fireEvent.click(screen.getByRole('button', { name: '复位' }));
    expect(img.style.transform).toContain('scale(1)');
    expect(img.style.transform).toContain('rotate(0deg)');

    fireEvent.click(screen.getByRole('button', { name: '关闭预览' }));
    expect(document.querySelector('[data-slot=image-lightbox]')).toBeNull();
    await expectEventState(context, 'closed', true);
  });

  it('Esc 关闭灯箱；通用 props', () => {
    const { container } = renderDsl({
      type: 'ImageViewer',
      props: { src: 'a.png', alt: '样图', ...COMMON_PROPS },
    });

    fireEvent.click(screen.getByAltText('样图'));
    expect(document.querySelector('[data-slot=image-lightbox]')).not.toBeNull();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(document.querySelector('[data-slot=image-lightbox]')).toBeNull();
    expectCommonProps(container.querySelector('[data-slot=image-viewer]'));
  });
});

describe('Gallery', () => {
  const items = [
    { src: '1.png', alt: '图一', caption: '第一张' },
    { src: '2.png', alt: '图二' },
    { src: '3.png', alt: '图三' },
  ];

  it('栅格渲染 caption；点击打开灯箱并前后切换（序号联动）', () => {
    renderDsl({ type: 'Gallery', props: { items } });

    expect(screen.getByText('第一张')).toBeTruthy();

    fireEvent.click(screen.getByAltText('图一'));
    expect(document.querySelector('[data-slot=image-lightbox-indicator]')!.textContent).toBe('1 / 3');

    fireEvent.click(screen.getByRole('button', { name: '下一张' }));
    expect(document.querySelector('[data-slot=image-lightbox-indicator]')!.textContent).toBe('2 / 3');
    expect((document.querySelector('[data-slot=image-lightbox-img]') as HTMLImageElement).getAttribute('src')).toBe('2.png');

    fireEvent.click(screen.getByRole('button', { name: '上一张' }));
    expect(document.querySelector('[data-slot=image-lightbox-indicator]')!.textContent).toBe('1 / 3');
    // 首项无「上一张」按钮
    expect(screen.queryByRole('button', { name: '上一张' })).toBeNull();
  });

  it('columns 映射栅格列数；通用 props', () => {
    const { container } = renderDsl({
      type: 'Gallery',
      props: { items, columns: 4, ...COMMON_PROPS },
    });

    expect(container.querySelector('.grid')!.className).toContain('grid-cols-4');
    expectCommonProps(container.querySelector('[data-slot=gallery]'));
  });
});

describe('FilePreview', () => {
  it('inferKind 按 MIME / 扩展名推断类别', () => {
    expect(inferKind('a.png')).toBe('image');
    expect(inferKind(undefined, 'video/mp4')).toBe('video');
    expect(inferKind('a.mp3')).toBe('audio');
    expect(inferKind('README.md')).toBe('text');
    expect(inferKind('a.zip')).toBe('other');
  });

  it('text 类渲染内容；元信息行展示名称 / 大小 / 类型 / 下载链接', () => {
    renderDsl({
      type: 'FilePreview',
      props: { name: 'notes.md', fileSize: 2048, fileType: '.md', src: '/files/notes.md', content: '你好，世界' },
    });

    expect(screen.getByText('你好，世界')).toBeTruthy();
    expect(screen.getByText('notes.md')).toBeTruthy();
    expect(screen.getByText('2.0 KB')).toBeTruthy();
    const download = document.querySelector('[data-slot=file-preview-download]')!;
    expect(download.getAttribute('href')).toBe('/files/notes.md');
  });

  it('other 类展示占位图标；通用 props', () => {
    const { container } = renderDsl({
      type: 'FilePreview',
      props: { name: 'pack.zip', ...COMMON_PROPS },
    });

    const root = container.querySelector('[data-slot=file-preview]')!;
    expect(root.getAttribute('data-kind')).toBe('other');
    expectCommonProps(root);
  });
});

describe('DocumentPreview', () => {
  const pages = [{ content: '第一页内容' }, { content: '第二页内容' }, { src: 'p3.png' }];

  it('翻页（非受控）与页码指示；缩放', () => {
    renderDsl({ type: 'DocumentPreview', props: { pages } });

    expect(screen.getByText('第一页内容')).toBeTruthy();
    expect(document.querySelector('[data-slot=document-preview-indicator]')!.textContent).toBe('1 / 3');
    expect(screen.getByRole('button', { name: '上一页' }).hasAttribute('disabled')).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: '下一页' }));
    expect(screen.getByText('第二页内容')).toBeTruthy();
    expect(document.querySelector('[data-slot=document-preview-indicator]')!.textContent).toBe('2 / 3');

    fireEvent.click(screen.getByRole('button', { name: '下一页' }));
    expect(document.querySelector('[data-slot=document-preview-page]')!.getAttribute('src')).toBe('p3.png');

    fireEvent.click(screen.getByRole('button', { name: '放大' }));
    expect((document.querySelector('[data-slot=document-preview-page]') as HTMLElement).style.transform).toContain('scale(1.25)');
  });

  it('受控 currentPage：翻页仅经 onChange 上报，页面不自行切换', async () => {
    const { context } = renderDsl({
      type: 'DocumentPreview',
      props: { pages, currentPage: 1 },
      events: { onChange: { action: 'setState', params: { page: '${event}' } } },
    });

    fireEvent.click(screen.getByRole('button', { name: '下一页' }));
    await expectEventState(context, 'page', 2);
    expect(screen.getByText('第一页内容')).toBeTruthy();
  });

  it('空 pages 渲染占位；通用 props', () => {
    const { container } = renderDsl({ type: 'DocumentPreview', props: { pages: [], ...COMMON_PROPS } });

    expect(screen.getByText('暂无文档内容')).toBeTruthy();
    expectCommonProps(container.querySelector('[data-slot=document-preview]'));
  });
});

describe('RichText', () => {
  it('渲染富文本 HTML；script 与内联事件被消毒剔除', () => {
    const { container } = renderDsl({
      type: 'RichText',
      props: { html: '<p>安全<strong>加粗</strong></p><script>alert(1)</script><a href="javascript:alert(1)" onclick="x()">链</a>' },
    });

    expect(screen.getByText('加粗').tagName).toBe('STRONG');
    expect(container.querySelector('script')).toBeNull();
    const link = container.querySelector('a')!;
    expect(link.getAttribute('onclick')).toBeNull();
    expect(link.getAttribute('href')).toBeNull();
  });

  it('通用 props', () => {
    const { container } = renderDsl({
      type: 'RichText',
      props: { html: '<p>探针</p>', ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=rich-text]'));
  });
});

describe('Markdown', () => {
  it('渲染标题 / 列表 / 行内代码；通用 props', () => {
    const { container } = renderDsl({
      type: 'Markdown',
      props: { content: '## 标题\n\n- 甲\n- 乙\n\n`code`', ...COMMON_PROPS },
    });

    expect(screen.getByText('标题').tagName).toBe('H2');
    expect(screen.getByText('甲')).toBeTruthy();
    expect(screen.getByText('code').tagName).toBe('CODE');
    expectCommonProps(container.querySelector('.biz-probe'));
  });
});

describe('CodeBlock', () => {
  it('按 language 高亮渲染；复制按钮写入剪贴板', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    renderDsl({ type: 'CodeBlock', props: { code: 'const a = 1;', language: 'ts' } });

    expect(screen.getByText('const')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '复制代码' }));
    expect(writeText).toHaveBeenCalledWith('const a = 1;');
  });

  it('copyable=false 不渲染复制按钮；通用 props', () => {
    const { container } = renderDsl({
      type: 'CodeBlock',
      props: { code: 'x', copyable: false, ...COMMON_PROPS },
    });

    expect(screen.queryByRole('button', { name: '复制代码' })).toBeNull();
    expectCommonProps(container.querySelector('[data-slot=code-block]'));
  });
});

describe('DiffViewer', () => {
  it('diffLines：same / del / add 操作流', () => {
    const ops = diffLines('a\nb\nc', 'a\nx\nc');
    expect(ops).toEqual([
      { type: 'same', text: 'a' },
      { type: 'del', text: 'b' },
      { type: 'add', text: 'x' },
      { type: 'same', text: 'c' },
    ]);
  });

  it('统一视图：+/- 行带语义底色；通用 props', () => {
    const { container } = renderDsl({
      type: 'DiffViewer',
      props: { oldText: '甲\n乙', newText: '甲\n丙', ...COMMON_PROPS },
    });

    const rows = container.querySelectorAll('[data-slot=diff-row]');
    expect(rows.length).toBe(3);
    expect(rows[1].getAttribute('data-type')).toBe('del');
    expect(rows[1].className).toContain('bg-destructive/10');
    expect(rows[2].getAttribute('data-type')).toBe('add');
    expect(rows[2].className).toContain('bg-success/10');
    expectCommonProps(container.querySelector('[data-slot=diff-viewer]'));
  });

  it('分栏视图：del 只占左栏、add 只占右栏，可带栏目标题', () => {
    const { container } = renderDsl({
      type: 'DiffViewer',
      props: { oldText: '旧', newText: '新', split: true, oldTitle: '旧版', newTitle: '新版' },
    });

    expect(screen.getByText('旧版')).toBeTruthy();
    const cells = container.querySelectorAll('[data-slot=diff-cell]');
    expect(cells[0].textContent).toBe('旧');
    expect(cells[1].textContent).toBe('');
    expect(cells[2].textContent).toBe('');
    expect(cells[3].textContent).toBe('新');
  });
});

describe('JSONViewer', () => {
  const data = {
    name: 'pactor',
    version: 1.2,
    stable: true,
    deps: { react: '19' },
    list: [1, 2],
    empty: null,
  };

  it('按 expandedDepth 展开；叶子值按类型着色；折叠显示摘要', () => {
    renderDsl({ type: 'JSONViewer', props: { data, expandedDepth: 1 } });

    // 根展开：一级键可见；嵌套 deps 折叠（摘要 1 键）
    expect(screen.getByText('name:')).toBeTruthy();
    expect(screen.getByText('{…} 1 键')).toBeTruthy();
    expect(screen.queryByText('react:')).toBeNull();
    expect(document.querySelector('[data-slot=json-value][data-type=string]')!.className).toContain('text-success');
    expect(document.querySelector('[data-slot=json-value][data-type=number]')!.className).toContain('text-info');
    expect(document.querySelector('[data-slot=json-value][data-type=boolean]')!.className).toContain('text-warning');
    expect(document.querySelector('[data-slot=json-value][data-type=null]')).not.toBeNull();
  });

  it('点击节点展开嵌套；复制按钮写入格式化 JSON', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    renderDsl({ type: 'JSONViewer', props: { data } });

    const toggles = document.querySelectorAll('[data-slot=json-toggle]');
    fireEvent.click(toggles[1]); // deps 节点
    expect(await screen.findByText('react:')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '复制 JSON' }));
    expect(writeText).toHaveBeenCalledWith(JSON.stringify(data, null, 2));
  });

  it('通用 props', () => {
    const { container } = renderDsl({ type: 'JSONViewer', props: { data, ...COMMON_PROPS } });
    expectCommonProps(container.querySelector('[data-slot=json-viewer]'));
  });
});
