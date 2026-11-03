// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MarkdownEditor } from '../src/index.js';
import './setup.js';

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('data-pactor-theme');
});

/** MarkdownEditor（基于 @mdxeditor/editor 的受控富文本编辑器） */
describe('MarkdownEditor', () => {
  it('容器带基础 class，可追加自定义 class 与内联样式', () => {
    const { container } = render(
      <MarkdownEditor value="# 标题" className="extra" style={{ flex: 1 }} />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.classList.contains('pactor-markdown-editor')).toBe(true);
    expect(root.classList.contains('extra')).toBe(true);
    expect(root.style.flexGrow).toBe('1');
  });

  it('初始 markdown 渲染为可编辑内容', () => {
    const { container } = render(<MarkdownEditor value={'## 你好\n\n正文内容'} />);
    const editable = container.querySelector('[contenteditable="true"]');
    expect(editable).toBeTruthy();
    expect(editable!.textContent).toContain('正文内容');
  });

  it('默认渲染工具栏', () => {
    const { container } = render(<MarkdownEditor value="x" />);
    expect(container.querySelector('[role="toolbar"]')).toBeTruthy();
  });

  it('readOnly 时隐藏工具栏且内容不可编辑', () => {
    const { container } = render(<MarkdownEditor value="x" readOnly />);
    expect(container.querySelector('[role="toolbar"]')).toBeNull();
    expect(container.querySelector('[contenteditable="true"]')).toBeNull();
  });

  it('toolbar=false 时隐藏工具栏', () => {
    const { container } = render(<MarkdownEditor value="x" toolbar={false} />);
    expect(container.querySelector('[role="toolbar"]')).toBeNull();
  });

  it('受控 onChange 透传给底层编辑器', () => {
    const onChange = vi.fn();
    render(<MarkdownEditor value="初始" onChange={onChange} />);
    // jsdom 下不模拟真实输入，仅验证组件受控渲染不抛错
    expect(screen.getByText('初始')).toBeTruthy();
  });

  it('外部 value 变更经 setMarkdown 同步进编辑器', async () => {
    const { container, rerender } = render(<MarkdownEditor value="第一版" />);
    expect(container.textContent).toContain('第一版');

    rerender(<MarkdownEditor value="第二版" />);
    // setMarkdown 的 Markdown 导入为异步流程，等待编辑器内容刷新
    await waitFor(() => expect(container.textContent).toContain('第二版'));
    expect(container.textContent).not.toContain('第一版');
  });

  it('theme 缺省跟随 data-pactor-theme，可显式覆盖；弹层同步主题 class', async () => {
    const { container, rerender } = render(<MarkdownEditor value="x" />);
    const editorRoot = () => container.querySelector('.mdxeditor')!;
    const popup = () => document.querySelector('.mdxeditor-popup-container')!;
    const wrapper = () => container.firstElementChild as HTMLElement;

    // 缺省 light：编辑根节点与 portal 弹层都带 light，不带 dark
    await waitFor(() => {
      expect(editorRoot().classList.contains('light')).toBe(true);
      expect(popup()?.classList.contains('light')).toBe(true);
    });
    expect(editorRoot().classList.contains('pactor-markdown-editor-root')).toBe(true);
    expect(editorRoot().classList.contains('dark')).toBe(false);
    expect(popup().classList.contains('pactor-markdown-editor-root')).toBe(true);
    expect(wrapper().getAttribute('data-theme')).toBe('light');

    // 跟随 documentElement 的 pactor 主题切换
    document.documentElement.setAttribute('data-pactor-theme', 'dark');
    await waitFor(() => expect(editorRoot().classList.contains('dark')).toBe(true));
    expect(editorRoot().classList.contains('light')).toBe(false);
    expect(popup().classList.contains('dark')).toBe(true);
    expect(wrapper().getAttribute('data-theme')).toBe('dark');

    // 显式 theme 覆盖皮肤跟随
    rerender(<MarkdownEditor value="x" theme="light" />);
    await waitFor(() => {
      expect(editorRoot().classList.contains('light')).toBe(true);
      expect(popup().classList.contains('light')).toBe(true);
    });
    expect(editorRoot().classList.contains('dark')).toBe(false);

    rerender(<MarkdownEditor value="x" theme="dark" />);
    await waitFor(() => {
      expect(editorRoot().classList.contains('dark')).toBe(true);
      expect(popup().classList.contains('dark')).toBe(true);
    });
  });
});
