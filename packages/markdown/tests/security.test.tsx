// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { isSafeUrl, MarkdownRenderer } from '../src/index.js';
import './setup.js';

/**
 * 安全边界测试（spec: markdown-renderer / HTML 注入拒绝 + 链接协议白名单）。
 * 锁定"不启用 rehype-raw"约定：script / 事件属性绝不进入渲染结果。
 */
describe('MarkdownRenderer HTML 注入拒绝', () => {
  it('script 注入被拒绝（Scenario: script 注入被拒绝）', () => {
    const { container } = render(
      <MarkdownRenderer content={'前文\n\n<script>alert(1)</script>\n\n后文'} />,
    );
    // 原始 HTML 不渲染为元素（不启用 rehype-raw）
    expect(container.querySelector('script')).toBeNull();
  });

  it('带事件属性的 img 注入被拒绝（Scenario: script 注入被拒绝）', () => {
    const { container } = render(
      <MarkdownRenderer content={'<img src=x onerror=alert(1)>'} />,
    );
    // 原始 HTML 不渲染为元素：img 不存在，onerror 属性更无从谈起
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('[onerror]')).toBeNull();
  });

  it('任意原始 HTML 标签不渲染为元素', () => {
    const { container } = render(
      <MarkdownRenderer content={'<div class="evil">注入</div>\n\n<iframe src="https://evil.example"></iframe>'} />,
    );
    expect(container.querySelector('div.evil')).toBeNull();
    expect(container.querySelector('iframe')).toBeNull();
  });
});

describe('链接 / 图片协议白名单', () => {
  it('isSafeUrl：白名单与相对路径放行，危险协议拒绝', () => {
    expect(isSafeUrl('https://example.com', 'link')).toBe(true);
    expect(isSafeUrl('http://example.com', 'link')).toBe(true);
    expect(isSafeUrl('mailto:a@b.com', 'link')).toBe(true);
    expect(isSafeUrl('/docs/guide', 'link')).toBe(true);
    expect(isSafeUrl('#anchor', 'link')).toBe(true);
    expect(isSafeUrl('javascript:alert(1)', 'link')).toBe(false);
    expect(isSafeUrl('JavaScript:alert(1)', 'link')).toBe(false);
    expect(isSafeUrl('data:text/html,<script>', 'link')).toBe(false);
    expect(isSafeUrl(undefined, 'link')).toBe(false);
    // 图片不允许 mailto:
    expect(isSafeUrl('mailto:a@b.com', 'image')).toBe(false);
    expect(isSafeUrl('https://example.com/a.png', 'image')).toBe(true);
  });

  it('javascript 协议链接渲染为纯文本，无 a 元素（Scenario: javascript 协议被拒绝）', () => {
    const { container } = render(
      <MarkdownRenderer content={'[点击](javascript:alert(1))'} />,
    );
    expect(container.querySelector('a')).toBeNull();
    expect(container.textContent).toContain('点击');
    expect(container.innerHTML).not.toContain('javascript:');
  });

  it('http(s) 外链带 target="_blank" 且 rel 含 noreferrer（Scenario: 外链安全属性）', () => {
    render(<MarkdownRenderer content={'[官网](https://example.com)'} />);
    const link = screen.getByRole('link', { name: '官网' });
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toContain('noreferrer');
  });

  it('mailto 与相对路径链接放行，且不带 target/rel', () => {
    render(
      <MarkdownRenderer content={'[邮件](mailto:a@b.com) [文档](./guide.md)'} />,
    );
    const mail = screen.getByRole('link', { name: '邮件' });
    expect(mail.getAttribute('href')).toBe('mailto:a@b.com');
    expect(mail.getAttribute('target')).toBeNull();
    const relative = screen.getByRole('link', { name: '文档' });
    expect(relative.getAttribute('href')).toBe('./guide.md');
    expect(relative.getAttribute('target')).toBeNull();
  });

  it('危险协议的图片 src 不渲染', () => {
    const { container } = render(
      <MarkdownRenderer content={'![x](javascript:alert(1))'} />,
    );
    expect(container.querySelector('img')).toBeNull();
  });
});
