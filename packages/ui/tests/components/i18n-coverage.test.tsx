// @vitest-environment jsdom
/**
 * i18n 覆盖三态契约（spec: i18n「内置组件默认文案国际化」）：
 * 基础组件默认文案——缺省（无 Provider，回退内置中文）、
 * Provider locale=en-US（内置英文）、业务 messages 覆盖（优先 prop 之外
 * 的最高优先级）。复杂组件用最小 props 渲染空态，避免真实资源依赖。
 */
import type { DslNode, I18nMessages } from '@pactor-app/core';
import {
  createRuntimeContext,
  DslRenderer,
  I18nContextProvider,
  registerBuiltinActions,
  type RuntimeContext,
} from '@pactor-app/runtime';
import { fireEvent, render, screen, type RenderResult } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { createComponentRegistry } from '../../src/components/index.js';
import { renderDsl } from './helpers.js';

/** 以指定 locale/messages 渲染 DSL（Provider 包裹 DslRenderer） */
function renderDslI18n(
  node: DslNode,
  locale: string,
  messages?: I18nMessages,
): RenderResult & { context: RuntimeContext } {
  const context = createRuntimeContext({
    locale,
    messages,
    components: createComponentRegistry(),
  });
  registerBuiltinActions(context.actions);
  const result = render(
    <I18nContextProvider value={context.i18n}>
      <DslRenderer context={context} node={node} />
    </I18nContextProvider>,
  );
  return { context, ...result };
}

/** 断言：缺省中文 + en-US 英文（可见文本走 screen，aria 走 container） */
function expectZhEn(
  node: DslNode,
  zh: string,
  en: string,
): void {
  const { unmount: unmountZh } = renderDsl(node);
  expect(screen.getByText(zh)).toBeTruthy();
  unmountZh();

  const { unmount: unmountEn } = renderDslI18n(node, 'en-US');
  expect(screen.getByText(en)).toBeTruthy();
  unmountEn();
}

function expectZhEnAria(
  node: DslNode,
  ariaLabelZh: string,
  ariaLabelEn: string,
): void {
  const { container, unmount: unmountZh } = renderDsl(node);
  expect(container.querySelector(`[aria-label="${ariaLabelZh}"]`)).not.toBeNull();
  unmountZh();

  const { container: enContainer, unmount: unmountEn } = renderDslI18n(node, 'en-US');
  expect(
    enContainer.querySelector(`[aria-label="${ariaLabelEn}"]`),
  ).not.toBeNull();
  unmountEn();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('i18n 覆盖：pagination', () => {
  const node: DslNode = {
    type: 'Pagination',
    props: { total: 100, pageSize: 10, showTotal: true },
  };

  it('缺省中文 / en-US 统计文案', () => {
    expectZhEn(node, '共 100 条', 'Total 100');
  });

  it('messages 覆盖优先级高于内置默认', () => {
    const { unmount } = renderDslI18n(node, 'zh-CN', {
      'pactor.pagination.total': '共 {{count}} 条记录',
    });
    expect(screen.getByText('共 100 条记录')).toBeTruthy();
    unmount();
  });
});

describe('i18n 覆盖：upload', () => {
  const node: DslNode = { type: 'Upload', props: { drag: true } };

  it('缺省中文 / en-US 拖拽区文案', () => {
    expectZhEn(node, '点击或拖拽文件到此区域', 'Click or drag files here');
  });
});

describe('i18n 覆盖：transfer', () => {
  const node: DslNode = { type: 'Transfer' };

  it('缺省中文 / en-US 列标题', () => {
    const { container, unmount } = renderDsl(node);
    expect(container.textContent).toContain('列表 1');
    expect(container.textContent).toContain('列表 2');
    unmount();

    const { container: enContainer, unmount: unmountEn } = renderDslI18n(node, 'en-US');
    expect(enContainer.textContent).toContain('List 1');
    expect(enContainer.textContent).toContain('List 2');
    unmountEn();
  });
});

describe('i18n 覆盖：tour', () => {
  const node: DslNode = {
    type: 'Tour',
    props: { open: true, steps: [{ title: '步骤一', content: '内容' }] },
  };

  it('缺省中文 / en-US 末步按钮', () => {
    expectZhEn(node, '完成', 'Done');
  });
});

describe('i18n 覆盖：timePicker / colorPicker / cascader / treeSelect / combobox', () => {
  it('TimePicker placeholder 缺省中文 / en-US', () => {
    expectZhEn({ type: 'TimePicker' }, '请选择时间', 'Select time');
  });

  it('ColorPicker placeholder 缺省中文 / en-US', () => {
    expectZhEn({ type: 'ColorPicker' }, '请选择颜色', 'Select color');
  });

  it('Cascader placeholder 缺省中文 / en-US', () => {
    expectZhEn({ type: 'Cascader' }, '请选择', 'Please select');
  });

  it('TreeSelect placeholder 缺省中文 / en-US', () => {
    expectZhEn({ type: 'TreeSelect' }, '请选择', 'Please select');
  });

  it('Combobox 空结果复用 command.empty：缺省中文 / en-US', () => {
    const node: DslNode = { type: 'Combobox' };

    const { container, unmount } = renderDsl(node);
    fireEvent.click(container.querySelector('button[type="button"]')!);
    expect(screen.getByText('无匹配结果')).toBeTruthy();
    unmount();

    const { container: enContainer, unmount: unmountEn } = renderDslI18n(node, 'en-US');
    fireEvent.click(enContainer.querySelector('button[type="button"]')!);
    expect(screen.getByText('No results found')).toBeTruthy();
    unmountEn();
  });
});

describe('i18n 覆盖：documentPreview / jsonViewer / filePreview', () => {
  it('DocumentPreview 空态缺省中文 / en-US', () => {
    expectZhEn({ type: 'DocumentPreview' }, '暂无文档内容', 'No document content');
  });

  it('JSONViewer 摘要缺省中文 / en-US', () => {
    expectZhEn(
      { type: 'JSONViewer', props: { data: [1, 2], expandedDepth: 0 } },
      '[…] 2 项',
      '[…] 2 items',
    );
  });

  it('FilePreview 未命名文件缺省中文 / en-US', () => {
    expectZhEn({ type: 'FilePreview' }, '未命名文件', 'Untitled file');
  });
});

describe('i18n 覆盖：rate / timeline / list / tag / tree / backTop / codeBlock / chatInput / imageViewer / header', () => {
  it('Rate 星级 aria 缺省中文 / en-US', () => {
    expectZhEnAria({ type: 'Rate' }, '第 1 星', 'Star 1');
  });

  it('Timeline 进行中缺省中文 / en-US', () => {
    expectZhEn({ type: 'Timeline', props: { pending: true } }, '进行中', 'In progress');
  });

  it('List 空态复用 table.empty：缺省中文 / en-US / messages 覆盖', () => {
    expectZhEn({ type: 'List' }, '暂无数据', 'No data');

    const { unmount } = renderDslI18n({ type: 'List' }, 'zh-CN', {
      'pactor.table.empty': '列表为空',
    });
    expect(screen.getByText('列表为空')).toBeTruthy();
    unmount();
  });

  it('Tag 关闭 aria 复用 overlay.close：缺省中文 / en-US', () => {
    expectZhEnAria(
      { type: 'Tag', props: { text: '标签', closable: true } },
      '关闭',
      'Close',
    );
  });

  it('Tree 拖拽排序 aria 缺省中文 / en-US', () => {
    expectZhEnAria(
      { type: 'Tree', props: { draggable: true, treeData: [{ key: 'a', title: 'A' }] } },
      '拖拽排序',
      'Drag to reorder',
    );
  });

  it('BackTop 回到顶部 aria 缺省中文 / en-US', () => {
    expectZhEnAria(
      { type: 'BackTop', props: { visibilityHeight: -1 } },
      '回到顶部',
      'Back to top',
    );
  });

  it('CodeBlock 复制 aria 缺省中文 / en-US', () => {
    expectZhEnAria(
      { type: 'CodeBlock', props: { code: 'const x = 1;' } },
      '复制代码',
      'Copy code',
    );
  });

  it('ChatInput 发送 aria 缺省中文 / en-US', () => {
    expectZhEnAria({ type: 'ChatInput' }, '发送', 'Send');
  });

  it('ImageViewer 灯箱 aria 缺省中文 / en-US（点击预览打开）', () => {
    const node: DslNode = {
      type: 'ImageViewer',
      props: { src: 'https://example.com/a.png', alt: '示例图' },
    };

    const { container, unmount } = renderDsl(node);
    fireEvent.click(container.querySelector('[data-slot=image-viewer] img')!);
    expect(
      container.querySelector('[aria-label="图片查看"]'),
    ).not.toBeNull();
    unmount();

    const { container: enContainer, unmount: unmountEn } = renderDslI18n(node, 'en-US');
    fireEvent.click(enContainer.querySelector('[data-slot=image-viewer] img')!);
    expect(
      enContainer.querySelector('[aria-label="View image"]'),
    ).not.toBeNull();
    unmountEn();
  });

  it('Header 主题切换 aria 缺省中文 / en-US', () => {
    expectZhEnAria(
      { type: 'Header', props: { themeToggle: true } },
      '切换明暗主题',
      'Toggle theme',
    );
  });
});
