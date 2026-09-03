// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MarkdownRenderer } from '../src/index.js';
import './setup.js';

/** Markdown 元素渲染（spec: markdown-renderer / Requirement: Markdown 元素渲染） */
describe('MarkdownRenderer 元素渲染', () => {
  it('容器带 @pactor-app/markdown 基础 class，可追加自定义 class', () => {
    const { container } = render(
      <MarkdownRenderer content="正文" className="chat-message" />,
    );
    const root = container.firstElementChild!;
    expect(root.classList.contains('pactor-markdown')).toBe(true);
    expect(root.classList.contains('chat-message')).toBe(true);
  });

  it('通用 props：style 内联到根节点', () => {
    const { container } = render(
      <MarkdownRenderer content="正文" style={{ flex: 1 }} />,
    );
    expect((container.firstElementChild as HTMLElement).style.flexGrow).toBe('1');
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

/** 代码语法高亮（spec: markdown-renderer / Requirement: 代码语法高亮） */
describe('MarkdownRenderer 代码语法高亮', () => {
  it('已知语言经高亮渲染：token 拆分为 span（Scenario: 已知语言高亮）', () => {
    const { container } = render(
      <MarkdownRenderer content={'```ts\nconst answer: number = 42;\n```'} />,
    );
    const code = container.querySelector('pre code')!;
    expect(code.className).toContain('language-ts');
    // 高亮 token 化后出现带 style 的 span
    expect(code.querySelector('span[style]')).toBeTruthy();
    expect(code.textContent).toContain('const answer: number = 42;');
  });

  it('未注册语言降级为普通 pre/code，无高亮 token', () => {
    const { container } = render(
      <MarkdownRenderer content={'```cobol\nDISPLAY "HI".\n```'} />,
    );
    const code = container.querySelector('pre code')!;
    expect(code.className).toContain('language-cobol');
    expect(code.querySelector('span[style]')).toBeNull();
  });

  it('codeHighlight=false 时已知语言也以普通 pre/code 渲染（Scenario: 关闭高亮）', () => {
    const { container } = render(
      <MarkdownRenderer
        codeHighlight={false}
        content={'```ts\nconst answer: number = 42;\n```'}
      />,
    );
    const code = container.querySelector('pre code')!;
    expect(code.className).toContain('language-ts');
    expect(code.querySelector('span[style]')).toBeNull();
  });
});

/** 数学公式渲染（spec: markdown-renderer / Requirement: 数学公式渲染） */
describe('MarkdownRenderer 数学公式', () => {
  it('块级与行内公式渲染为 KaTeX 结构（Scenario: 块级公式）', () => {
    const { container } = render(
      <MarkdownRenderer content={'行内 $E=mc^2$ 公式\n\n$$\\int_0^1 x\\,dx = \\frac{1}{2}$$'} />,
    );
    const katex = container.querySelectorAll('.katex');
    expect(katex.length).toBeGreaterThanOrEqual(2);
    // 块级公式的 TeX 源保留在 annotation 中
    const annotations = [...container.querySelectorAll('annotation')].map((a) =>
      a.textContent,
    );
    expect(annotations).toContain('E=mc^2');
    expect(annotations).toContain('\\int_0^1 x\\,dx = \\frac{1}{2}');
  });

  it('math=false 时公式按原文渲染', () => {
    const { container } = render(
      <MarkdownRenderer math={false} content={'$$E=mc^2$$'} />,
    );
    expect(container.querySelector('.katex')).toBeNull();
    expect(container.textContent).toContain('E=mc^2');
  });

  it('启用 math 后安全约束不变：script 与 javascript: 链接仍被拒绝（Scenario: 安全约束不变）', () => {
    const { container } = render(
      <MarkdownRenderer
        content={'<script>alert(1)</script>\n\n[点我](javascript:alert(1))'}
      />,
    );
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('a')).toBeNull();
    expect(container.textContent).toContain('点我');
  });
});
