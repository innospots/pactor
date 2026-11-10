// @vitest-environment jsdom
/**
 * ChipSelect 契约：已选维度以可关闭 Chip 渲染（x 删除并按新数组回写）、
 * 触发器打开浮层展示维度网格、点选未选维度追加并关闭浮层、已选维度
 * 不重复追加、items 缺省时仅渲染触发器。
 */
import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { expectEventState, renderDsl } from './helpers.js';

const ITEMS = [
  { value: 'channel', text: '会话渠道' },
  { value: 'agentTeam', text: '接待坐席团队' },
  { value: 'qualityLevel', text: '质检等级' },
];

function chipSelectDsl(props: Record<string, unknown>) {
  return {
    type: 'ChipSelect',
    props: {
      items: ITEMS,
      triggerText: '筛选',
      title: '添加筛选（选一个维度）',
      ...props,
    },
    events: {
      onChange: { action: 'setState', params: { filters: '${event}' } },
    },
  };
}

/** 打开 Popover 浮层并等待内容挂载 */
async function openPanel() {
  fireEvent.click(screen.getByRole('button', { name: '筛选' }));
  await vi.waitFor(() => {
    expect(document.querySelector('[data-slot=popover-content]')).not.toBeNull();
  });
}

describe('ChipSelect', () => {
  it('已选维度渲染为 Chip，点 x 从数组移除', async () => {
    const { context, container } = renderDsl(
      chipSelectDsl({ value: ['channel', 'qualityLevel'] }),
    );

    const chips = container.querySelectorAll('[data-slot=chip-select-chip]');
    expect(chips).toHaveLength(2);
    expect(chips[0].textContent).toContain('会话渠道');

    fireEvent.click(
      within(chips[0] as HTMLElement).getByRole('button', {
        name: '移除 会话渠道',
      }),
    );
    await expectEventState(context, 'filters', ['qualityLevel']);
  });

  it('触发器打开浮层：标题与维度网格可见', async () => {
    renderDsl(chipSelectDsl({ value: [] }));
    await openPanel();

    const panel = document.querySelector('[data-slot=chip-select-panel]') as HTMLElement;
    expect(within(panel).getByText('添加筛选（选一个维度）')).toBeTruthy();
    for (const item of ITEMS) {
      expect(within(panel).getByRole('button', { name: item.text })).toBeTruthy();
    }
  });

  it('点选未选维度追加进数组并关闭浮层', async () => {
    const { context } = renderDsl(chipSelectDsl({ value: ['channel'] }));
    await openPanel();

    const panel = document.querySelector('[data-slot=chip-select-panel]') as HTMLElement;
    fireEvent.click(within(panel).getByRole('button', { name: '质检等级' }));

    await expectEventState(context, 'filters', ['channel', 'qualityLevel']);
    await vi.waitFor(() => {
      expect(document.querySelector('[data-slot=popover-content]')).toBeNull();
    });
  });

  it('已选维度在浮层内为 pressed 态，点击不重复追加', async () => {
    const { context } = renderDsl(chipSelectDsl({ value: ['channel'] }));
    await openPanel();

    const panel = document.querySelector('[data-slot=chip-select-panel]') as HTMLElement;
    const channel = within(panel).getByRole('button', { name: '会话渠道' });
    expect(channel.getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(channel);
    // 未触发 onChange：state 未被写入，浮层保持打开
    expect(context.state.get('filters')).toBeUndefined();
    expect(document.querySelector('[data-slot=popover-content]')).not.toBeNull();
  });

  it('items 非数组时仅渲染触发器；通用 props 生效', () => {
    const { container } = renderDsl({
      type: 'ChipSelect',
      props: {
        items: '${state.missing}',
        value: ['custom'],
        triggerText: '筛选',
        className: 'biz-probe',
        style: { opacity: 0.5 },
      },
    });

    const root = container.querySelector('[data-slot=chip-select]') as HTMLElement;
    expect(root.classList.contains('biz-probe')).toBe(true);
    expect(root.style.opacity).toBe('0.5');
    expect(screen.getByRole('button', { name: '筛选' })).toBeTruthy();
    // 值不在 items 中时退化为原值文案
    expect(root.textContent).toContain('custom');
  });
});
