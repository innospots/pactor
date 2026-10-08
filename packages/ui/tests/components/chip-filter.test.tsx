// @vitest-environment jsdom
/**
 * ChipFilter / ChipNode 契约（提取自 pactor-prd 模板的快筛组件）：
 * 单选 toggle 语义（点已选项回 allValue）、多选增删与「全部」清空、
 * items 非数组不渲染、事件值经 ${event} 写入 state、通用 props。
 */
import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { expectEventState, renderDsl } from './helpers.js';

const ITEMS = [
  { value: 'all', text: '全部 6' },
  { value: 'enabled', text: '启用 4' },
  { value: 'disabled', text: '停用 2', dot: '#f59e0b' },
];

function chipFilterDsl(props: Record<string, unknown>) {
  return {
    type: 'ChipFilter',
    props,
    events: {
      onChange: { action: 'setState', params: { chip: '${event}' } },
    },
  };
}

describe('ChipFilter 单选（mode: single）', () => {
  it('按 value 高亮选中项；点击未选项 onChange 传出其 value', async () => {
    const { context } = renderDsl(
      chipFilterDsl({ mode: 'single', value: 'enabled', items: ITEMS }),
    );

    const enabled = screen.getByRole('button', { name: '启用 4' });
    const all = screen.getByRole('button', { name: '全部 6' });
    expect(enabled.getAttribute('aria-pressed')).toBe('true');
    expect(all.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(screen.getByRole('button', { name: /停用 2/ }));
    await expectEventState(context, 'chip', 'disabled');
  });

  it('value 缺省视为 allValue（「全部」高亮）', () => {
    renderDsl(chipFilterDsl({ items: ITEMS }));
    expect(screen.getByRole('button', { name: '全部 6' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
  });

  it('点击已选的非「全部」项 toggle 回 allValue', async () => {
    const { context } = renderDsl(
      chipFilterDsl({ mode: 'single', value: 'enabled', items: ITEMS }),
    );
    fireEvent.click(screen.getByRole('button', { name: '启用 4' }));
    await expectEventState(context, 'chip', 'all');
  });
});

describe('ChipFilter 多选（mode: multi）', () => {
  const multiItems = [
    { value: 'all', text: '全部' },
    { value: 'a', text: '标签A' },
    { value: 'b', text: '标签B' },
  ];

  it('点击未选项追加进数组', async () => {
    const { context } = renderDsl(
      chipFilterDsl({ mode: 'multi', value: ['a'], items: multiItems }),
    );
    expect(screen.getByRole('button', { name: '标签A' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
    expect(screen.getByRole('button', { name: '全部' }).getAttribute('aria-pressed')).toBe(
      'false',
    );

    fireEvent.click(screen.getByRole('button', { name: '标签B' }));
    await expectEventState(context, 'chip', ['a', 'b']);
  });

  it('点击已选项从数组移除', async () => {
    const { context } = renderDsl(
      chipFilterDsl({ mode: 'multi', value: ['a'], items: multiItems }),
    );
    fireEvent.click(screen.getByRole('button', { name: '标签A' }));
    await expectEventState(context, 'chip', []);
  });

  it('无选择时「全部」高亮；点击「全部」清空选择', async () => {
    const empty = renderDsl(chipFilterDsl({ mode: 'multi', value: [], items: multiItems }));
    expect(
      within(empty.container).getByRole('button', { name: '全部' }).getAttribute('aria-pressed'),
    ).toBe('true');

    const selected = renderDsl(
      chipFilterDsl({ mode: 'multi', value: ['a', 'b'], items: multiItems }),
    );
    fireEvent.click(within(selected.container).getByRole('button', { name: '全部' }));
    await expectEventState(selected.context, 'chip', []);
  });

  it('items 非数组时不渲染任何内容', () => {
    const { container } = renderDsl({ type: 'ChipFilter', props: { items: '${state.missing}' } });
    expect(container.querySelector('[data-slot=chip-filter]')).toBeNull();
  });
});

describe('ChipNode', () => {
  it('渲染文案与色点，onClick 事件生效', async () => {
    const { context, container } = renderDsl({
      type: 'ChipNode',
      props: { text: '启用 4', selected: true, dot: '#22c55e' },
      events: { onClick: { action: 'setState', params: { clicked: true } } },
    });
    const chip = screen.getByRole('button', { name: /启用 4/ });
    expect(chip.getAttribute('aria-pressed')).toBe('true');
    expect(container.querySelector('[data-slot=chip-dot]')).not.toBeNull();

    fireEvent.click(chip);
    await expectEventState(context, 'clicked', true);
  });
});
