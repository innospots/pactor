// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MarkdownRenderer } from '../src/index.js';
import './setup.js';

/** Markdown 元素渲染（spec: markdown-renderer / Requirement: Markdown 元素渲染） */
describe('MarkdownRenderer 元素渲染', () => {
  it('容器带 pactor-markdown 基础 class，可追加自定义 class', () => {
    const { container } = render(
      <MarkdownRenderer content="正文" className="chat-message" />,
    );
    const root = container.firstElementChild!;
    expect(root.classList.contains('pactor-markdown')).toBe(true);
    expect(root.classList.contains('chat-message')).toBe(true);
  });

  it('渲染标题与列表（Scenario: 渲染标题与列表）', () => {
    render(<MarkdownRenderer content={'### 标题\n\n- 项目一\n- 项目二'} />);
    expect(screen.getByRole('heading', { level: 3, name: '标题' })).toBeTruthy();
    const items = screen.getAllByRole('listitem');
    expect(items.map((item) => item.textContent)).toEqual(['项目一', '项目二']);
  });

  it('渲染段落 / 粗体 / 斜体 / 行内代码 / 引用 / 有序列表', () => {
    const { container } = render(
      <MarkdownRenderer
        content={'段落含 **粗体** 与 *斜体* 与 `code`\n\n> 引用内容\n\n1. 第一\n2. 第二'}
      />,
    );
    expect(container.querySelector('strong')?.textContent).toBe('粗体');
    expect(container.querySelector('em')?.textContent).toBe('斜体');
    expect(container.querySelector('p code')?.textContent).toBe('code');
    expect(container.querySelector('blockquote')?.textContent).toContain('引用内容');
    expect(container.querySelectorAll('ol li')).toHaveLength(2);
  });

  it('渲染 GFM 表格与删除线（Scenario: GFM 表格）', () => {
    const { container } = render(
      <MarkdownRenderer
        content={'| 名称 | 数量 |\n| --- | --- |\n| 手机 | 2 |\n\n~~已废弃~~'}
      />,
    );
    expect(container.querySelector('table')).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: '名称' })).toBeTruthy();
    expect(screen.getByRole('cell', { name: '手机' })).toBeTruthy();
    expect(container.querySelector('del')?.textContent).toBe('已废弃');
  });

  it('渲染围栏代码块：pre/code 带 language class，内容不被解析为 HTML（Scenario: 代码块）', () => {
    const { container } = render(
      <MarkdownRenderer content={'```ts\nconst html = "<b>不解析</b>";\n```'} />,
    );
    const code = container.querySelector('pre code')!;
    expect(code.className).toContain('language-ts');
    expect(code.textContent).toContain('"<b>不解析</b>"');
    // 代码内容不会被解析为元素
    expect(code.querySelector('b')).toBeNull();
  });

  it('渲染链接与图片', () => {
    const { container } = render(
      <MarkdownRenderer content={'[文档](/docs/guide)\n\n![示意图](/assets/a.png)'} />,
    );
    const link = screen.getByRole('link', { name: '文档' });
    expect(link.getAttribute('href')).toBe('/docs/guide');
    const image = container.querySelector('img')!;
    expect(image.getAttribute('src')).toBe('/assets/a.png');
    expect(image.getAttribute('alt')).toBe('示意图');
  });
});
