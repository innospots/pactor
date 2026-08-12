// @vitest-environment jsdom
import './setup.js';

import { act, cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useChatAutoScroll, useSmoothStreamText } from '../src/index.js';

afterEach(cleanup);

describe('useSmoothStreamText（spec: chat-view / 平滑流式渲染）', () => {
  it('非流式直通：shown 立即等于 content', () => {
    const { result } = renderHook(
      ({ content }) => useSmoothStreamText(content, false),
      { initialProps: { content: '完整内容' } },
    );
    expect(result.current).toBe('完整内容');
  });

  it('enabled=false 时直通原文', () => {
    const { result } = renderHook(
      ({ content }) => useSmoothStreamText(content, true, { enabled: false }),
      { initialProps: { content: '流式内容' } },
    );
    expect(result.current).toBe('流式内容');
  });

  it('打字机揭示：streaming 中内容一次性追加后逐帧增长，最终对齐（spec: 打字机揭示）', async () => {
    const long = 'x'.repeat(200);
    const { result, rerender } = renderHook(
      ({ content, streaming }: { content: string; streaming: boolean }) =>
        useSmoothStreamText(content, streaming),
      { initialProps: { content: '', streaming: true } },
    );
    rerender({ content: long, streaming: true });
    // 首帧尚未推进时可见文本落后（jsdom rAF 约 16ms 一帧）
    expect(result.current.length).toBeLessThan(200);
    // 逐帧推进，最终对齐全文
    await vi.waitFor(
      () => {
        expect(result.current).toBe(long);
      },
      { timeout: 3000 },
    );
  });

  it('流停止对齐：isStreaming 翻 false 后立即对齐全文（spec: 流停止对齐）', () => {
    const { result, rerender } = renderHook(
      ({ content, streaming }: { content: string; streaming: boolean }) =>
        useSmoothStreamText(content, streaming),
      { initialProps: { content: 'abcd', streaming: true } },
    );
    rerender({ content: 'abcd', streaming: false });
    expect(result.current).toBe('abcd');
  });

  it('内容回缩立即回退，不显示幽灵尾巴', () => {
    const { result, rerender } = renderHook(
      ({ content, streaming }: { content: string; streaming: boolean }) =>
        useSmoothStreamText(content, streaming),
      { initialProps: { content: '较长的旧内容', streaming: false } },
    );
    expect(result.current).toBe('较长的旧内容');
    rerender({ content: '短', streaming: true });
    expect(result.current).toBe('短');
  });
});

describe('useChatAutoScroll（spec: chat-view / 自动滚动）', () => {
  function Harness({
    messageCount,
    lastContentLength,
    isStreaming,
  }: {
    messageCount: number;
    lastContentLength: number;
    isStreaming: boolean;
  }) {
    const { containerRef, isFollowing, scrollToBottom } = useChatAutoScroll({
      messageCount,
      lastContentLength,
      isStreaming,
    });
    return (
      <div>
        <div data-testid="scroll" ref={containerRef} />
        <div data-testid="following">{String(isFollowing)}</div>
        <button data-testid="to-bottom" onClick={scrollToBottom} />
      </div>
    );
  }

  /** jsdom 无布局：直接定义滚动几何属性 */
  function setGeometry(
    el: HTMLElement,
    geometry: { scrollHeight: number; clientHeight: number; scrollTop: number },
  ): void {
    Object.defineProperty(el, 'scrollHeight', {
      value: geometry.scrollHeight,
      configurable: true,
    });
    Object.defineProperty(el, 'clientHeight', {
      value: geometry.clientHeight,
      configurable: true,
    });
    el.scrollTop = geometry.scrollTop;
  }

  it('上翻超过 80px 释放跟随，回底恢复（spec: 上翻释放与恢复）', () => {
    render(
      <Harness messageCount={1} lastContentLength={0} isStreaming={false} />,
    );
    const scroller = screen.getByTestId('scroll');
    const following = screen.getByTestId('following');

    expect(following.textContent).toBe('true');

    // 上翻：距底 700px > 80 → 释放
    setGeometry(scroller, { scrollHeight: 1000, clientHeight: 300, scrollTop: 0 });
    fireEvent.scroll(scroller);
    expect(following.textContent).toBe('false');

    // 回底：距底 10px < 40 → 恢复
    setGeometry(scroller, { scrollHeight: 1000, clientHeight: 300, scrollTop: 690 });
    fireEvent.scroll(scroller);
    expect(following.textContent).toBe('true');
  });

  it('scrollToBottom 恢复跟随并钉底', () => {
    render(
      <Harness messageCount={1} lastContentLength={0} isStreaming={false} />,
    );
    const scroller = screen.getByTestId('scroll');
    const following = screen.getByTestId('following');

    setGeometry(scroller, { scrollHeight: 1000, clientHeight: 300, scrollTop: 0 });
    fireEvent.scroll(scroller);
    expect(following.textContent).toBe('false');

    setGeometry(scroller, { scrollHeight: 1000, clientHeight: 300, scrollTop: 0 });
    fireEvent.click(screen.getByTestId('to-bottom'));
    expect(following.textContent).toBe('true');
    expect(scroller.scrollTop).toBe(1000);
  });

  it('跟随期间内容增长时钉底（spec: 流式跟随）', () => {
    const { rerender } = render(
      <Harness messageCount={1} lastContentLength={10} isStreaming />,
    );
    const scroller = screen.getByTestId('scroll');
    setGeometry(scroller, { scrollHeight: 800, clientHeight: 300, scrollTop: 500 });

    act(() => {
      rerender(<Harness messageCount={1} lastContentLength={20} isStreaming />);
    });
    expect(scroller.scrollTop).toBe(800);
  });
});
