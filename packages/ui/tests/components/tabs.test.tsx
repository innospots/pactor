// @vitest-environment jsdom
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderDsl } from './helpers.js';

describe('Tabs 容器', () => {
  it('items 的 children DslNode 数组经 renderChildren 渲染出 Button', () => {
    renderDsl({
      type: 'Tabs',
      props: {
        items: [
          {
            key: 'a',
            label: '页签A',
            children: [{ type: 'Button', props: { text: '页签内按钮' } }],
          },
          { key: 'b', label: '页签B' },
        ],
      },
    });

    expect(screen.getByText('页签A')).toBeTruthy();
    expect(screen.getByRole('button', { name: '页签内按钮' })).toBeTruthy();
  });

  it('切换页签触发 onChange 事件并传出新 key', async () => {
    const { context } = renderDsl({
      type: 'Tabs',
      props: {
        items: [
          { key: 'a', label: '页签A' },
          { key: 'b', label: '页签B' },
        ],
      },
      events: {
        onChange: { action: 'setState', params: { tab: '${event}' } },
      },
    });

    // Base UI Tabs.Tab 在 click 时激活（原 Radix 在 mousedown 时激活）
    fireEvent.click(screen.getByText('页签B'));
    await vi.waitFor(() => {
      expect(context.state.get('tab')).toBe('b');
    });
  });

  it('variant="line" 时 TabsList 带 data-variant=line（下划线样式钩子）', () => {
    const { container } = renderDsl({
      type: 'Tabs',
      props: {
        variant: 'line',
        items: [
          { key: 'a', label: '页签A' },
          { key: 'b', label: '页签B' },
        ],
      },
    });

    const list = container.querySelector('[data-slot=tabs-list]');
    expect(list?.getAttribute('data-variant')).toBe('line');
    expect(list?.className).toContain('border-b');
    // 页签栏默认通栏（w-full + 靠左），触发器取消 flex-1 拉伸
    expect(list?.className).toContain('w-full');
    expect(list?.className).toContain('justify-start');
    expect(list?.className).not.toContain('w-fit');
    const trigger = container.querySelector('[data-slot=tabs-trigger]');
    expect(trigger?.className).toContain('flex-none');
  });

  it('缺省 variant 为 default（胶囊样式）', () => {
    const { container } = renderDsl({
      type: 'Tabs',
      props: { items: [{ key: 'a', label: '页签A' }] },
    });

    const list = container.querySelector('[data-slot=tabs-list]');
    expect(list?.getAttribute('data-variant')).toBe('default');
    expect(list?.className).toContain('bg-muted');
  });

  it('胶囊触发器带专用手型类 pactor-tabs-pill（line 变体不带）', () => {
    const pill = renderDsl({
      type: 'Tabs',
      props: { items: [{ key: 'a', label: '页签A' }] },
    });
    const line = renderDsl({
      type: 'Tabs',
      props: { variant: 'line', items: [{ key: 'a', label: '页签A' }] },
    });

    expect(
      pill.container
        .querySelector('[data-slot=tabs-trigger]')
        ?.className.split(/\s+/),
    ).toContain('pactor-tabs-pill');
    expect(
      line.container
        .querySelector('[data-slot=tabs-trigger]')
        ?.className.split(/\s+/),
    ).not.toContain('pactor-tabs-pill');
  });
});

describe('Tabs page 变体（可编辑页面页签）', () => {
  it('variant=page：页签栏标记 page，激活页签渲染 icon，尾部渲染新增按钮', async () => {
    const { container, context } = renderDsl({
      type: 'Tabs',
      props: {
        variant: 'page',
        addLabel: '新建页面',
        items: [
          { key: 'a', label: '页签A', icon: 'eye' },
          { key: 'b', label: '页签B' },
        ],
      },
      events: {
        onAdd: { action: 'setState', params: { added: true } },
      },
    });

    const list = container.querySelector('[data-slot=tabs-list]') as HTMLElement;
    expect(list.getAttribute('data-variant')).toBe('page');
    expect(list.className).toContain('pactor-tabs-page');

    const trigger = container.querySelector('[data-slot=tabs-trigger]') as HTMLElement;
    const icon = trigger.querySelector('[data-slot=tabs-trigger-icon]');
    expect(icon).not.toBeNull();
    expect(icon?.querySelector('svg')).not.toBeNull();
    // 页签名始终作为可访问名称的一部分（图标装饰性 aria-hidden）
    expect(screen.getByRole('tab', { name: '页签A' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '新建页面' }));
    await vi.waitFor(() => {
      expect(context.state.get('added')).toBe(true);
    });
  });

  it('closable：关闭按钮传出页签 key，且不切换激活页签', async () => {
    const { container, context } = renderDsl({
      type: 'Tabs',
      props: {
        variant: 'page',
        items: [
          { key: 'a', label: '页签A' },
          { key: 'b', label: '页签B', closable: true },
        ],
      },
      events: {
        onClose: { action: 'setState', params: { closed: '${event}' } },
      },
    });

    const close = screen.getByRole('button', { name: '关闭 页签B' });
    expect(close.getAttribute('data-slot')).toBe('tabs-trigger-close');
    // 关闭按钮与页签按钮是兄弟节点，不在 Tab 内部
    expect(close.closest('[data-slot=tabs-trigger]')).toBeNull();

    fireEvent.click(close);
    await vi.waitFor(() => {
      expect(context.state.get('closed')).toBe('b');
    });
    expect(
      container.querySelector('[data-slot=tabs-trigger][aria-selected=true]')?.textContent,
    ).toContain('页签A');
  });

  it('非 page 变体忽略 closable / addLabel（不渲染关闭与新增按钮）', () => {
    const { container } = renderDsl({
      type: 'Tabs',
      props: {
        addLabel: '新建页面',
        items: [{ key: 'a', label: '页签A', closable: true, icon: 'eye' }],
      },
    });

    expect(container.querySelector('[data-slot=tabs-trigger-icon]')).toBeNull();
    expect(container.querySelector('[data-slot=tabs-trigger-close]')).toBeNull();
    expect(container.querySelector('[data-slot=tabs-add]')).toBeNull();
  });
});

describe('Tabs 内容区样式', () => {
  it('contentClassName/contentStyle 作用于全部页签内容区，item 级 className/style 叠加', () => {
    const { container } = renderDsl({
      type: 'Tabs',
      props: {
        contentClassName: 'pane-base',
        contentStyle: { padding: 8 },
        items: [
          {
            key: 'a',
            label: '页签A',
            className: 'pane-a',
            style: { minHeight: 100 },
            children: [{ type: 'Text', props: { text: 'A 内容' } }],
          },
          { key: 'b', label: '页签B' },
        ],
      },
    });

    // Base UI Panel 默认只挂载激活页签的内容区
    const paneA = container.querySelector('[data-slot=tabs-content]') as HTMLElement;
    expect(paneA.className).toContain('pane-base');
    expect(paneA.className).toContain('pane-a');
    expect(paneA.style.padding).toBe('8px');
    expect(paneA.style.minHeight).toBe('100px');

    // 切换到页签 B：内容区带组件级样式但不带页签 A 的 item 级样式
    fireEvent.click(screen.getByRole('tab', { name: '页签B' }));
    const paneB = container.querySelector('[data-slot=tabs-content]') as HTMLElement;
    expect(paneB.className).toContain('pane-base');
    expect(paneB.className).not.toContain('pane-a');
    expect(paneB.style.padding).toBe('8px');
    expect(paneB.style.minHeight).toBe('');
  });
});

describe('Tabs 竖排（tabPosition=left）', () => {
  it('根节点横向排布、List 纵向且设置 orientation=vertical', () => {
    const { container } = renderDsl({
      type: 'Tabs',
      props: {
        tabPosition: 'left',
        items: [
          { key: 'a', label: '基本' },
          { key: 'b', label: '权限' },
        ],
      },
    });

    const root = container.querySelector('[data-slot=tabs]') as HTMLElement;
    expect(root.className).toContain('flex-row');

    const list = container.querySelector('[data-slot=tabs-list]') as HTMLElement;
    expect(list.getAttribute('aria-orientation')).toBe('vertical');
    expect(list.className).toContain('flex-col');

    const content = container.querySelector('[data-slot=tabs-content]') as HTMLElement;
    expect(content.className).toContain('flex-1');
  });

  it('缺省 top：行为不变（无 vertical 标记）', () => {
    const { container } = renderDsl({
      type: 'Tabs',
      props: { items: [{ key: 'a', label: '基本' }] },
    });
    const root = container.querySelector('[data-slot=tabs]') as HTMLElement;
    expect(root.className).not.toContain('flex-row');
    // horizontal 为 Base UI 默认方向，不输出 aria-orientation
    expect(
      container.querySelector('[data-slot=tabs-list]')!.getAttribute('aria-orientation'),
    ).not.toBe('vertical');
  });
});
