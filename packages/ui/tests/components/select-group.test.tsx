// @vitest-environment jsdom
import { within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { renderDsl } from './helpers.js';

/** 与当前 trigger 绑定的 listbox（避免并行用例里其它 Select portal 污染全局 role 查询） */
async function listboxForTrigger(trigger: Element): Promise<HTMLElement> {
  return vi.waitFor(() => {
    const id = trigger.getAttribute('aria-controls');
    if (!id) throw new Error('missing aria-controls');
    const node = document.getElementById(id);
    if (!node) throw new Error('missing listbox');
    return node;
  });
}

const groupedOptions = [
  { label: '全部对象', value: 'all' },
  {
    label: '按类别',
    options: [
      { label: '所有实体', value: 'entity' },
      { label: '所有事件', value: 'event' },
    ],
  },
  {
    label: '具体对象',
    options: [
      { label: '供应商', value: 'supplier' },
      { label: '客户', value: 'customer' },
    ],
  },
];

describe('Select 分组选项', () => {
  it('平铺选项与分组混排渲染，选中组内选项后触发器展示对应 label', async () => {
    const user = userEvent.setup();
    const { container } = renderDsl(
      {
        type: 'Select',
        props: { options: groupedOptions, value: '${state.selection}' },
        events: {
          onChange: {
            action: 'setState',
            params: { selection: '${event}' },
          },
        },
      },
      { state: { selection: 'supplier' } },
    );

    const trigger = container.querySelector('[data-slot=select-trigger]')!;
    // 未打开过 popup 时也能经 items 映射显示组内选项 label
    expect(trigger.textContent).toContain('供应商');

    await user.click(trigger);
    const listbox = await listboxForTrigger(trigger);

    const groups = listbox.querySelectorAll('[data-slot=select-group]');
    expect(groups).toHaveLength(2);
    const labels = Array.from(
      listbox.querySelectorAll('[data-slot=select-label]'),
    ).map((label) => label.textContent);
    expect(labels).toEqual(['按类别', '具体对象']);
    expect(within(listbox).getAllByRole('option')).toHaveLength(5);

    // 分组内选项缩进，平铺选项保持原有左内边距
    const groupedItem = within(listbox).getByRole('option', { name: '所有实体' });
    expect(groupedItem.className).toContain('pl-8');
    const flatItem = within(listbox).getByRole('option', { name: '全部对象' });
    expect(flatItem.className).not.toContain('pl-8');

    await user.click(within(listbox).getByRole('option', { name: '客户' }));
    await vi.waitFor(() => {
      expect(trigger.textContent).toContain('客户');
    });
    // 等弹层退出动画结束，避免关闭期的全局监听影响下一个用例
    await new Promise((resolve) => setTimeout(resolve, 300));
  });

  it('搜索按叶子选项过滤，隐藏无命中子项的分组标题', async () => {
    const user = userEvent.setup();
    const { container } = renderDsl({
      type: 'Select',
      props: {
        // 11 个叶子选项（含分组内）触发自动搜索
        options: [
          ...groupedOptions,
          {
            label: '其他对象',
            options: Array.from({ length: 6 }, (_, index) => ({
              label: `对象 ${index + 1}`,
              value: `object-${index + 1}`,
            })),
          },
        ],
      },
    });

    const trigger = container.querySelector<HTMLElement>(
      '[data-slot=select-trigger]',
    )!;
    trigger.focus();
    await user.keyboard('{Enter}');
    const listbox = await listboxForTrigger(trigger);
    expect(listbox.querySelector('[data-slot=select-search]')).not.toBeNull();

    await user.type(listbox.querySelector('[data-slot=select-search] input')!, '供应');

    await vi.waitFor(() => {
      const labels = Array.from(
        listbox.querySelectorAll('[data-slot=select-label]'),
      ).map((label) => label.textContent);
      expect(labels).toEqual(['具体对象']);
    });
    expect(within(listbox).getByRole('option', { name: '供应商' })).toBeTruthy();
    expect(within(listbox).queryByRole('option', { name: '客户' })).toBeNull();
    expect(within(listbox).queryByText('按类别')).toBeNull();
    expect(within(listbox).queryByText('全部对象')).toBeNull();

    // 关闭弹层并等退出动画结束，避免打开状态下卸载影响下一个用例
    await user.keyboard('{Escape}');
    await new Promise((resolve) => setTimeout(resolve, 300));
  });

  it('仅平铺选项时行为不变：无分组节点、无自动搜索', async () => {
    const user = userEvent.setup();
    const { container } = renderDsl({
      type: 'Select',
      props: {
        options: [
          { label: '供应商', value: 'supplier' },
          { label: '客户', value: 'customer' },
        ],
      },
    });

    const trigger = container.querySelector<HTMLElement>(
      '[data-slot=select-trigger]',
    )!;
    trigger.focus();
    await user.keyboard('{Enter}');
    const listbox = await listboxForTrigger(trigger);

    expect(listbox.querySelector('[data-slot=select-group]')).toBeNull();
    expect(listbox.querySelector('[data-slot=select-label]')).toBeNull();
    expect(listbox.querySelector('[data-slot=select-search]')).toBeNull();
    expect(await within(listbox).findAllByRole('option')).toHaveLength(2);
  });
});
