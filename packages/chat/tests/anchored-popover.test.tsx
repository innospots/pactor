// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AnchoredPopover } from '../src/view/AnchoredPopover.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/** 构造锚点 DOMRect（jsdom 下直接 new DOMRect 可用） */
function anchorRect(top: number, left: number = 100, height: number = 32): DOMRect {
  return new DOMRect(left, top, 160, height);
}

/** mock 弹层量取尺寸（jsdom offsetHeight/offsetWidth 恒为 0） */
function mockPopoverSize(height: number, width: number = 200): void {
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(height);
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(width);
}

describe('AnchoredPopover（chat-builtin-features 设计决策 D3）', () => {
  it('渲染内容，类名带 pactor-chat-popover，缺省 role 为 dialog', () => {
    mockPopoverSize(120);
    render(
      <AnchoredPopover anchorRect={anchorRect(400)} onClose={() => {}}>
        <div>弹层内容</div>
      </AnchoredPopover>,
    );

    const popover = screen.getByRole('dialog');
    expect(popover.className).toContain('pactor-chat-popover');
    expect(screen.getByText('弹层内容')).toBeTruthy();
  });

  it('Escape 关闭；焦点在弹层内时先 blur 还给 body', () => {
    mockPopoverSize(120);
    const onClose = vi.fn();
    render(
      <AnchoredPopover anchorRect={anchorRect(400)} onClose={onClose}>
        <button type="button">内部按钮</button>
      </AnchoredPopover>,
    );

    const button = screen.getByText('内部按钮');
    button.focus();
    expect(document.activeElement).toBe(button);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(document.body);
  });

  it('弹层外 pointerdown 关闭；弹层内点击不关闭', () => {
    mockPopoverSize(120);
    const onClose = vi.fn();
    render(
      <div>
        <AnchoredPopover anchorRect={anchorRect(400)} onClose={onClose}>
          <button type="button">内部按钮</button>
        </AnchoredPopover>
        <button type="button">外部按钮</button>
      </div>,
    );

    fireEvent.pointerDown(screen.getByText('内部按钮'));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.pointerDown(screen.getByText('外部按钮'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('上方空间充足时展示在锚点上方（bottom 定位，无 --below）', () => {
    mockPopoverSize(120);
    const rect = anchorRect(400);
    render(
      <AnchoredPopover anchorRect={rect} onClose={() => {}}>
        内容
      </AnchoredPopover>,
    );

    const popover = screen.getByRole('dialog');
    expect(popover.className).not.toContain('pactor-chat-popover--below');
    // bottom = viewport.height - anchorRect.top + sideOffset
    expect(popover.style.bottom).toBe(`${window.innerHeight - 400 + 8}px`);
    expect(popover.style.top).toBe('');
    expect(popover.style.visibility).toBe('visible');
  });

  it('上方空间不足（弹层高度超过 anchorRect.top）时翻转到下方（--below）', () => {
    mockPopoverSize(300);
    const rect = anchorRect(100);
    render(
      <AnchoredPopover anchorRect={rect} onClose={() => {}}>
        内容
      </AnchoredPopover>,
    );

    const popover = screen.getByRole('dialog');
    expect(popover.className).toContain('pactor-chat-popover--below');
    // top = anchorRect.bottom + sideOffset
    expect(popover.style.top).toBe(`${rect.bottom + 8}px`);
    expect(popover.style.bottom).toBe('');
  });

  it('水平左对齐锚点，且不溢出视口右缘（clamp）', () => {
    mockPopoverSize(120, 300);
    // anchorRect.left 已贴近右缘：1024 - 100 - 300 - 8 < 100，需 clamp
    const rect = anchorRect(400, window.innerWidth - 100);
    render(
      <AnchoredPopover anchorRect={rect} onClose={() => {}}>
        内容
      </AnchoredPopover>,
    );

    const popover = screen.getByRole('dialog');
    expect(popover.style.left).toBe(`${window.innerWidth - 300 - 8}px`);
  });
});
