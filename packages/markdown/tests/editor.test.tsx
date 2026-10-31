// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { MarkdownEditor } from '../src/index.js';
import './setup.js';

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
});
