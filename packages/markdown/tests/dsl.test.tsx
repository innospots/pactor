// @vitest-environment jsdom
import type { PageDsl } from '@pactor-app/core';
import { Registry } from '@pactor-app/core';
import { createPageRuntime, PageRuntimeView } from '@pactor-app/runtime';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  MARKDOWN_DSL_TYPE,
  MARKDOWN_EDITOR_DSL_TYPE,
  MarkdownDslComponent,
  MarkdownEditorDslComponent,
  registerMarkdownComponents,
} from '../src/index.js';
import './setup.js';

/** DSL 组件注册（spec: markdown-renderer / Requirement: DSL 组件注册） */
describe('registerMarkdownComponents', () => {
  it('注册 DSL 类型 Markdown 与 MarkdownEditor', () => {
    const registry = new Registry<unknown>('ComponentRegistry');
    registerMarkdownComponents(registry);
    expect(registry.has(MARKDOWN_DSL_TYPE)).toBe(true);
    expect(registry.get(MARKDOWN_DSL_TYPE)).toBe(MarkdownDslComponent);
    expect(registry.has(MARKDOWN_EDITOR_DSL_TYPE)).toBe(true);
    expect(registry.get(MARKDOWN_EDITOR_DSL_TYPE)).toBe(MarkdownEditorDslComponent);
  });
});

describe('PageRuntime 端到端', () => {
  it('DSL Markdown 节点渲染出 strong 元素（Scenario: DSL 渲染 Markdown）', async () => {
    const pageDsl: PageDsl = {
      dsl: '1.0',
      page: { id: 'markdown-demo', title: 'Markdown 示例' },
      body: {
        type: 'Markdown',
        props: { content: '**加粗** 与 [外链](https://example.com)' },
      },
    };

    const components = new Registry<unknown>('ComponentRegistry');
    registerMarkdownComponents(components);

    const runtime = createPageRuntime(pageDsl, { components });
    const { container } = render(<PageRuntimeView runtime={runtime} />);
    await runtime.initialized;

    expect(container.querySelector('.pactor-markdown strong')?.textContent).toBe(
      '加粗',
    );
    const link = screen.getByRole('link', { name: '外链' });
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toContain('noreferrer');

    await runtime.destroy();
  });

  it('props.content 中的表达式由 Renderer 解析后传入', async () => {
    const pageDsl: PageDsl = {
      dsl: '1.0',
      page: { id: 'markdown-expr', title: '表达式' },
      state: { keyword: '手机' },
      body: {
        type: 'Markdown',
        props: { content: '当前筛选：**${state.keyword}**' },
      },
    };

    const components = new Registry<unknown>('ComponentRegistry');
    registerMarkdownComponents(components);

    const runtime = createPageRuntime(pageDsl, { components });
    const { container } = render(<PageRuntimeView runtime={runtime} />);
    await runtime.initialized;

    expect(container.querySelector('strong')?.textContent).toBe('手机');

    await runtime.destroy();
  });

  it('DSL MarkdownEditor 节点渲染可编辑区与工具栏，value 表达式解析后传入', async () => {
    const pageDsl: PageDsl = {
      dsl: '1.0',
      page: { id: 'markdown-editor-demo', title: 'MarkdownEditor 示例' },
      state: { draft: '## 草稿\n\n初始内容' },
      body: {
        type: 'MarkdownEditor',
        props: { value: '${state.draft}' },
        events: {
          onChange: [{ action: 'setState', params: { draft: '${event}' } }],
        },
      },
    };

    const components = new Registry<unknown>('ComponentRegistry');
    registerMarkdownComponents(components);

    const runtime = createPageRuntime(pageDsl, { components });
    const { container } = render(<PageRuntimeView runtime={runtime} />);
    await runtime.initialized;

    const editable = container.querySelector('[contenteditable="true"]');
    expect(editable).toBeTruthy();
    expect(editable!.textContent).toContain('初始内容');
    expect(container.querySelector('[role="toolbar"]')).toBeTruthy();

    await runtime.destroy();
  });

  it('DSL MarkdownEditor 只读与隐藏工具栏（readOnly / toolbar=false）', async () => {
    const pageDsl: PageDsl = {
      dsl: '1.0',
      page: { id: 'markdown-editor-readonly', title: '只读' },
      body: {
        type: 'MarkdownEditor',
        props: { value: '正文', readOnly: true },
      },
    };

    const components = new Registry<unknown>('ComponentRegistry');
    registerMarkdownComponents(components);

    const runtime = createPageRuntime(pageDsl, { components });
    const { container } = render(<PageRuntimeView runtime={runtime} />);
    await runtime.initialized;

    expect(container.querySelector('[role="toolbar"]')).toBeNull();
    expect(container.querySelector('[contenteditable="true"]')).toBeNull();

    await runtime.destroy();
  });
});
