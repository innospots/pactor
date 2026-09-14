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
