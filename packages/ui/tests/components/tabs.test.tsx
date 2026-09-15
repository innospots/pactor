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
