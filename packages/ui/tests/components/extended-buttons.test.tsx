// @vitest-environment jsdom
/**
 * 扩展按钮族 DSL 层适配器（spec: extended-button-components DSL 层登记）：
 * ActionButton / SplitButton / CopyButton / IconMorph / ConfirmMorph /
 * FloatingButtonGroup / ExpandingButtonGroup 经 renderDsl 端到端渲染
 * （注册表 + 事件绑定），关键交互与事件语义化抛值核对。
 * jsdom 无真实布局：FloatingButtonGroup 高亮滑动、ExpandingButtonGroup
 * 宽度过渡等测量 / 过渡行为不测像素，仅验 DOM 结构与状态（与 ui 层
 * tests/ui/extended-buttons.test.tsx 的断言口径一致：data-state /
 * data-slot / fake timers）。
 */
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ConfirmMorph } from '../../src/components/components/ConfirmMorph/index.js';
import { expectEventState, renderDsl } from './helpers.js';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('ActionButton', () => {
  it('icon + label 渲染紧凑按钮，onClick 事件生效', async () => {
    const { context, container } = renderDsl({
      type: 'ActionButton',
      props: { icon: 'save', label: '保存' },
      events: { onClick: { action: 'setState', params: { clicked: true } } },
    });

    const button = container.querySelector('[data-slot=action-button]')!;
    expect(button).not.toBeNull();
    expect(button.querySelector('[data-slot=icon]')).not.toBeNull();
    expect(button.textContent).toContain('保存');

    fireEvent.click(button);
    await expectEventState(context, 'clicked', true);
  });

  it('icon-only 缺省 aria-label 回退 tooltip，保证可访问名称', () => {
    const { container } = renderDsl({
      type: 'ActionButton',
      props: { icon: 'trash', tooltip: '删除' },
    });

    const button = container.querySelector('[data-slot=action-button]')!;
    expect(button.getAttribute('aria-label')).toBe('删除');
  });
});

describe('SplitButton', () => {
  it('主按钮点击触发 onClick 且不触发 onSelect', async () => {
    const user = userEvent.setup();
    const { context, container } = renderDsl({
      type: 'SplitButton',
      props: {
        text: '保存',
        options: [
          { value: 'save-draft', label: '存为草稿' },
          { value: 'save-copy', label: '存为副本' },
        ],
      },
      events: {
        onClick: { action: 'setState', params: { clicked: true } },
        onSelect: { action: 'setState', params: { sel: '${event}' } },
      },
    });

    const root = container.querySelector('[data-slot=split-button]')!;
    expect(root).not.toBeNull();

    await user.click(screen.getByRole('button', { name: '保存' }));
    await expectEventState(context, 'clicked', true);
    expect(context.state.get('sel')).toBeUndefined();
  });

  it('下拉选择备选操作经 onSelect 抛出语义值', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl({
      type: 'SplitButton',
      props: {
        text: '保存',
        options: [
          { value: 'save-draft', label: '存为草稿' },
          { value: 'save-copy', label: '存为副本' },
        ],
      },
      events: { onSelect: { action: 'setState', params: { sel: '${event}' } } },
    });

    await user.click(screen.getByRole('button', { name: '更多选项' }));
    await screen.findByRole('menu');
    await user.click(screen.getByRole('menuitem', { name: '存为草稿' }));
    await expectEventState(context, 'sel', 'save-draft');
  });

  it('separator 渲染分隔符、section 渲染小字分区标题、href 项新窗口打开且不触发 onSelect', async () => {
    const user = userEvent.setup();
    const open = vi.fn();
    vi.stubGlobal('open', open);
    const { context } = renderDsl({
      type: 'SplitButton',
      props: {
        text: '分享',
        options: [
          { value: 'a', label: '复制链接', description: 'For LLMs and notes' },
          { value: 'divider', separator: true },
          { value: 'sec', section: 'Ask about this block' },
          { value: 'ask', label: 'Open in Claude', href: 'https://claude.ai/new?q=x' },
        ],
      },
      events: { onSelect: { action: 'setState', params: { sel: '${event}' } } },
    });

    await user.click(screen.getByRole('button', { name: '更多选项' }));
    await screen.findByRole('menu');
    // 分隔符 + 分区标题 + 第二行小灰字
    expect(screen.getByRole('separator')).not.toBeNull();
    expect(screen.getByText('Ask about this block')).not.toBeNull();
    expect(screen.getByText('For LLMs and notes')).not.toBeNull();
    // 外跳项右端渲染 lucide arrow-up-right（点击前断言：点击后菜单关闭）
    const askItem = screen.getByRole('menuitem', { name: 'Open in Claude' });
    expect(askItem.querySelector('svg.lucide-arrow-up-right')).not.toBeNull();
    // href 项：window.open(_blank) 且不触发 onSelect
    await user.click(askItem);
    expect(open).toHaveBeenCalledWith(
      'https://claude.ai/new?q=x',
      '_blank',
      'noopener,noreferrer',
    );
    expect(context.state.get('sel')).toBeUndefined();
  });
});

describe('CopyButton', () => {
  function mockClipboard(writeText: ReturnType<typeof vi.fn>) {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
  }

  it('点击写入剪贴板：copied 态 + onCopy 抛值，resetDelay 后还原', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup();
    mockClipboard(vi.fn().mockResolvedValue(undefined));
    const { context, container } = renderDsl({
      type: 'CopyButton',
      props: { value: 'pactor@1.48.0', label: '复制' },
      events: { onCopy: { action: 'setState', params: { copied: '${event}' } } },
    });

    const button = container.querySelector('[data-slot=copy-button]')!;
    expect(button.getAttribute('data-state')).toBe('idle');

    await user.click(button);
    await act(async () => {});
    expect(context.state.get('copied')).toBe('pactor@1.48.0');
    expect(button.getAttribute('data-state')).toBe('copied');
    expect(
      button.querySelector('svg[data-state=active]')?.getAttribute('class'),
    ).toContain('lucide-check');

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(button.getAttribute('data-state')).toBe('idle');
    expect(
      button.querySelector('svg[data-state=active]')?.getAttribute('class'),
    ).toContain('lucide-copy');
  });

  it('剪贴板写入失败：不进入 copied 态，onError 触发', async () => {
    const user = userEvent.setup();
    mockClipboard(vi.fn().mockRejectedValue(new Error('clipboard denied')));
    const { context, container } = renderDsl({
      type: 'CopyButton',
      props: { value: 'x', label: '复制' },
      events: { onError: { action: 'setState', params: { failed: true } } },
    });

    await user.click(container.querySelector('[data-slot=copy-button]')!);
    await expectEventState(context, 'failed', true);
    expect(
      container.querySelector('[data-slot=copy-button]')?.getAttribute('data-state'),
    ).toBe('idle');
  });
});

describe('IconMorph', () => {
  it('受控 state 经 DSL 状态表达式驱动图标对切换', async () => {
    const { context, container } = renderDsl(
      {
        type: 'IconMorph',
        props: { morph: 'menu-close', state: '${state.st}' },
      },
      { state: { st: 'a' } },
    );

    const morph = container.querySelector('[data-slot=icon-morph]')!;
    expect(morph.getAttribute('data-state')).toBe('a');

    await act(async () => {
      context.state.set('st', 'b');
    });
    expect(
      container.querySelector('[data-slot=icon-morph]')?.getAttribute('data-state'),
    ).toBe('b');
  });

  it('未知名对渲染占位图标（data-unknown），不抛错', () => {
    const { container } = renderDsl({
      type: 'IconMorph',
      props: { morph: 'not-a-pair', state: 'a' },
    });

    const morph = container.querySelector('[data-slot=icon-morph]')!;
    expect(morph.getAttribute('data-unknown')).toBe('not-a-pair');
  });
});

describe('ConfirmMorph', () => {
  it('idle → confirming → success → idle 流转，onConfirm 事件恰好一次', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup();
    const { context, container } = renderDsl({
      type: 'ConfirmMorph',
      props: { label: '删除项目', successLabel: '已删除' },
      events: { onConfirm: { action: 'setState', params: { confirmed: true } } },
    });

    const button = container.querySelector('[data-slot=confirm-morph]')!;
    expect(button.getAttribute('data-state')).toBe('idle');

    await user.click(button);
    expect(button.getAttribute('data-state')).toBe('confirming');

    await user.click(button);
    await act(async () => {});
    expect(context.state.get('confirmed')).toBe(true);
    expect(button.getAttribute('data-state')).toBe('success');

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(button.getAttribute('data-state')).toBe('idle');
  });

  it('confirming 超时未确认自动回 idle，onConfirm 未调用', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup();
    const { context, container } = renderDsl({
      type: 'ConfirmMorph',
      props: { label: '删除项目', confirmTimeout: 2000 },
      events: { onConfirm: { action: 'setState', params: { confirmed: true } } },
    });

    const button = container.querySelector('[data-slot=confirm-morph]')!;
    await user.click(button);
    expect(button.getAttribute('data-state')).toBe('confirming');

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(button.getAttribute('data-state')).toBe('idle');
    expect(context.state.get('confirmed')).toBeUndefined();
  });

  it('onConfirm reject → error，undo 回 idle 并触发 onUndo（适配器直测）', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockRejectedValue(new Error('fail'));
    const onUndo = vi.fn();
    render(
      <ConfirmMorph
        label="删除项目"
        onConfirm={onConfirm}
        onUndo={onUndo}
      />,
    );

    const button = screen.getByRole('button', { name: '删除项目' });
    await user.click(button);
    await user.click(screen.getByRole('button', { name: '确认' }));
    await act(async () => {});
    expect(button.getAttribute('data-state')).toBe('error');

    await user.click(screen.getByRole('button', { name: '撤销' }));
    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(button.getAttribute('data-state')).toBe('idle');
  });
});

describe('FloatingButtonGroup', () => {
  it('选项渲染（label / icon / 高亮块），点击经 onSelect 抛语义值', async () => {
    const user = userEvent.setup();
    const { context, container } = renderDsl({
      type: 'FloatingButtonGroup',
      props: {
        options: [
          { value: 'list', label: '列表', icon: 'list' },
          { value: 'grid', label: '网格', icon: 'grid' },
        ],
      },
      events: { onSelect: { action: 'setState', params: { view: '${event}' } } },
    });

    const root = container.querySelector('[data-slot=floating-button-group]')!;
    expect(root).not.toBeNull();
    expect(root.querySelectorAll('[data-slot=floating-button-group-item]')).toHaveLength(2);
    expect(root.querySelector('[data-slot=floating-button-group-highlight]')).not.toBeNull();
    expect(root.querySelector('[data-slot=icon]')).not.toBeNull();

    await user.click(screen.getByRole('button', { name: /网格/ }));
    await expectEventState(context, 'view', 'grid');
  });
});

describe('ExpandingButtonGroup', () => {
  it('普通选项点击即 onSelect；confirm 选项二次点击才抛出', async () => {
    const { context, container } = renderDsl({
      type: 'ExpandingButtonGroup',
      props: {
        options: [
          { value: 'edit', label: '编辑', icon: 'pencil' },
          {
            value: 'delete',
            label: '删除',
            icon: 'trash',
            confirm: true,
            confirmLabel: '确认删除',
          },
        ],
      },
      events: { onSelect: { action: 'setState', params: { picked: '${event}' } } },
    });

    const items = container.querySelectorAll(
      '[data-slot=expanding-button-group-item]',
    );
    expect(items).toHaveLength(2);

    fireEvent.click(items[0]!);
    await expectEventState(context, 'picked', 'edit');

    fireEvent.click(items[1]!);
    expect(items[1]?.hasAttribute('data-confirming')).toBe(true);
    expect(context.state.get('picked')).toBe('edit');

    fireEvent.click(items[1]!);
    await expectEventState(context, 'picked', 'delete');
  });
});
